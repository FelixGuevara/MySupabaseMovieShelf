// contexts/MovieCommentsProvider.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { MovieComment } from "../types/movieComment";

type MovieCommentsContextShape = {
  comments: MovieComment[];
  loading: boolean;
  error: string | null;

  addComment: (content: string) => Promise<boolean>;
  editComment: (id: number, content: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const MovieCommentContext = createContext<MovieCommentsContextShape | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
  movieId: number;
/** Enable realtime sync (on by default) */
  realtime?: boolean;
};

export function MovieCommentsProvider({ children, movieId, realtime = true }: ProviderProps) {
const supabase = createClient();
  const [comments, setComments] = useState<MovieComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
      setLoading(true);
      setError(null);
  
      // Read from the *view* that exposes camelCase + userName
      const { data, error } = await supabase
        .from("moviecomment")
        .select("*")
        .eq("movieid", movieId)
        .order("added_at", { ascending: false });

      if (error) {
        setError(error.message);
        setComments([]);
      } else {
  
        setComments((data ?? []) as MovieComment[]);
      }
      setLoading(false);
    }, [supabase]);

     useEffect(() => {
        fetchComments();
      }, [fetchComments]);
    
        // Optional: realtime sync for inserts/updates/deletes
        useEffect(() => {
          if (!realtime) return;
      
          const channel = supabase
            .channel("movies-changes")
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "moviecomment" },
              (payload) => {
                if (payload.eventType === "INSERT") {
                  const newRow = payload.new as MovieComment;
                  setComments((prev) => (prev.some((u) => u.id === newRow.id) ? prev : [newRow, ...prev]));
                } else if (payload.eventType === "UPDATE") {
                  const updated = payload.new as MovieComment;
                  setComments((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
                } else if (payload.eventType === "DELETE") {
                  const removed = payload.old as MovieComment;
                  setComments((prev) => prev.filter((u) => u.id !== removed.id));
                }
              }
            )
            .subscribe();
      
          return () => {
            supabase.removeChannel(channel);
          };
        }, [realtime]);


    const addComment = useCallback(async (content: string) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("moviecomment")
        .insert({
        userid: user.id,
        movieid: movieId,
        content,
        });

    if (error) {
        console.error("addComment error:", error);
        setError(error.message);
        return false;
    }
    return true;
    }, []);

    const editComment = useCallback(async (id: number, content: string) => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
        .from("moviecomment")
        .update({
            content,
            added_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("userid", user.id)
        .select()
        .single();

        if (error) {
        setError(error.message);
        return false;
        }

        // ✅ Optimistic UI update
        setComments((prev) =>
        prev.map((c) => (c.id === id ? data : c))
        );

        return true;
    },
    [supabase]
);

    const value: MovieCommentsContextShape = {
        comments,
        loading,
        error,
        addComment,
        editComment,
        refresh: fetchComments,
  };

    return <MovieCommentContext.Provider value={value}>{children}</MovieCommentContext.Provider>;
}

export function useMovieComments() {
  const ctx = useContext(MovieCommentContext);
  if (!ctx) throw new Error("useMovieComments must be used within MovieCommentsProvider");
  return ctx;
}