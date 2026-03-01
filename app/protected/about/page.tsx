// app/about/page.tsx
import { Suspense } from "react";
import AboutPageContent from "./aboutContentClient";

export default function AboutPage() {
  return (

  <section className="col-span-12">
          <Suspense fallback={<p>Loading…</p>}>
            <AboutPageContent />
          </Suspense>
  </section>
  );
}