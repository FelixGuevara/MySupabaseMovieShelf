// types/movie.ts
export interface Movie {
  id: number;
  title: string;
  releaseyear: string;
  userid: string;
  runtime: string;
  genre: string;
  director: string;
  date: string; // ISO or display string
  status: "completed" | "pending" | "failed";
  posterurl?: string; 
}

export type NewMovie = {
  title: string;
  releaseyear: string;
  runtime: string;
  genre: string;
  director: string;
  status: "completed" | "pending" | "failed";
  posterurl?: string | null;
  userid: string;
};