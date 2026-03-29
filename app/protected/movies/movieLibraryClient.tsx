// movieLibraryClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieTable } from "./movieTable";
import { toast } from "sonner";
import { useMovies } from "@/app/contexts/MovieProvider";
import type { NewMovie } from "@/app/types/movie";
import type { Movie } from "@/app/types/movie";
import { AddMovieDialog } from './addMovieDialog';

export default function MovieLibraryPage() {
  const router = useRouter();

 const {
    filteredMovies,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    addMovie,
    editMovie,
    getById,
    deleteMovie,
    addToShelf,
    getShelfMovieIds,
  } = useMovies();

  const [addedToShelfIds, setAddedToShelfIds] = useState<Set<number>>(new Set());
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleAddNewMovie = () => setIsAddModalOpen(true);
  const handleCloseModal = () => setIsAddModalOpen(false);

  useEffect(() => {
  const loadShelfIds = async () => {
    try {
      const movieIds = await getShelfMovieIds();

      setAddedToShelfIds(new Set(movieIds));
    } catch (err) {
      console.error("Failed to load shelf movie IDs:", err);
    }
  };

  loadShelfIds();
}, [getShelfMovieIds]);

  const handleCreateMovie = async (payload: {
    title: string;
    director: string;
    releaseyear: string;
    genre: string;
    status: "completed" | "pending" | "failed";
    posterurl?: string;
  }) => {
    const movie: NewMovie = {
      title: payload.title,
      director: payload.director || "",
      releaseyear: payload.releaseyear ?? undefined,
      genre: payload.genre,
      status: payload.status,
      posterurl: payload.posterurl,
      runtime: "",
      userid: "",
      // add/align any other required fields your Movie type expects
    };

    // Optional: optimistic UI toast
    const t = toast.loading("Adding movie...");

    try {
      await addMovie(movie); 
      handleCloseModal();
      router.refresh();
    } 
    catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to add movie", { id: t });
      throw err; // rethrow so dialog doesn't close
    }
  };

  const handleViewMovie = (movie: Movie) => {
    console.log("Navigating to id:", movie.id);
    

    const id = movie.id;
    const href = `/protected/movies/${encodeURIComponent(id)}`;
    console.log("Pushing to:", href);
    router.push(href);
    setTimeout(() => console.log("Now at:", window.location.pathname), 50);
  };

  const handleAddToShelf = async (movie: Movie) => {
    const t = toast.loading("Adding to shelf...");

    try {
      await addToShelf(movie.id);
      
      setAddedToShelfIds(prev => {
        const next = new Set(prev);
        next.add(movie.id);
        return next;
      });

      toast.success(`${movie.title} has been added to your movie shelf successfully.`);
    } 
    catch (err: any) {
      toast.error(err.message ?? "Failed to add movie to shelf", { id: t });
    }
};

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex-1 bg-gray-50 h-full flex flex-col">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl text-gray-900 mb-2">Greatest Movie Collection</h1>
            <p className="text-gray-600">Build and manage your personalized movie library</p>
          </div>
          <Button onClick={handleAddNewMovie} 
          className="cursor-pointer bg-[rgb(0,76,157)] text-white hover:bg-blue-900 focus-visible:ring-2 focus-visible:ring-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Movie
          </Button>
        </div>

        {/* Container */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg text-gray-900 mb-2">My Movie Collection</h2>
            <p className="text-gray-600">
              Search and filter our movie library ({filteredMovies.length} movies)
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by movie title, or director..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
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

            <Select value={statusFilter} onValueChange={setStatusFilter as any}>
              <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="flex-1">
            <MovieTable
              movies={filteredMovies}
              onViewMovie={handleViewMovie}
              onAddToShelf={handleAddToShelf}
              addedToShelfIds={addedToShelfIds}
            />
          </div>
        </div>
      </div>


      {/* The Add Movie Dialog */}
      <AddMovieDialog
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateMovie}
      />
    </div>
  );
}
