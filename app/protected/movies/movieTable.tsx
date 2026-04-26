"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, PlusSquare, Check } from "lucide-react"; // optional icon for "View"

interface Movie {
  id: number;
  title: string;
  releaseyear: string;
  userid: string;
  runtime: string;
  genre: string;
  director: string;
  userrating: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface MovieTableProps {
  movies: Movie[];
  onViewMovie: (movie: Movie) => void;     // used by the View button
  onAddToShelf: (movie: Movie) => void;
  addedToShelfIds: Set<number>;
}

function IconTooltip({label, children,}: { label: string; children: React.ReactNode;}) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div
        className="
          pointer-events-none
          absolute -top-8 left-1/2 -translate-x-1/2
          rounded bg-gray-900 px-2 py-1 text-xs text-white
          opacity-0 group-hover:opacity-100
          transition
          whitespace-nowrap
          z-50
        "
      >
        {label}
      </div>
    </div>
  );
}

export function MovieTable({ movies, onViewMovie, onAddToShelf, addedToShelfIds }: MovieTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-gray-900 text-white">completed</Badge>;
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            pending
          </Badge>
        );
        
      case "failed":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-1 text-xs uppercase text-gray-500 tracking-wider">
                Movie Title
              </th>
              <th className="text-left py-3 px-2 text-xs uppercase text-gray-500 tracking-wider">
                Year Release
              </th>
              <th className="text-left py-3 px-2 text-xs uppercase text-gray-500 tracking-wider">
                Run Time
              </th>
              <th className="text-left py-3 px-2 text-xs uppercase text-gray-500 tracking-wider">
                Genre
              </th>
              <th className="text-left py-3 px-2 text-xs uppercase text-gray-500 tracking-wider">
                Director
              </th>
              <th className="text-left py-3 px-2 text-xs uppercase text-gray-500 tracking-wider">
                User Rating
              </th>
              <th className="text-left py-3 px-1 text-xs uppercase text-gray-500 tracking-wider">
                Date Added
              </th>
              <th className="text-left py-3 px-1 text-xs uppercase text-gray-500 tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <td className="py-4 px-1">
                  <div className="text-gray-900">{movie.title}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-gray-600">{movie.releaseyear}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-gray-900">{movie.runtime}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-gray-900">{movie.genre}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-gray-900">{movie.director}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-gray-900">{movie.userrating}</div>
                </td>
                <td className="py-4 px-1">
                  <div className="text-gray-600">{movie.date ? new Date(movie.date).toLocaleDateString("en-US") : "—"}</div>
                </td>
                <td className="py-4 px-1">{getStatusBadge(movie.status)}</td>
                <td className="py-4 px-1">
                    {/* View Movie */}
                    <IconTooltip label="View Movie Details">
                      <Button
                        variant="outline"
                        size="icon"
                        className="me-1 h-8 w-8 bg-[rgb(0,76,157)] text-white hover:bg-blue-900"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onViewMovie(movie);
                        }}
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </Button>
                    </IconTooltip>

                    {/* Add to Shelf */}          
                    <IconTooltip label={addedToShelfIds.has(movie.id) ? "Already in Shelf" : "Add to Shelf"}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-[rgb(0,76,157)] text-white hover:bg-blue-900"
                        onClick={(e) => {
                          if (addedToShelfIds.has(movie.id)) return;
                          e.preventDefault();
                          e.stopPropagation();
                          onAddToShelf(movie);
                        }}
                      >
                        
                        {addedToShelfIds.has(movie.id) ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <PlusSquare className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </IconTooltip>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 px-4 text-center text-gray-500">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}