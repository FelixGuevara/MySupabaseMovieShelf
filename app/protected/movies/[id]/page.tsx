// app/movies/[id]/page.tsx
import { Suspense } from "react";
import MovieDetailsClient from "./MovieDetailsClient";

export default async function MovieDetailsPage({
  params,
}: {
  // NOTE: params is a Promise now
  params: Promise<{ id: number }>;
}) {
  const { id } = await params; // unwrap the promise
  console.log("[movies/[id]/page] params:", { id });
    return (
    <div className="bg-gray-50">
      {/* 12-column grid container */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Full-width on all breakpoints */}
        <section className="col-span-12">
          <Suspense fallback={<p>Loading…</p>}>
            <MovieDetailsClient id={id} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}