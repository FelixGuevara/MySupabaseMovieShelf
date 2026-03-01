// components/ActionCard.tsx
import Link from "next/link";
import { type ReactNode } from "react";

type ActionCardProps = {
  href: string;
  label: string;
  icon?: ReactNode; 
  ariaLabel?: string;
  className?: string;
};

export function ActionCard({ href, label, icon, ariaLabel }: ActionCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}

      className={[
        "action-card", // <<— your CSS
        "group flex w-full items-center gap-3", // tailwind for layout; safe with your CSS
      ].join(" ")}
    >

      <div className="action-card__icon flex h-10 w-10 items-center justify-center rounded-md bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {/* If an icon was provided, render it. Otherwise, show a fallback hashtag. */}
        {icon ? (
          <span className="text-xl leading-none">{icon}</span>
        ) : (
          <span className="text-xl leading-none">#</span>
        )}
      </div>
      <div className="action-card__label text-base font-semibold">{label}</div>
    </Link>
  );
}
