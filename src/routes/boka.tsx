import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/boka")({
  head: () => ({
    meta: [
      { title: "Boka tid – Tassa in!" },
      { name: "description", content: "Boka en tid för djurvård hos Tassa in! Välj tjänst, datum och tid som passar dig." },
      { property: "og:title", content: "Boka tid – Tassa in!" },
      { property: "og:description", content: "Boka professionell djurvård för din hund eller katt." },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Tack för din bokning!</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Vi har tagit emot din bokningsförfrågan och återkommer inom kort med en bekräftelse via e-post.
          </p>
          <Button className="mt-8" onClick={() => setSubmitted(false)}>
            Boka en till tid
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-primary">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">Boka tid</h1>
          <p className="mt-4 text-muted-foreground">
            Fyll i formuläret nedan så kontaktar vi dig för att bekräfta din tid.
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="space-y-6 rounded-2xl border border-border bg-card p-8"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Ditt namn</Label>
              <Input id="name" placeholder="Anna Andersson" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" type="email" placeholder="anna@example.se" required />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" type="tel" placeholder="070-123 45 67" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-type">Djurtyp</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj djurtyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Hund</SelectItem>
                  <SelectItem value="cat">Katt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="breed">Ras</Label>
              <Input id="breed" placeholder="T.ex. Golden Retriever" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Tjänst</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Välj tjänst" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bath">Bad & Tvätt</SelectItem>
                  <SelectItem value="cut">Klippning</SelectItem>
                  <SelectItem value="fur">Pälsvård</SelectItem>
                  <SelectItem value="nails">Kloklippning</SelectItem>
                  <SelectItem value="paws">Tassbehandling</SelectItem>
                  <SelectItem value="vip">VIP-paket</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Önskat datum</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Önskad tid</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Välj tid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Meddelande (valfritt)</Label>
            <Textarea id="message" placeholder="Berätta gärna om ditt djurs behov, allergier eller speciella önskemål..." rows={4} />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Skicka bokningsförfrågan
          </Button>
        </form>
      </div>
    </div>
  );
}
