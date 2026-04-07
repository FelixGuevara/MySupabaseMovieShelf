import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMovies } from "@/app/contexts/MovieProvider";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type Status = "completed" | "pending" | "failed";

interface MovieCardProps {
  movie: Movie;
  onViewMovie: (movie: Movie) => void; 
}

const MovieCard = ({ movie, onViewMovie }: MovieCardProps) => {

  const { editMovie } = useMovies();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

    // Local editable state (prefilled)
    const [form, setForm] = React.useState(() => ({
      title: movie?.title ?? "",
      releaseyear: movie?.releaseyear ?? "",
      runtime: movie?.runtime ?? "",
      genre: movie?.genre ?? "",
      director: movie?.director ?? "",
      posterurl: movie?.posterurl ?? "",
      status: (movie?.status ?? "pending") as Status,
    }));

    React.useEffect(() => {
        if (movie) {
          setForm({
            title: movie.title ?? "",
            releaseyear: movie.releaseyear ?? "",
            runtime: movie.runtime ?? "",
            genre: movie.genre ?? "",
            director: movie.director ?? "",
            posterurl: movie?.posterurl ?? "",
            status: (movie.status ?? "pending") as Status,
          });
        }
      }, [movie]);
      
    // ---- Edit handlers
    const onChange =
        (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
          setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    const onStatusChange = (value: string) => {
    setForm((f) => ({ ...f, status: value as Status }));
    };

    const submitEdit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!/^\d{4}$/.test(form.releaseyear.trim())) {
      toast.error("Release year must be a 4-digit year (e.g., 1994).");
      return;
    }

    setSaving(true);
    try {
      const updated = { ...movie, ...form, id: movie.id };

      await Promise.resolve(editMovie(updated.id, updated)); // supports sync/async
      toast.success(`Saved changes to “${updated.title}”.`);
      setIsEditOpen(false);
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

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
        <button className="flex items-center px-2 py-2 gap-1 text-xs bg-indigo-600 rounded-md"                         
                onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewMovie(movie);
                }}>
          <Eye className="h-5 w-5" />
          Details
        </button>

            {/* EDIT (Dialog) */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center px-3 py-2 text-xs bg-zinc-700 rounded-md">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit “{movie.title}”</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={onChange("title")}
                  placeholder="Movie title"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="releaseYear">Release Year</Label>
                  <Input
                    id="releaseYear"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    value={form.releaseyear}
                    onChange={onChange("releaseyear")}
                    placeholder="1994"
                  />
                </div>
                    
                <div className="grid gap-2">
                  <Label htmlFor="runTime">Run Time</Label>
                  <Input
                    id="runTime"
                    value={form.runtime}
                    onChange={onChange("runtime")}
                    placeholder="2h 22m"
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={form.genre}
                    onChange={onChange("genre")}
                    placeholder="Drama"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    value={form.director}
                    onChange={onChange("director")}
                    placeholder="Frank Darabont"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="posterUrl">Poster URL</Label>
                <Input
                  id="posterurl"
                  placeholder="https://image.tmdb.org/t/p/w500/xxxx.jpg"
                  value={form.posterurl}
                  onChange={onChange("posterurl")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={onStatusChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving} type="button">
                Cancel
              </Button>
              <Button className="cursor-pointer" onClick={submitEdit} disabled={saving} type="button">
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MovieCard;