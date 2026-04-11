import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scissors, Bath, Heart, Sparkles, Dog, Cat, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";

const API_URL = import.meta.env.VITE_API_URL as string;

const ALL_SLOTS = [
  { hour: 15, label: "15:00–16:00" },
  { hour: 16, label: "16:00–17:00" },
  { hour: 17, label: "17:00–18:00" },
  { hour: 18, label: "18:00–19:00" },
];

const SERVICES = [
  "Bad & Tvätt",
  "Klippning",
  "Pälsvård",
  "Kloklippning",
  "Tassbehandling",
  "VIP-paket",
];

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
    ],
  }),
  component: HomePage,
});

const services = [
  {
    icon: Bath,
    title: "Bad & Tvätt",
    desc: "Skonsam tvätt med naturliga produkter anpassade för din husdjurs päls.",
  },
  {
    icon: Scissors,
    title: "Klippning",
    desc: "Professionell pälsklippning för alla raser och pälstyper.",
  },
  {
    icon: Sparkles,
    title: "Pälsvård",
    desc: "Borsting, filtborttagning och behandling för en frisk och glänsande päls.",
  },
  {
    icon: Heart,
    title: "Kloklippning",
    desc: "Varsam kloklippning för att hålla din vän bekväm och glad.",
  },
];

function scrollToBooking() {
  document.getElementById("boka-sektion")?.scrollIntoView({ behavior: "smooth" });
}

function BookingSection() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!date) return;
    setSelectedSlot(null);
    setAvailableSlots([]);
    setLoadingSlots(true);
    fetch(`${API_URL}/api/bookings/available?date=${date}`)
      .then((r) => r.json())
      .then((data) => setAvailableSlots(data.availableSlots ?? []))
      .catch(() => setError("Kunde inte hämta lediga tider."))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          bookingDate: date,
          timeSlot: selectedSlot,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Något gick fel. Försök igen.");
        return;
      }
      setConfirmed(true);
    } catch {
      setError("Kunde inte ansluta till servern.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-16 w-16 text-primary mb-6" />
        <h3 className="font-heading text-2xl font-bold text-foreground">
          Bokning bekräftad!
        </h3>
        <p className="mt-3 text-muted-foreground max-w-sm">
          Vi har tagit emot din bokning för{" "}
          <strong>
            {ALL_SLOTS.find((s) => s.hour === selectedSlot)?.label}
          </strong>{" "}
          den <strong>{date}</strong>. Vi ses!
        </p>
        <Button
          className="mt-8"
          onClick={() => {
            setConfirmed(false);
            setDate("");
            setSelectedSlot(null);
            setForm({ name: "", email: "", phone: "", service: "" });
          }}
        >
          Boka en till tid
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="booking-date">Välj datum</Label>
        <Input
          id="booking-date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="max-w-xs"
        />
      </div>

      {/* Time slots */}
      {date && (
        <div className="space-y-3">
          <Label>Välj tid</Label>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Hämtar lediga tider…</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {ALL_SLOTS.map((slot) => {
                const available = availableSlots.includes(slot.hour);
                const selected = selectedSlot === slot.hour;
                return (
                  <button
                    key={slot.hour}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSlot(slot.hour)}
                    className={[
                      "rounded-xl border px-5 py-3 text-sm font-medium transition-all",
                      available
                        ? selected
                          ? "border-primary bg-primary text-primary-foreground shadow"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                        : "border-border bg-muted text-muted-foreground cursor-not-allowed line-through opacity-50",
                    ].join(" ")}
                  >
                    {slot.label}
                    {!available && (
                      <span className="ml-2 text-xs">Bokad</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contact form — show after slot selected */}
      {selectedSlot && (
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Dina uppgifter
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input
                id="name"
                placeholder="Anna Andersson"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="anna@example.se"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="070-123 45 67"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Tjänst</Label>
              <Select
                required
                value={form.service}
                onValueChange={(v) => setForm((f) => ({ ...f, service: v }))}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Välj tjänst" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Bokar…" : `Bekräfta bokning ${ALL_SLOTS.find((s) => s.hour === selectedSlot)?.label}`}
          </Button>
        </div>
      )}
    </form>
  );
}

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[85vh] grid-cols-1 items-center gap-8 py-16 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground mb-6">
                <Dog className="h-4 w-4" />
                <span>Hundar</span>
                <span className="text-border">•</span>
                <Cat className="h-4 w-4" />
                <span>Katter</span>
              </div>
              <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Din vän förtjänar{" "}
                <span className="text-primary">det bästa</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-lg">
                Professionell djurvård med kärlek och omsorg. Vi tvättar, klipper
                och pysslar om din fyrbenta familjemedlem så att den alltid mår som
                bäst.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" variant="default" onClick={scrollToBooking}>
                  Boka tid
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/tjanster">Våra tjänster</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 rounded-3xl bg-accent/40 blur-2xl" />
                <img
                  src={heroImage}
                  alt="Glad hund och katt hos Tassa in! djurvård"
                  className="relative rounded-2xl shadow-2xl object-cover w-full aspect-square"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Våra tjänster
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder ett brett utbud av tjänster för att hålla din hund eller
              katt i toppform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-xl border border-border bg-background p-6 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="default" size="lg">
              <Link to="/tjanster">Se alla tjänster</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Booking section */}
      <section id="boka-sektion" className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Boka tid
            </h2>
            <p className="mt-4 text-muted-foreground">
              Välj ett datum och en ledig tid. Vi är öppna 15:00–19:00.
            </p>
          </div>
          <BookingSection />
        </div>
      </section>
    </div>
  );
}
