import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { Tjanster } from "@/components/tjanster";
import { Cta } from "@/components/cta";
import heroImage from "@/assets/tassain-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tassa in! – Professionell djurvård för katter & hundar" },
      {
        name: "description",
        content:
          "Tassa in! erbjuder professionell djurvård – tvätt, klippning och pälsvård för katter och hundar i Stockholm.",
      },
      { property: "og:title", content: "Tassa in! – Professionell djurvård" },
      {
        property: "og:description",
        content: "Vi tar hand om din fyrbenta vän med kärlek och omsorg.",
      },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="bg-background text-foreground selection:bg-accent overflow-x-hidden">
      <Hero />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <Tjanster />
        <Cta />
      </div>
    </div>
  );
}
