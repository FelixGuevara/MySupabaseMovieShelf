// contexts/MovieCommentProvider.tsx
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

type MovieCommentContextShape = {
    moviecomments: MovieComment[];
    loading: boolean;
    error: string | null;

    refresh: () => Promise<void>;
    addComment: (content: string) => Promise<boolean>;
    editComment: (id: number, content: string) => Promise<boolean | null>;
}

const MovieCommentContext = createContext<MovieCommentContextShape | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
  movieid?: number;
  realtime?: boolean;
};

export function MovieCommentProvider({ children, movieid, realtime = true }: ProviderProps) {
  const [moviecomments, setMovieComments] = useState<MovieComment[]>([]);
  const [loading, setLoading] = useState<boolean>(!movieid);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

const fetchMovieComment = useCallback(async () => {
  setLoading(true);
  setError(null);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    setError("Not authenticated");
    setMovieComments([]);
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("moviecomment")
    .select(`*`)
    .eq("userid", user.id)
    .order("added_at", { ascending: false });

  if (error) {
    console.log(error.message);
    setError(error.message);
    setMovieComments([]);
  } else {
    setMovieComments((data ?? []) as MovieComment[]);
  }

  setLoading(false);
}, [supabase]);

  // Initial load if no server data provided
  useEffect(() => {
    if (moviecomments.length === 0 ) fetchMovieComment();
  }, [moviecomments, fetchMovieComment]);


  const addComment = useCallback(async (content: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("moviecomment")
    .insert({
      userid: user.id,
      movieid: movieid,
      content: content,
    });

  if (error) {
      console.error("addComment error:", error);
      setError(error.message);
      return false;
  }
  return true;
}, []);

const editComment = useCallback(async (id: number, content: string) => {
  setError(null);

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

    const { data: fullRow, error: viewErr } = await supabase
      .from("moviecomment")
      .update({
        content,
        added_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("userid", user.id)
      .select()
      .single();

    if (viewErr) {
      setError(viewErr.message);
      return null;
    }

    const updated: MovieComment = {
        id: fullRow.id,       
        userid: fullRow.userid,
        movieid: fullRow.movieid,
        content: fullRow.content,
        added_at: fullRow.added_at,
        };

    setMovieComments((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return true; 

},[supabase]
);

const value: MovieCommentContextShape = {
    moviecomments,
    loading,
    error,

    refresh: fetchMovieComment,
    addComment,
    editComment,
}

    return <MovieCommentContext.Provider value={value}>{children}</MovieCommentContext.Provider>;
}

export function useMovieComment() {
  const ctx = useContext(MovieCommentContext);
  if (!ctx) throw new Error("useMovieComment must be used within MovieCommentProvider");
  return ctx;
}