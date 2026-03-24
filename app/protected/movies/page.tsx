// app/movies/page.tsx
import { Suspense } from "react";
import MovieLibraryClient from "./movieLibraryClient"; // <-- alias path to the root file
import { createClient } from "@/lib/supabase/server";

export default async function MoviesPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 12-column grid container */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Full-width on all breakpoints */}
        <section className="col-span-12">
          <Suspense fallback={<p>Loading…</p>}>
              <MovieLibraryClient />
          </Suspense>
        </section>
      </div>
    </div>
  );
}