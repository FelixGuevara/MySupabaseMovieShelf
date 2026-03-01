import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";
import Image from "next/image"; 

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <Image src="/welcome.jpg" alt="Home" width={300} height={300} className="object-contain" />
      </div>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The fastest way to build your movie collection
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-2" />
    </div>
  );
}
