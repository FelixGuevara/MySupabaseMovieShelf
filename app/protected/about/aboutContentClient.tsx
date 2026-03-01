'use client';

import Image from "next/image";
import Link from "next/link";

export default function AboutPageContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Top section */}
      <section className="mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          About <span className="text-[rgb(0,76,157)]">MyMovieShelf</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          MyMovieShelf is your personal space to catalog, rate, and rediscover the movies you love.
          Whether you&apos;re curating a top‑10 list, tracking watch status, or organizing shelves by
          genres, directors, and years—our goal is to make your library delightful and fast.
        </p>
      </section>

      {/* Mission & Values */}
      <section className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-gray-700">
            Help movie lovers build beautiful, searchable collections with zero friction—so
            you spend more time watching and less time managing.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">What We Value</h2>
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            <li>Speed and simplicity</li>
            <li>Ownership of your data</li>
            <li>Thoughtful design and accessibility</li>
            <li>Privacy by default</li>
          </ul>
        </div>
      </section>

      {/* Team / Tech (customize this to your reality) */}
      <section className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Image
            src="/movie-camera.svg"
            alt="MyMovieShelf"
            width={60}
            height={60}
            className="mb-3"
          />
          <h3 className="text-lg font-semibold text-gray-900">Built by Movie Fans</h3>
          <p className="mt-2 text-gray-700">
            Crafted by film lovers and engineers who cherish a tidy catalog and a great UX.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Modern Web Stack</h3>
          <p className="mt-2 text-gray-700">
            Built with Next.js, TypeScript, and Tailwind for reliability, accessibility, and speed.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Privacy‑First</h3>
          <p className="mt-2 text-gray-700">
            Your library is yours. We keep data collection minimal and transparent.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Get Started</h2>
        <p className="text-gray-700">
          Head back to your{" "}
          <Link href="/" className="font-semibold text-[rgb(0,76,157)] underline">
            Movie Library
          </Link>{" "}
          and start organizing your shelves.
        </p>
      </section>
    </div>
  );
}