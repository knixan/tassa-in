import { Link } from "@tanstack/react-router";
import { Heart, PawPrint } from "lucide-react";
import heroImage from "@/assets/tassain-hero.png";

export function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-6rem)] min-h-140 overflow-hidden">
      <img
        src={heroImage}
        alt="Glad hund och katt hos Tassa in!"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-linear-to-r from-background/50 via-background/25 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl h-full px-6 lg:px-10 flex items-center">
        <div className="max-w-xl bg-background/85 backdrop-blur-sm rounded-3xl p-6 lg:bg-transparent lg:backdrop-blur-none lg:rounded-none lg:p-0">
          <p className="font-decorative text-4xl lg:text-5xl text-primary mb-10 flex items-center gap-3 rotate-[-6deg]">
            Mjölbys mysigaste djurspa
            <Heart className="size-7 lg:size-8 stroke-[1.5] shrink-0" />
          </p>

          <h1 className="font-heading mt-10 text-[4.5rem] lg:text-[7rem] xl:text-[8rem] leading-[0.85] tracking-tight text-primary">
            TASSA
            <br />
            <span className="flex items-center gap-4">
              IN!
              <PawPrint className="size-10 lg:size-16 fill-current" />
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base lg:text-xl text-primary/80 leading-relaxed">
            Professionell pälsvård för din pälskling i en lugn miljö där din väns välmående alltid kommer först.
          </p>

          <Link
            to="/tjanster"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 font-semibold hover:scale-105 transition-transform"
          >
            Våra tjänster
            <PawPrint className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
