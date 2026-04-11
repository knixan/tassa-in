import { createFileRoute, Link } from "@tanstack/react-router";
import { Bath, Scissors, Sparkles, Heart, PawPrint, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tjanster")({
  head: () => ({
    meta: [
      { title: "Tjänster – Tassa in!" },
      { name: "description", content: "Upptäck våra tjänster: bad, klippning, pälsvård och kloklippning för hundar och katter." },
      { property: "og:title", content: "Tjänster – Tassa in!" },
      { property: "og:description", content: "Professionell djurvård för katter och hundar." },
    ],
  }),
  component: ServicesPage,
});

const allServices = [
  { icon: Bath, title: "Bad & Tvätt", price: "Från 399 kr", desc: "Skonsam tvätt med ekologiska schampon anpassade för hundar och katter. Inkluderar fön och borsting.", features: ["Ekologiska produkter", "Anpassat för alla pälstyper", "Avslappnande upplevelse"] },
  { icon: Scissors, title: "Klippning", price: "Från 499 kr", desc: "Professionell pälsklippning utförd av erfarna groomers. Vi klipper efter rasstandard eller önskad stil.", features: ["Rasspecifik klippning", "Styling efter önskemål", "Alla raser välkomna"] },
  { icon: Sparkles, title: "Pälsvård", price: "Från 299 kr", desc: "Grundlig borsting, filtborttagning och pälsbehandling för en frisk och glänsande päls.", features: ["Filtborttagning", "Djupgående borsting", "Pälsbehandling"] },
  { icon: Heart, title: "Kloklippning", price: "Från 149 kr", desc: "Varsam och professionell kloklippning för att hålla din vän bekväm.", features: ["Snabb behandling", "Varsam hantering", "Alla djur"] },
  { icon: PawPrint, title: "Tassbehandling", price: "Från 199 kr", desc: "Vård av tassar inklusive klippning mellan trampdynor och fuktbehandling.", features: ["Trampdyneklippning", "Fuktbehandling", "Kontroll av tasshälsa"] },
  { icon: Star, title: "VIP-paket", price: "Från 799 kr", desc: "Komplett lyxbehandling med bad, klippning, pälsvård, kloklippning och parfymering.", features: ["Allt-i-ett", "Premiumprodukt", "Rosett eller bandana"] },
];

function ServicesPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Våra tjänster
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi erbjuder allt din fyrbenta vän behöver för att se ut och må som bäst.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allServices.map((s) => (
            <div key={s.title} className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-xl hover:border-primary/30">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-7 w-7" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">{s.title}</h2>
              <p className="mt-1 text-lg font-semibold text-primary">{s.price}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg">
            <Link to="/boka">Boka din tid</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
