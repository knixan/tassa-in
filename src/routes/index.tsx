import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-pets.jpg";

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
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* HERO MOBIL */}
        <section className="lg:hidden flex flex-col items-center text-center gap-5 pt-4 mb-16">
          <h1 className="font-heading text-[5.5rem] font-black leading-[0.85] tracking-tighter">
            TASSA
            <span className="text-accent block">IN!</span>
          </h1>

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs font-heading font-bold uppercase tracking-wide shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
            15% rabatt första besöket
          </span>

          <div className="w-full px-2 relative">
            <div className="aspect-3/3 bg-secondary rounded-[32px] overflow-hidden border-4 border-background shadow-2xl">
              <img
                src={heroImage}
                alt="Glad hund och katt hos Tassa in!"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          <span className="inline-flex items-center font-heading px-4 py-1.5 rounded-full border border-foreground/20 text-xs font-bold uppercase tracking-widest">
            Mjölbys mysigaste djurspa
          </span>

          <p className="text-base max-w-xs text-foreground/80 leading-relaxed font-medium">
            Professionell pälsvård för din pälskling i en lugn miljö där din väns välmående alltid kommer först.
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/boka"
              className="bg-foreground text-background px-8 py-4 rounded-full font-heading font-bold text-base hover:scale-105 transition-transform"
            >
              Boka tid
            </Link>
            <Link
              to="/tjanster"
              className="px-7 py-4 rounded-full font-heading font-bold text-base border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Våra tjänster
            </Link>
          </div>
        </section>

        {/* HERO DESKTOP */}
        <section className="hidden lg:grid lg:grid-cols-2 gap-16 items-center min-h-[88vh] mb-24">
          <div className="relative z-10">
            <span className="inline-flex items-center font-heading px-4 py-1 rounded-full border border-foreground/20 text-xs font-bold uppercase tracking-widest mb-5">
              Mjölbys mysigaste djurspa
            </span>
            <h1 className="font-heading text-8xl xl:text-[9rem] 2xl:text-[11rem] font-black leading-[0.85] mb-6 tracking-tighter">
              TASSA
              <span className="text-accent block">IN!</span>
            </h1>
            <p className="text-lg max-w-md mb-8 text-foreground/80 leading-relaxed font-medium">
              Professionell pälsvård för din pälskling i en lugn miljö där din väns välmående alltid kommer först.
            </p>
            <div className="flex gap-4 items-center">
              <Link
                to="/boka"
                className="bg-foreground text-background px-10 py-5 rounded-full font-heading font-bold text-lg hover:scale-105 transition-transform"
              >
                Boka tid
              </Link>
              <Link
                to="/tjanster"
                className="px-8 py-5 rounded-full font-heading font-bold text-lg border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Våra tjänster
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/50 rounded-full blur-3xl" />
            <div className="aspect-auto h-[75vh] max-h-200 bg-secondary rounded-[60px] overflow-hidden relative rotate-2 border-4 border-background shadow-2xl">
              <img
                src={heroImage}
                alt="Glad hund och katt hos Tassa in!"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/30 to-transparent" />
            </div>
            <div className="absolute -top-6 -right-4 w-28 h-28 bg-secondary rounded-full flex items-center justify-center text-center p-3 text-[10px] font-heading font-bold uppercase leading-tight rotate-12 border border-foreground/10 shadow-lg">
              15% rabatt<br />första besöket
            </div>
            <div className="absolute bottom-8 -left-8 w-32 h-32 bg-background rounded-full shadow-xl flex items-center justify-center -rotate-12 border-4 border-card">
              <svg viewBox="0 0 100 100" className="w-28 h-28 animate-spin-slow">
                <defs>
                  <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text fontFamily="sans-serif" fontWeight="800" fontSize="11" fill="currentColor" className="text-foreground">
                  <textPath href="#circlePath">TASSA IN • DJURSPA • SEDAN 2020 • TASSA IN • DJURSPA •</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-foreground rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 gap-4">
            <h2 className="font-heading text-5xl lg:text-6xl font-black tracking-tighter leading-none">
              Tjänster för<br />alla tassar.
            </h2>
            <p className="max-w-xs text-sm font-semibold text-foreground/50 italic uppercase tracking-widest">
              Vi skräddarsyr varje behandling efter ditt djurs unika behov och pälstyp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Fullständig trim"
              desc="Bad, fön, klippning och styling enligt rasstandard eller specifika önskemål."
              shape="rounded-[40px]"
              dotOpacity="opacity-100"
            />
            <ServiceCard
              title="Lyx-spa"
              desc="Djuprengörande schamponering, avslappnande massage och fuktgivande inpackning."
              shape="rounded-[120px_40px_40px_40px] md:mt-12"
              dotOpacity="opacity-60"
            />
            <ServiceCard
              title="Kloklipp"
              desc="Snabbt och tryggt. Vi ser till att klorna hålls i perfekt längd för optimal tasshälsa."
              shape="rounded-[40px_120px_40px_40px]"
              dotOpacity="opacity-30"
            />
          </div>

          <div className="mt-12">
            <Link
              to="/tjanster"
              className="inline-flex items-center gap-2 font-heading font-bold uppercase text-sm tracking-widest border-b-2 border-foreground pb-1 hover:gap-4 transition-all"
            >
              Se alla tjänster →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-secondary rounded-[60px] lg:rounded-[80px] p-12 lg:p-32 overflow-hidden text-center">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              color: "var(--foreground)",
            }}
          />
          <div className="relative z-10">
            <h2 className="font-heading text-5xl lg:text-8xl font-black tracking-tighter mb-10 leading-none">
              Redo för lite <br />
              <span className="italic font-normal">pälskärlek?</span>
            </h2>
            <p className="text-lg lg:text-2xl mb-14 max-w-2xl mx-auto font-medium text-foreground/80">
              Boka ditt besök online på bara några sekunder. Vi ser fram emot att träffa dig och din bästa vän!
            </p>
            <Link
              to="/boka"
              className="inline-block bg-foreground text-background px-14 py-7 rounded-full font-heading font-black text-xl hover:scale-105 transition-all shadow-xl"
            >
              Hitta lediga tider nu
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

function ServiceCard({
  title,
  desc,
  shape,
  dotOpacity,
}: {
  title: string;
  desc: string;
  shape: string;
  dotOpacity: string;
}) {
  return (
    <div className={`bg-card p-10 lg:p-12 border border-foreground/5 hover:bg-secondary transition-all duration-500 group cursor-pointer ${shape}`}>
      <div className="w-14 h-14 bg-background rounded-2xl mb-10 flex items-center justify-center group-hover:bg-card transition-colors">
        <div className={`w-4 h-4 bg-foreground rounded-full ${dotOpacity}`} />
      </div>
      <h3 className="font-heading text-3xl font-extrabold mb-4 tracking-tight">{title}</h3>
      <p className="text-lg text-foreground/70 group-hover:text-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
