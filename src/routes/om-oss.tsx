import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/om-oss")({
  head: () => ({
    meta: [
      { title: "Om oss – Tassa in!" },
      { name: "description", content: "Lär känna teamet bakom Tassa in! Vi älskar djur och erbjuder professionell djurvård i Stockholm." },
      { property: "og:title", content: "Om oss – Tassa in!" },
      { property: "og:description", content: "Vi älskar djur och erbjuder professionell djurvård." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { icon: Heart, value: "5000+", label: "Nöjda kunder" },
  { icon: Award, value: "10+", label: "Års erfarenhet" },
  { icon: Users, value: "8", label: "Erfarna groomers" },
];

function AboutPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">Om Tassa in!</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Vi startade Tassa in! med en enkel vision – att ge varje hund och katt den bästa möjliga omvårdnaden.
            Vårt team består av utbildade och djurälskande groomers som behandlar varje djur som sitt eget.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center rounded-2xl border border-border bg-card p-8">
              <s.icon className="h-8 w-8 mx-auto text-primary mb-3" />
              <div className="font-heading text-3xl font-bold text-foreground">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Hos Tassa in! tror vi på att varje djur är unikt. Därför anpassar vi alltid våra behandlingar
            efter ditt djurs specifika behov, ras och temperament. Vi använder endast ekologiska och
            djurvänliga produkter av högsta kvalitet.
          </p>
          <p>
            Vår salong är designad för att vara en lugn och avslappnande miljö där ditt djur kan känna sig
            tryggt. Vi tar oss alltid tid att lära känna varje ny kund och deras fyrbenta vän.
          </p>
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg">
            <Link to="/boka">Boka ett besök</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
