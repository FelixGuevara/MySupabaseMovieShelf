// contexts/MovieProvider.tsx
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
import type { Movie, NewMovie } from "../types/movie";

type StatusFilter = "all" | "completed" | "pending" | "failed";

type MovieContextShape = {
  movies: Movie[];
  filteredMovies: Movie[];
  loading: boolean;
  error: string | null;

  searchQuery: string;
  setSearchQuery: (v: string) => void;

  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;

  refresh: () => Promise<void>;

  addMovie: (u: NewMovie) => Promise<Movie | null>;
  editMovie: (id: number, patch: Partial<Omit<Movie, "id">>) => Promise<Movie | null>;
  deleteMovie: (id: number) => Promise<boolean>;
  getById: (id: number) => Movie | undefined;
};

const MovieContext = createContext<MovieContextShape | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
  /** Optional server-hydrated data */
  initialMovies?: Movie[];
  /** Enable realtime sync (on by default) */
  realtime?: boolean;
};

export function MovieProvider({ children, initialMovies, realtime = true }: ProviderProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies ?? []);
  const [loading, setLoading] = useState<boolean>(!initialMovies);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const supabase = createClient();

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Read from the *view* that exposes camelCase + userName
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, releaseyear, runtime, genre, director, date, status, posterurl, userid")
      .order("date", { ascending: false });

    if (error) {
      setError(error.message);
      setMovies([]);
    } else {
      setMovies((data ?? []) as Movie[]);
    }
    setLoading(false);
  }, []);

  // Initial load if no server data provided
  useEffect(() => {
    if (!initialMovies) fetchMovies();
  }, [initialMovies, fetchMovies]);

    // Optional: realtime sync for inserts/updates/deletes
    useEffect(() => {
      if (!realtime) return;
  
      const channel = supabase
        .channel("movies-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "movies" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newRow = payload.new as Movie;
              setMovies((prev) => (prev.some((u) => u.id === newRow.id) ? prev : [newRow, ...prev]));
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as Movie;
              setMovies((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            } else if (payload.eventType === "DELETE") {
              const removed = payload.old as Movie;
              setMovies((prev) => prev.filter((u) => u.id !== removed.id));
            }
          }
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, [realtime]);


  const filteredMovies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return movies.filter((u) => {
      const statusOk = statusFilter === "all" || (u.status ?? "").toLowerCase() === statusFilter;
      const textOk =
        !q ||
        (u.title ?? "").toLowerCase().includes(q) ||
        (u.director ?? "").toLowerCase().includes(q);
      return statusOk && textOk;
    });
  }, [movies, searchQuery, statusFilter]);

  const addMovie = useCallback(
    async (u: NewMovie) => {
      const payload = {
        title: u.title,
        releaseyear: u.releaseyear,
        runtime: u.runtime,
        genre: u.genre,
        director: u.director,
        posterurl: u.posterurl ?? null,
        userid: "c88f3f25-7bb1-482c-8ed9-7cfb8ddd0d9c",
      };
      const { data, error } = await supabase
        .from("movies")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("addMovie error:", error);
        setError(error.message);
        return null;
      }

    const inserted = data as Movie;
    setMovies((prev) => [inserted, ...prev]);
    return inserted;
  }, []);

  const editMovie = useCallback(
  async (id: number, patch: Partial<Omit<Movie, "id">>) => {
    setError(null);

    // Build a safe, snake_case patch. DO NOT include id or user_id.
    const dbPatch: Record<string, any> = {};

    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.releaseyear !== undefined) dbPatch.releaseyear = patch.releaseyear;
    if (patch.runtime !== undefined) dbPatch.runtime = patch.runtime;
    if (patch.genre !== undefined) dbPatch.genre = patch.genre;
    if (patch.director !== undefined) dbPatch.director = patch.director;
    if (patch.posterurl !== undefined) dbPatch.posterurl = patch.posterurl ?? null;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.date !== undefined) dbPatch.date = patch.date;

    // Guard: nothing to update
    if (Object.keys(dbPatch).length === 0) {
      console.warn("[editMovie] Nothing to update. Incoming keys:", Object.keys(patch));
      return movies.find((m) => m.id === id) ?? null;
    }

    console.log("[editMovie] Updating id:", id, "columns:", Object.keys(dbPatch));

    // Update the base table (no 'id' in payload!)
    const { data: idRow, error } = await supabase
      .from("movies")
      .update(dbPatch)
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    // Fetch the full row from the view so we get camelCase + userName
    const { data: fullRow, error: viewErr } = await supabase
      .from("movies")
      .select("*")
      .eq("id", idRow.id)
      .single();

    if (viewErr) {
      setError(viewErr.message);
      return null;
    }

    // If you already have a map function, use it; otherwise map inline.
    const updated: Movie = {
      id: fullRow.id, // number (your Movie.id is number now)
      title: fullRow.title,
      releaseyear: fullRow.releaseyear,
      userid: fullRow.userId,
      runtime: fullRow.runtime,
      genre: fullRow.genre,
      director: fullRow.director,
      date: fullRow.date,
      status: fullRow.status,
      posterurl: fullRow.posterurl ?? undefined,
    };

    setMovies((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  },
  [supabase, movies, setMovies, setError]
);


  const deleteMovie = useCallback(async (id: number) => {
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) {
      console.error("deleteUser error:", error);
      setError(error.message);
      return false;
    }
    setMovies((prev) => prev.filter((u) => u.id !== id));
    return true;
  }, []);

  const getById = useCallback(
    (id: number) => movies.find((u) => u.id === id),
    [movies]
  );

  const value: MovieContextShape = {
    movies,
    filteredMovies,
    loading,
    error,

    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,

    refresh: fetchMovies,

    addMovie,
    editMovie,
    deleteMovie,
    getById,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error("useMovies must be used within MovieProvider");
  return ctx;
}