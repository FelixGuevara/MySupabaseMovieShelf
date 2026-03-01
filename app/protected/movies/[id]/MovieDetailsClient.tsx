// app/movies/[id]/MovieDetailsClient.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieStatusBadge } from "@/components/MovieStatusBadge";
import { useMovies } from "@/app/contexts/MovieProvider";
import { toast } from "sonner";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "completed" | "pending" | "failed";

function formatDate(value: string) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-gray-900">{value}</div>
    </div>
  );
}

export default function MovieDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { getById, deleteMovie, editMovie } = useMovies();

  const normalizedId = String(id).trim();
  const movie = getById(normalizedId);

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Local editable state (prefilled)
  const [form, setForm] = React.useState(() => ({
    title: movie?.title ?? "",
    releaseYear: movie?.releaseYear ?? "",
    runTime: movie?.runTime ?? "",
    genre: movie?.genre ?? "",
    director: movie?.director ?? "",
    status: (movie?.status ?? "pending") as Status,
  }));

  React.useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title ?? "",
        releaseYear: movie.releaseYear ?? "",
        runTime: movie.runTime ?? "",
        genre: movie.genre ?? "",
        director: movie.director ?? "",
        status: (movie.status ?? "pending") as Status,
      });
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 cursor-pointer" type="button">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-gray-900">Movie not found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find a movie with id <span className="font-mono">{normalizedId}</span>.
          </p>
        </div>
      </div>
    );
  }

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
    if (!/^\d{4}$/.test(form.releaseYear.trim())) {
      toast.error("Release year must be a 4-digit year (e.g., 1994).");
      return;
    }

    setSaving(true);
    try {
      const updated = { ...movie, ...form, id: movie.id };
      await Promise.resolve(editMovie(updated)); // supports sync/async
      toast.success(`Saved changes to “${updated.title}”.`);
      setIsEditOpen(false);
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete
  const confirmDelete = () => {
    deleteMovie(movie.id);
    toast.success(`${movie.title} has been deleted successfully.`);
    setIsDeleteOpen(false);
    router.push("/movies");
  };

  return (
    <div className="p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 cursor-pointer" type="button">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-gray-900">{movie.title}</h1>
            <p className="text-gray-600">
              Added by {movie.user.name} on {formatDate(movie.date)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {/* EDIT (Dialog) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer" type="button">
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
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
                        value={form.releaseYear}
                        onChange={onChange("releaseYear")}
                        placeholder="1994"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="runTime">Run Time</Label>
                      <Input
                        id="runTime"
                        value={form.runTime}
                        onChange={onChange("runTime")}
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

            {/* DELETE (uses Dialog as a confirm) */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                  type="button"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete “{movie.title}”?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. This will permanently remove the movie from your library.
                </p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteOpen(false)} type="button">
                    Cancel
                  </Button>
                  <Button
                    className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
                    onClick={confirmDelete}
                    type="button"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Poster (left) + Meta grid (right) */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Poster column */}
          <div className="lg:col-span-4">
            <div className="relative aspect-[9/10] w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="mt-3 text-xs text-gray-600 leading-tight space-y-1">
              <div><span className="font-semibold text-gray-900">Year:</span> {movie.releaseYear}</div>
              <div><span className="font-semibold text-gray-900">Runtime:</span> {movie.runTime}</div>
              <div><span className="font-semibold text-gray-900">Genre:</span> {movie.genre}</div>
            </div>
          </div>

          {/* Meta grid column */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem label="Title" value={movie.title} />
              <DetailItem label="Release Year" value={movie.releaseYear} />
              <DetailItem label="Run Time" value={movie.runTime} />
              <DetailItem label="Genre" value={movie.genre} />
              <DetailItem label="Director" value={movie.director} />
              <DetailItem label="Added By (ID)" value={`${movie.user.name} (${movie.user.id})`} />
              <DetailItem label="Date Added" value={formatDate(movie.date)} />
              <DetailItem label="Status" value={<MovieStatusBadge status={movie.status} />} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}