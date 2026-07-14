import { Link } from "@tanstack/react-router";
import { Heart, PawPrint } from "lucide-react";
import bathImage from "@/assets/tassain-tjanster.png";
import iconTrim from "@/assets/icon-timning.png";
import iconSpa from "@/assets/icon-lyxspa.png";
import iconNails from "@/assets/icon-kloklipp.png";

const services = [
  {
    icon: iconTrim,
    title: "Fullständig trim",
    desc: "Bad, fön, klippning och styling enligt rasstandard eller specifika önskemål.",
  },
  {
    icon: iconSpa,
    title: "Lyx-spa",
    desc: "Djuprengörande schamponering, avslappnande massage och fuktgivande inpackning.",
  },
  {
    icon: iconNails,
    title: "Kloklipp",
    desc: "Snabbt och tryggt. Vi ser till att klorna hålls i perfekt längd för optimal tasshälsa.",
  },
];

export function Tjanster() {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="font-decorative text-4xl lg:text-5xl text-primary leading-[1.15] flex items-start gap-3 rotate-[-6deg]">
            Glada pälsklingar hos
            <Heart className="size-6 lg:size-7 stroke-[1.5] shrink-0 mt-1" />
          </p>
          <p className="font-decorative text-4xl lg:text-5xl text-primary leading-[1.15] block ml-16 rotate-[-6deg]">
            Tassa in!
          </p>

          <img
            src={bathImage}
            alt="Hund och katt i badkar med skum"
            className="mt-6 w-full max-w-md"
            loading="lazy"
          />

          <Link
            to="/tjanster"
            className="mt-6 inline-flex items-center ml-16 gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Se alla våra tjänster
            <PawPrint className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h2 className="font-heading text-4xl lg:text-5xl text-primary mb-8">
            Tjänster för alla tassar.
          </h2>
          <p className="mt-4 text-foreground/70 max-w-md leading-relaxed">
            Vi skräddarsyr varje behandling efter ditt djurs unika behov och pälstyp.
          </p>

          <ul className="mt-10 space-y-8">
            {services.map((service) => (
              <li key={service.title} className="flex gap-5 items-start">
                <img src={service.icon} alt="" className="h-16 w-16 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-heading text-2xl text-primary leading-tight">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-foreground/70 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
