// contexts/MovieProvider.tsx
"use client";

import React from "react";
import type { Movie } from "../types/movie";

type MovieContextValue = {
  movies: Movie[];
  addMovie: (m: Movie) => void;
  editMovie: (m: Movie) => void;
  deleteMovie: (id: string) => void;
  getById: (id: string) => Movie | undefined;
  setAll: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const initialMovies: Movie[] = [
  {
    id: "1",
    title: "The Godfather",
    releaseYear: "1972",
    user: { name: "Adaego Boniface", id: "STU/2021/001" },
    runTime: "2h 55m",
    genre: "Crime",
    director: "Francis Coppola",
    date: "2024-01-20",
    status: "completed",
    posterUrl: "/posters/godfather.jpg",
  },
  {
    id: "2",
    title: "Schindler's List",
    releaseYear: "1993",
    user: { name: "Tunuka Bakara", id: "STU/2021/003" },
    runTime: "3h 15m",
    genre: "War/Drama",
    director: "Steven Spielberg",
    date: "2024-01-19",
    status: "pending",
    posterUrl: "/posters/schindlerlist.jpg",
  },
  {
    id: "3",
    title: "Pulp Fiction",
    releaseYear: "1994",
    user: { name: "Grace Chibora", id: "STU/2021/003" },
    runTime: "2h 29m",
    genre: "Crime/Thriller",
    director: "Quentin Tarantino",
    date: "2024-01-18",
    status: "completed",
    posterUrl: "/posters/pulpfiction.jpg",
  },
  {
    id: "4",
    title: "The Dark Knight",
    releaseYear: "2008",
    user: { name: "Yusuf Ibrahim", id: "STU/2021/004" },
    runTime: "2h 32m",
    genre: "Action/Crime",
    director: "Christopher Nolan",
    date: "2024-01-17",
    status: "pending",
    posterUrl: "/posters/darkknight.jpg",
  },
  {
    id: "5",
    title: "Casablanca",
    releaseYear: "1942",
    user: { name: "Adaego Chioma", id: "STU/2021/002" },
    runTime: "1h 42m",
    genre: "Romance/War",
    director: "Michael Curtiz",
    date: "2024-01-16",
    status: "completed",
    posterUrl: "/posters/casablanca.jpg",
  },
  {
    id: "6",
    title: "Space Odyssey",
    releaseYear: "1968",
    user: { name: "Emeka Adaokwu", id: "STU/2021/006" },
    runTime: "2h 29m",
    genre: "Sci-fi/Adventure",
    director: "Stanley Kubrick",
    date: "2024-01-13",
    status: "pending",
    posterUrl: "/posters/spaceodyssey.jpg",
  },
  {
    id: "7",
    title: "Goodfellas",
    releaseYear: "1990",
    user: { name: "Felix Guevara", id: "STU/2022/007" },
    runTime: "2h 26m",
    genre: "Crime/Thriller",
    director: "Martin Scorsese",
    date: "2025-01-13",
    status: "completed",
    posterUrl: "/posters/goodfellas.jpg",
  },
  {
    id: "8",
    title: "Saving Private Ryan",
    releaseYear: "1998",
    user: { name: "Felix Guevara", id: "STU/2025/008" },
    runTime: "2h 49m",
    genre: "War/Action",
    director: "Steven Spielberg",
    date: "2025-06-13",
    status: "pending",
    posterUrl: "/posters/savingprivateryan.jpg",
  },
];

const MovieContext = React.createContext<MovieContextValue | null>(null);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = React.useState<Movie[]>(initialMovies);

  const addMovie = (m: Movie) => setMovies((prev) => [m, ...prev]);
  const editMovie = (m: Movie) =>
    setMovies((prev) => prev.map((x) => (x.id === m.id ? m : x)));
  const deleteMovie = (id: string) =>
    setMovies((prev) => prev.filter((x) => x.id !== id));
  const getById = (id: string) => movies.find((x) => x.id === id);

  const value: MovieContextValue = {
    movies,
    addMovie,
    editMovie,
    deleteMovie,
    getById,
    setAll: setMovies,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const ctx = React.useContext(MovieContext);
  if (!ctx) throw new Error("useMovies must be used within MovieProvider");
  return ctx;
}
