import MovieCard from "./MovieCard";
import { useRouter } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  releaseyear: string;
  userid: string;
  runtime: string;
  genre: string;
  director: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {

  const router = useRouter();

  const handleViewMovie = (movie: Movie) => {
      console.log("Navigating to id:", movie.id);
      

      const id = movie.id;
      const href = `/protected/movies/${encodeURIComponent(id)}`;
      console.log("Pushing to:", href);
      router.push(href);
      setTimeout(() => console.log("Now at:", window.location.pathname), 50);
  };

  if (movies.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400">
        <p className="text-lg">Your shelf is empty</p>
        <p className="text-sm mt-2">Start adding movies to your collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((_, index) => (
        <MovieCard key={index} movie={movies[index]} onViewMovie={handleViewMovie}/>
      ))}
    </div>
  );
};

export default MovieGrid;