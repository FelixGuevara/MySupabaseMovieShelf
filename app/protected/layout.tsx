import { AuthButton } from "@/components/auth-button";
import Image from "next/image"; 
import Link from "next/link";
import { Suspense } from "react";
import { MovieProvider } from "@/app/contexts/MovieProvider";
import { UserProvider } from "@/app/contexts/UserProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <body className="flex flex-col min-h-screen"> 


      {/* Header */}
        <header className="w-full p-4 bg-[rgb(0,76,157)] text-white">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-10">

              {/* Logo */}
              <Link href="/protected" className="flex items-center">
                <Image src="/movie-camera.svg" alt="Home" width={70} height={70} className="object-contain" />
              </Link>

              <nav className="flex gap-8 text-lg font-bold">
                <a href="/protected/movies" className="hover:underline">My Movie Library</a>
                <a href="/" className="hover:underline">My Movie Shelfs</a>
                <a href="/protected/about" className="hover:underline">About Us</a>
                <a href="/protected/userManager" className="hover:underline">User Manager</a>
              </nav>
            </div>

            {/* Right: Hello label */}
            <Suspense fallback={<span className="opacity-80">Loading…</span>}>
              <AuthButton />
            </Suspense>
          </div>
        </header>

        <Suspense fallback={<div className="p-4">Loading user…</div>}>
          <UserProvider>
            <Suspense fallback={<div className="p-4">Loading movies…</div>}>
              <MovieProvider>
                <main className="flex-1">{children}</main>
              </MovieProvider>
            </Suspense>
          </UserProvider>
        </Suspense>

      {/* Footer */}
        <footer className="mt-auto p-4 bg-[rgb(0,76,157)]">
            <div className="text-center pb-3 text-sm text-white"> 
              <span>Copyright © 2026 MyMovieShelf. All rights reserved. </span> 
            </div> 
        </footer> 
    </body> 
  );
}
