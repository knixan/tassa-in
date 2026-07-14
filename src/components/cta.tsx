import { Link } from "@tanstack/react-router";
import { Heart, PawPrint } from "lucide-react";
import bookingImage from "@/assets/tassain-boka-tid.png";

export function Cta() {
  return (
    <section className="mb-24">
      <div className="relative rounded-[48px] overflow-hidden bg-secondary min-h-105 lg:min-h-125">
        <img
          src={bookingImage}
          alt="Handduk, tvål och växt hos Tassa in!"
          className="absolute inset-0 w-full h-full object-cover object-right lg:object-left"
          loading="lazy"
        />

        <div className="relative z-10 flex h-full min-h-105 lg:min-h-125 items-center px-10 lg:px-16 py-14">
          <div className="bg-secondary/90 backdrop-blur-sm rounded-3xl p-6 lg:bg-transparent lg:backdrop-blur-none lg:rounded-none lg:p-0">
            <Heart className="mt-4 size-8 stroke-[1.5] text-primary rotate-[-6deg]" />
            <h2 className="font-heading text-4xl lg:text-5xl leading-tight text-primary">
              Redo för lite
              <br />
              pälskärlek?
            </h2>

            <Link
              to="/boka"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-8 py-4 font-semibold hover:scale-105 transition-transform"
            >
              Hitta lediga tider nu
              <PawPrint className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
