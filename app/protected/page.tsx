import Image from "next/image";
import { ActionCard } from "@/components/actionCard";

import {
  Film, FolderOpenDot, ListChecks, Tags, UserRound, CalendarDays,
  Star, Eye, BarChart3, Settings, Upload, BookOpenText
} from "lucide-react";


export default function Home() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Align left: remove justify-center and items-center */}
      <main className="flex w-full max-w-3xl flex-col items-start py-10 dark:bg-black">
        <div className="w-full">
          {/* Top section */}
          <section className="mb-6 py-10">
            <h3 className="text-4xl font-extrabold tracking-tight text-gray-900">
              <span className="text-[rgb(0,76,157)]">What would you like to do today?</span>
            </h3>
          </section>

          {/* Action grid */}
          <section aria-label="Quick actions">
            {/*
              Want exactly two per row on typical screens?
              Use grid-cols-1 on base (phones) and sm:grid-cols-2 from small breakpoint upward.
            */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <ActionCard href="/protected/movies" label="My Movie Library" icon={<Film className="h-5 w-5" />} />
              <ActionCard href="/stats" label="My Movie Shelfs" icon={<BarChart3 className="h-5 w-5" />} />
              <ActionCard href="/protected/about" label="About Us" icon={<BookOpenText className="h-5 w-5" />} />
              <ActionCard href="/protected/userManager" label="User Manager" icon={<UserRound className="h-5 w-5" />} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
