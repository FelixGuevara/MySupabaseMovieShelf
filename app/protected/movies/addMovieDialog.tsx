// Add this near the bottom of your file (or extract to ./AddMovieDialog.tsx)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Reuse Select components you already import above

type AddMovieDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    director: string;
    releaseyear: string;
    genre: string;
    status: "completed" | "pending" | "failed";
    posterurl?: string;
  }) => Promise<void> | void;
};

export function AddMovieDialog({ open, onClose, onSubmit }: AddMovieDialogProps) {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [releaseyear, setYear] = useState<string>("");
  const [genre, setGenre] = useState("drama");
  const [status, setStatus] = useState<"completed" | "pending" | "failed">("pending");
  const [posterurl, setPosterUrl] = React.useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        director: director.trim(),
        releaseyear: releaseyear,
        genre,
        status,
        posterurl: posterurl.trim() || undefined,
      });
      onClose(); // close only after successful add
      // reset internal state for next open
      setTitle("");
      setDirector("");
      setYear("");
      setGenre("drama");
      setStatus("pending");
      setPosterUrl("");
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title<span className="text-red-600">*</span></Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: The Godfather" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="director">Director</Label>
            <Input id="director" value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Ex: Francis Ford Coppola" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" inputMode="numeric" min={1888} max={2999}
                value={releaseyear} onChange={(e) => setYear(e.target.value)} placeholder="1972" />
            </div>

            <div className="grid gap-2">
              <Label>Genre</Label>
              <Select value={genre} onValueChange={(v) => setGenre(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="crime">Crime</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="sci-fi">Sci-fi</SelectItem>
                  <SelectItem value="war">War</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
          <div className="grid gap-2">
            <Label htmlFor="posterUrl">Poster URL</Label>
            <Input
              id="posterUrl"
              placeholder="https://image.tmdb.org/t/p/w500/xxxx.jpg"
              value={posterurl}
              onChange={(e) => setPosterUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Movie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}