import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  addMonths,
  subMonths,
  startOfDay,
} from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, type AvailableSlot } from "@/lib/api";
import { bookingSchema } from "@/lib/schemas";

const contactSchema = bookingSchema.omit({ date: true, startTime: true });
type ContactInput = z.input<typeof contactSchema>;
type ContactOutput = z.output<typeof contactSchema>;

const SERVICE_TYPES = [
  "Bad & Tvätt",
  "Klippning",
  "Pälsvård",
  "Kloklippning",
  "Tassbehandling",
  "VIP-paket",
] as const;
const PET_TYPES = ["Hund", "Katt"] as const;

const DAY_HEADERS = ["Må", "Ti", "On", "To", "Fr", "Lö", "Sö"];
const today = startOfDay(new Date());

function toDateStr(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function BookingCalendar() {
  const [viewMonth, setViewMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Reset the time/slot selection whenever a new date is picked. Done during
  // render (React's recommended pattern) rather than in the effect below, so
  // it doesn't cost an extra commit before the slots fetch even starts.
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    setSelectedTime(null);
    setSlots([]);
    setLoadingSlots(selectedDate !== null);
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactOutput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { petBreed: "", message: "" },
  });

  const fetchSlots = useCallback((date: Date) => {
    return api
      .getSlots(toDateStr(date))
      .then((d) => setSlots(d.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const onSubmit = async (data: ContactOutput) => {
    if (!selectedDate || !selectedTime) return;
    setSubmitError("");
    try {
      await api.createBooking({
        date: toDateStr(selectedDate),
        startTime: selectedTime,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        serviceType: data.serviceType,
        petName: data.petName,
        petType: data.petType,
        petBreed: data.petBreed,
        message: data.message,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Något gick fel.");
      // The slot may have just been taken by someone else (409) - refresh
      // availability and send the user back to the time picker instead of
      // letting them resubmit against a now-stale slot.
      setSelectedTime(null);
      setLoadingSlots(true);
      fetchSlots(selectedDate);
    }
  };

  function startOver() {
    setSubmitted(false);
    setSelectedDate(null);
    setSelectedTime(null);
    reset();
  }

  // Kalender-grid
  const monthStart = startOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });
  const prevMonthDisabled = isBefore(endOfMonth(subMonths(viewMonth, 1)), today);

  // ── Bekräftelse ──────────────────────────────────────────────────────────
  if (submitted && selectedDate && selectedTime) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-foreground">
          Bokad!
        </h3>
        <p className="mt-2 text-muted-foreground capitalize">
          {format(selectedDate, "EEEE d MMMM", { locale: sv })} · kl.{" "}
          {selectedTime}–
          {String(parseInt(selectedTime) + 1).padStart(2, "0")}:00
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Bekräftelse skickas till din e-post.
        </p>
        <Button className="mt-6" onClick={startOver}>
          Boka en till tid
        </Button>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.isAvailable);

  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-sm bg-card">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">

        {/* ── Vänster: Kalender ────────────────────────────────────────── */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Boka tid
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Välj en tid som passar dig.
            </p>
          </div>

          {/* Månadnavigering */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
              disabled={prevMonthDisabled}
              aria-label="Föregående månad"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold capitalize text-foreground">
              {format(viewMonth, "MMMM yyyy", { locale: sv })}
            </p>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label="Nästa månad"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Veckodagshuvuden */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Dagceller */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {days.map((day) => {
              const isPast = isBefore(day, today);
              const isOtherMonth = !isSameMonth(day, viewMonth);
              const isSelected = selectedDate
                ? isSameDay(day, selectedDate)
                : false;
              const isTodayDay = isSameDay(day, today);
              const disabled = isPast || isOtherMonth;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && setSelectedDate(day)}
                  className={[
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all",
                    disabled
                      ? "text-muted-foreground/30 cursor-default"
                      : "hover:bg-secondary cursor-pointer",
                    isSelected
                      ? "!bg-primary text-primary-foreground font-semibold"
                      : "",
                    isTodayDay && !isSelected
                      ? "border border-primary text-primary font-medium"
                      : "",
                    !isSelected && !isTodayDay && !disabled
                      ? "text-foreground"
                      : "",
                  ].join(" ")}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Separator ────────────────────────────────────────────────── */}
        <div className="hidden md:block bg-border" />

        {/* ── Höger: Tider eller formulär ──────────────────────────────── */}
        <div className="border-t md:border-t-0 p-6 sm:p-8">
          {!selectedDate ? (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                Välj ett datum för att se lediga tider.
              </p>
            </div>
          ) : selectedTime ? (
            // Kontaktformulär
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedTime(null)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Byt tid
                </button>
                <p className="font-semibold text-foreground capitalize">
                  {format(selectedDate, "EEEE d MMMM", { locale: sv })}
                </p>
                <p className="text-sm text-muted-foreground">
                  kl. {selectedTime}–
                  {String(parseInt(selectedTime) + 1).padStart(2, "0")}:00
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-service">Tjänst</Label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="cal-service" className="w-full">
                        <SelectValue placeholder="Välj en tjänst" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.serviceType && (
                  <p className="text-xs text-destructive">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cal-pet-name">Husdjurets namn</Label>
                  <Input
                    id="cal-pet-name"
                    placeholder="Bella"
                    {...register("petName")}
                  />
                  {errors.petName && (
                    <p className="text-xs text-destructive">
                      {errors.petName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cal-pet-type">Djurtyp</Label>
                  <Controller
                    name="petType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="cal-pet-type" className="w-full">
                          <SelectValue placeholder="Välj" />
                        </SelectTrigger>
                        <SelectContent>
                          {PET_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.petType && (
                    <p className="text-xs text-destructive">
                      {errors.petType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-pet-breed">Ras (valfritt)</Label>
                <Input
                  id="cal-pet-breed"
                  placeholder="T.ex. Labrador"
                  {...register("petBreed")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-name">Namn</Label>
                <Input
                  id="cal-name"
                  placeholder="Anna Andersson"
                  autoComplete="name"
                  {...register("ownerName")}
                />
                {errors.ownerName && (
                  <p className="text-xs text-destructive">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-email">E-post</Label>
                <Input
                  id="cal-email"
                  type="email"
                  placeholder="anna@example.se"
                  autoComplete="email"
                  {...register("ownerEmail")}
                />
                {errors.ownerEmail && (
                  <p className="text-xs text-destructive">
                    {errors.ownerEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-phone">Telefon</Label>
                <Input
                  id="cal-phone"
                  type="tel"
                  placeholder="070-123 45 67"
                  autoComplete="tel"
                  {...register("ownerPhone")}
                />
                {errors.ownerPhone && (
                  <p className="text-xs text-destructive">
                    {errors.ownerPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cal-message">Meddelande (valfritt)</Label>
                <Textarea
                  id="cal-message"
                  placeholder="Övrig information om ditt husdjur eller önskemål…"
                  {...register("message")}
                />
              </div>

              {submitError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {submitError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Bokar…" : "Bekräfta bokning"}
              </Button>
            </form>
          ) : (
            // Tidsluckor
            <div>
              <p className="font-semibold text-foreground capitalize mb-4">
                {format(selectedDate, "EEEE d MMMM", { locale: sv })}
              </p>

              {loadingSlots ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-11 rounded-xl bg-muted animate-pulse"
                    />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  {slots.length === 0
                    ? "Stängt denna dag."
                    : "Alla tider är fullbokade."}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className="w-full rounded-xl border border-border bg-background py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5"
                    >
                      {slot.time}
                      {slot.spotsLeft === 1 && (
                        <span className="ml-2 text-xs text-amber-500 font-normal">
                          1 plats kvar
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
