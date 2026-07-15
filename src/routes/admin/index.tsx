import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { LogIn, CalendarDays, Trash2, LogOut, RefreshCw, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, UNAUTHORIZED_EVENT, type BookingResponse, type AdminUser } from "@/lib/api";
import { loginSchema, type LoginFormData } from "@/lib/schemas";

const registerAdminSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  fullName: z.string().min(2, "Ange namn"),
  password: z.string().min(8, "Minst 8 tecken"),
});
type RegisterAdminData = z.infer<typeof registerAdminSchema>;

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin – Tassa in!" }] }),
  component: AdminPage,
});

function AdminPage() {
  const token = localStorage.getItem("admin_token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // Any authenticated request that comes back 401 (expired/invalid token)
  // drops the whole admin UI back to the login screen, regardless of which
  // tab triggered it - see api.ts's request().
  useEffect(() => {
    function handleUnauthorized() {
      setIsLoggedIn(false);
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

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
  const [tab, setTab] = useState<"bookings" | "admins">("bookings");

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    onLogout();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Adminpanel</h1>
            <p className="text-sm text-muted-foreground">Inloggad som {adminName}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logga ut
          </Button>
        </div>

        {/* Flikar */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "bookings"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Bokningar
          </button>
          <button
            onClick={() => setTab("admins")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "admins"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Admins
          </button>
        </div>

        {tab === "bookings" ? <BookingsTab /> : <AdminsTab />}
      </div>
    </div>
  );
}

function BookingsTab() {
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
    } catch {
      // A 401 here already triggers the global admin:unauthorized handler
      // (see api.ts), which drops the whole dashboard back to the login
      // screen - so this message only ever shows for non-auth failures.
      setError("Kunde inte hämta bokningar.");
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

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
    <>
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Datum & tid</p>
                  <p className="font-medium text-foreground">
                    {format(parseISO(b.startUtc), "d MMM yyyy", { locale: sv })}
                  </p>
                  <p className="text-muted-foreground">kl. {b.startLocal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Husdjur</p>
                  <p className="font-medium text-foreground">{b.petName} ({b.petType})</p>
                  {b.petBreed && <p className="text-muted-foreground">{b.petBreed}</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tjänst</p>
                  <p className="font-medium text-foreground">{b.serviceType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Kund</p>
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
    </>
  );
}

function AdminsTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterAdminData>({ resolver: zodResolver(registerAdminSchema) });

  useEffect(() => {
    api.admin.getUsers()
      .then(setAdmins)
      .catch(() => setError("Kunde inte hämta admins."))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(data: RegisterAdminData) {
    setServerError("");
    try {
      const newAdmin = await api.admin.createUser(data);
      setAdmins((prev) => [...prev, newAdmin]);
      reset();
      setShowForm(false);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Kunde inte skapa admin.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Ta bort denna admin?")) return;
    try {
      await api.admin.deleteUser(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Kunde inte ta bort admin.");
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {admins.length} admin{admins.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Lägg till admin
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-border bg-card p-6 mb-6 space-y-4"
        >
          <h2 className="font-heading font-semibold text-foreground">Ny admin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="reg-name">Namn</Label>
              <Input id="reg-name" placeholder="Anna Svensson" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-email">E-post</Label>
              <Input id="reg-email" type="email" placeholder="anna@tassain.se" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-password">Lösenord</Label>
              <Input id="reg-password" type="password" placeholder="Minst 8 tecken" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
          </div>
          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">{serverError}</p>
          )}
          <div className="flex gap-3">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Skapar…" : "Skapa admin"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); reset(); }}>
              Avbryt
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Laddar…</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="space-y-2">
          {admins.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border bg-card px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{a.fullName}</p>
                <p className="text-sm text-muted-foreground">{a.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(a.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
