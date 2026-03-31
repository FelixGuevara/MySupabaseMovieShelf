interface Movie {
  id: number;
  title: string;
  releaseyear: string;
  userid: string;
  runtime: string;
  genre: string;
  director: string;
  posterurl?: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-indigo-500 transition">

      {/* Poster */}
      <div className="aspect-[2/3] bg-zinc-800 overflow-hidden">
        <img
          src={movie.posterurl || "/posters/placeholder.jpg"}
          alt={movie.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold truncate">
          {movie.title} ({movie.releaseyear})
        </h3>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>★★★★☆</span>
          <span className="text-green-400">Watched ✓</span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
        <button className="px-3 py-1 text-xs bg-indigo-600 rounded-md">
          Details
        </button>
        <button className="px-3 py-1 text-xs bg-zinc-700 rounded-md">
          Edit
        </button>
      </div>
    </div>
  );
};

export default MovieCard;