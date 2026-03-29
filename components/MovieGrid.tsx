import MovieCard from "./MovieCard";

const MovieGrid = () => {
  // Replace with your actual movie data
  const movies = Array.from({ length: 10 });

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
        <MovieCard key={index} />
      ))}
    </div>
  );
};

export default MovieGrid;