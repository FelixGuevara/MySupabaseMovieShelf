import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"; 
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-22 bg-[rgb(0,76,157)] text-white">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                {/* Logo */}
                <Link href="/protected" className="flex items-center mr-auto">
                  <Image src="/movie-camera.svg" alt="Home" width={70} height={70} className="object-contain" />
                </Link>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl">
          <main className="flex-1 flex flex-col gap-6 px-4">
                      
            {/* Top section */}
            <section className="mb-2">
              <div className="flex gap-8 justify-center items-center">
                <h3 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  <span className="text-[rgb(0,76,157)]">Welcome to MyMovieShelf</span>
                </h3>
                <Image src="/movie-camera.svg" alt="Home" width={50} height={50} className="object-contain" />
              </div>
            </section>

            <Hero />
            <h2 className="font-medium text-xl">Next steps</h2>
              {hasEnvVars ? <SignUpUserSteps /> : <SignUpUserSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 bg-[rgb(0,76,157)]">
          <div className="text-center pb-3 text-sm text-white"> 
              <span>Copyright © 2026 MyMovieShelf. All rights reserved. </span> 
          </div>  
        </footer>
      </div>
    </main>
  );
}
