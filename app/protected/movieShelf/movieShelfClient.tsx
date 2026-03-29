// movieShelfClient.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useMovies } from "@/app/contexts/MovieProvider";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MovieGrid from "@/components/MovieGrid";

export default function MovieShelfPage() {
 const {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
  }= useMovies();
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

  return (
    <div className="flex-1 bg-gray-50 h-full flex flex-col">
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-2xl text-gray-900 mb-2">My Personal Movie Shelf</h1> 
                <p className="text-gray-600">Build and manage your personalized movie shelf</p>         
            </div>
        </div>
            
        {/* Container */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col">

            <div className="mb-6">
                <h2 className="text-lg text-gray-900 mb-2">My Own Movie Shelf</h2>
                <div className="text-sm text-zinc-400 flex gap-4">
                    <span>10 Movies</span>
                    <span>10 Watched</span>
                    <span>6 Favorites</span>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-80">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 bg-gray-50 border-gray-200"
                    />
                </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter as any}>
                <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Movies" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Movies</SelectItem>
                    <SelectItem value="watched">Watched</SelectItem>
                    <SelectItem value="unwatched">Unwatched</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <div className="text-sm text-zinc-200 py-6">
                <MovieGrid />
            </div>

        </div>
      </div>
    </div>
  );

}