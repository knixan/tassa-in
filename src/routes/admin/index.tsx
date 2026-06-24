import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { LogIn, CalendarDays, Trash2, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type BookingResponse } from "@/lib/api";
import { loginSchema, type LoginFormData } from "@/lib/schemas";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin – Tassa in!" }] }),
  component: AdminPage,
});

function AdminPage() {
  const token = localStorage.getItem("admin_token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  if (!isLoggedIn) {
    return <LoginForm onSuccess={() => setIsLoggedIn(true)} />;
  }

  return <BookingDashboard onLogout={() => setIsLoggedIn(false)} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      const res = await api.login(data.email, data.password);
      if (res.role !== "Admin") {
        setServerError("Åtkomst nekad. Kräver admin-behörighet.");
        return;
      }
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_name", res.fullName);
      onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Inloggning misslyckades.");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Admin-inloggning
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@tassain.se"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Loggar in…" : "Logga in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function BookingDashboard({ onLogout }: { onLogout: () => void }) {
  const adminName = localStorage.getItem("admin_name") ?? "Admin";
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.admin.getBookings(filterDate || undefined);
      setBookings(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes("401")) {
        handleLogout();
        return;
      }
      setError("Kunde inte hämta bokningar.");
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    onLogout();
  }

  async function handleDelete(id: number) {
    if (!confirm("Ta bort denna bokning?")) return;
    try {
      await api.admin.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Kunde inte ta bort bokningen.");
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Bokningar
              </h1>
              <p className="text-sm text-muted-foreground">Inloggad som {adminName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logga ut
          </Button>
        </div>

        {/* Filter + refresh */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="space-y-1">
            <Label htmlFor="filter-date">Filtrera på datum</Label>
            <Input
              id="filter-date"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {filterDate && (
            <Button variant="ghost" size="sm" onClick={() => setFilterDate("")}>
              Rensa filter
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchBookings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-muted-foreground">Laddar bokningar…</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Inga bokningar{filterDate ? " för valt datum" : ""}.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Datum & tid
                    </p>
                    <p className="font-medium text-foreground">
                      {format(parseISO(b.startUtc), "d MMM yyyy", { locale: sv })}
                    </p>
                    <p className="text-muted-foreground">kl. {b.startLocal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Husdjur
                    </p>
                    <p className="font-medium text-foreground">
                      {b.petName} ({b.petType})
                    </p>
                    {b.petBreed && (
                      <p className="text-muted-foreground">{b.petBreed}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Tjänst
                    </p>
                    <p className="font-medium text-foreground">{b.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Kund
                    </p>
                    <p className="font-medium text-foreground">{b.ownerName}</p>
                    <p className="text-muted-foreground">{b.ownerEmail}</p>
                    <p className="text-muted-foreground">{b.ownerPhone}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => handleDelete(b.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
