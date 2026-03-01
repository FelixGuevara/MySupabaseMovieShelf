// types/movie.ts
export interface Movie {
  id: string;
  title: string;
  releaseYear: string;
  user: {
    name: string;
    id: string;
  };
  runTime: string;
  genre: string;
  director: string;
  date: string; // ISO or display string
  status: "completed" | "pending" | "failed";
  posterUrl?: string; 
}