// app/movies/page.tsx
import { Suspense } from "react";
import MovieShelfClient from "./movieShelfClient"; // <-- alias path to the root file

export default async function MoviesPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 12-column grid container */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Full-width on all breakpoints */}
        <section className="col-span-12">
          <Suspense fallback={<p>Loading…</p>}>
              <MovieShelfClient />
          </Suspense>
        </section>
      </div>
    </div>
  );
}