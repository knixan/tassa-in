# Tassa in! – Djurvård

![Tassa in!](public/tassain.png)

Bokningssystem för djurvård. Monorepo med React Vite (frontend) och ASP.NET Core 10 (backend API).

---

## Teknikstack

| Del | Teknik |
|-----|--------|
| Frontend | React 19 + Vite + TanStack Router |
| Formulär | React Hook Form + Zod |
| UI | shadcn/ui + Tailwind CSS v4 |
| Datum | date-fns + date-fns-tz |
| Backend | ASP.NET Core 10 Web API |
| Auth | ASP.NET Core Identity + JWT |
| ORM | Entity Framework Core 10 |
| Databas | PostgreSQL |
| DB-verktyg | pgAdmin 4 / DBeaver |

---

## Filstruktur

```
tassa-in/
│
├── MyApi/                          # C# ASP.NET Core API
│   ├── Controllers/
│   │   ├── AuthController.cs       # POST /api/auth/login → returnerar JWT
│   │   ├── BookingsController.cs   # GET /api/bookings/slots/{date}, POST /api/bookings
│   │   └── AdminController.cs      # [Admin] Bokningar, adminanvändare och granskningslogg
│   ├── Data/
│   │   └── AppDbContext.cs         # EF Core DbContext med Identity + Bookings + AuditLog
│   ├── DTOs/
│   │   ├── AuthDtos.cs             # LoginDto, AuthResponseDto, AdminUserDto, AuditLogEntryDto m.fl.
│   │   └── BookingDtos.cs          # BookingCreateDto, BookingResponseDto, AvailableSlotDto
│   ├── Migrations/                 # EF Core-migrationer
│   ├── Models/
│   │   ├── AppUser.cs              # Identity-användare (ärver IdentityUser)
│   │   ├── Booking.cs              # Bokningsmodell med UTC-tider och längdbegränsningar
│   │   └── AuditLogEntry.cs        # Granskningslogg för admin-hantering
│   ├── Services/
│   │   ├── BookingService.cs       # Slotgenerering, UTC-konvertering, bokningslogik
│   │   └── TokenService.cs         # JWT-generering
│   ├── appsettings.json            # Anslutningssträng + JWT/CORS/Seed-konfiguration (ej i git)
│   ├── appsettings.example.json    # Mall för appsettings (i git)
│   └── Program.cs                  # App-konfiguration: CORS, Identity, lockout, JWT, EF Core, admin-seed
│
├── src/                            # React Vite frontend
│   ├── components/
│   │   ├── ui/                     # shadcn/ui-komponenter (Button, Input, Select, Textarea m.m.)
│   │   ├── navbar.tsx
│   │   ├── hero.tsx                # Hero-sektion på startsidan
│   │   ├── tjanster.tsx            # Tjänsteöversikt på startsidan
│   │   ├── cta.tsx                 # Bokningsuppmaning på startsidan
│   │   ├── BookingCalendar.tsx     # Bokningswidget (kalender + tidsluckor + formulär)
│   │   └── footer.tsx
│   ├── lib/
│   │   ├── api.ts                  # Typesafe API-klient mot C# backend, centraliserad 401-hantering
│   │   ├── schemas.ts              # Zod-scheman för bokning och inloggning
│   │   └── utils.ts
│   ├── routes/
│   │   ├── __root.tsx              # Root-layout (Navbar + Footer)
│   │   ├── index.tsx               # Startsida (Hero, Tjänster, CTA)
│   │   ├── boka.tsx                # Bokningssida (BookingCalendar)
│   │   ├── tjanster.tsx            # Tjänstesida
│   │   ├── om-oss.tsx              # Om oss-sida
│   │   └── admin/
│   │       └── index.tsx           # Adminpanel: inloggning, bokningslista, adminanvändare
│   ├── routeTree.gen.ts            # Auto-genererad av TanStack Router
│   └── router.tsx                  # Router-konfiguration
│
├── index.html                      # CSP-taggen injiceras hit av Vite-pluginen i vite.config.ts
├── vite.config.ts                  # Vite + proxy /api → localhost:5207 + CSP-injektion
└── package.json
```

---

## Öppettider & tidsluckor

| Dag | Öppet | Tidsluckor (starttider) |
|-----|-------|------------------------|
| Måndag–fredag | 10:00–18:00 | 10, 11, 12, 13, 14, 15, 16, 17 |
| Lördag | 10:00–14:00 | 10, 11, 12, 13 |
| Söndag | 11:00–15:00 | 11, 12, 13, 14 |

Varje tidslucka är 1 timme. Max 2 bokningar per lucka (2 anställda). Dubbelbokning förhindras med ett Postgres-advisory lock runt kontroll-och-skapa-steget i `BookingService.CreateBookingAsync`, så samtidiga förfrågningar om samma lucka kan inte båda lyckas.

---

## API-endpoints

```
POST   /api/auth/login                  Logga in, returnerar JWT (låser kontot efter 5 felförsök i 15 min)
GET    /api/bookings/slots/{date}       Lediga tider för ett datum (yyyy-MM-dd)
POST   /api/bookings                    Skapa en bokning

# Kräver JWT med Admin-roll:
GET    /api/admin/bookings?date=        Hämta bokningar, filtrera per datum
DELETE /api/admin/bookings/{id}         Ta bort en bokning
GET    /api/admin/users                 Lista adminanvändare
POST   /api/admin/users                 Skapa en ny adminanvändare
DELETE /api/admin/users/{id}            Ta bort en adminanvändare (ej sig själv)
GET    /api/admin/audit-log             Granskningslogg (senaste 200 admin-hanteringar)
```

---

## Komma igång

### Krav
- .NET 10 SDK
- Node.js 20+
- PostgreSQL

### 1. Konfigurera backend

```bash
cp MyApi/appsettings.example.json MyApi/appsettings.json
```

Redigera `MyApi/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=tassa_in;Username=postgres;Password=DITT_LÖSENORD"
  },
  "Jwt": {
    "Key": "din-hemliga-nyckel-minst-32-tecken-lång",
    "Issuer": "tassa-in-api",
    "Audience": "tassa-in-client"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  },
  "Seed": {
    "AdminEmail": "admin@tassain.se",
    "AdminPassword": "ByT-DETTA-losenord!",
    "AdminName": "Admin"
  }
}
```

`Cors:AllowedOrigins` styr vilka origins API:et tar emot anrop från — peka på din produktionsfrontend där. `Seed:*` är valfritt i Development (faller tillbaka på `admin@tassain.se` / `Admin1234!`), men **måste** anges utanför Development — appen vägrar starta annars, för att inte tyst skapa ett gissningsbart adminkonto.

### 2. Kör EF Core-migrationer

```bash
cd MyApi
dotnet ef database update
```

### 3. Starta

```bash
# Terminal 1 – C# API (port 5207)
cd MyApi
dotnet run

# Terminal 2 – React frontend (port 5173)
npm run dev
```

Vid uppstart skapas automatiskt Admin-rollen och ett första adminkonto (från `Seed:*`-konfigurationen ovan) om inget redan finns — ingen manuell kod behövs.

- App: `http://localhost:5173`
- Admin: `http://localhost:5173/admin/`

---

## Driftsättning

Vercel kan bara hosta **frontend** (Vite bygger en statisk SPA) — den kör inte ASP.NET Core, så **MyApi** behöver en egen värd, t.ex. Railway, Render eller Azure App Service.

**Frontend (Vercel):**
- Sätt miljövariabeln `VITE_API_URL` till backendens URL, t.ex. `https://din-backend.example.com`. Utan den används relativa `/api/...`-anrop (bara för lokal dev, tack vare Vite-proxyn).

**Backend (Railway/Render/Azure/...):**
Sätt samma nycklar som i `appsettings.json` fast som miljövariabler, med `__` (dubbelt understreck) istället för `:`:
```
ConnectionStrings__DefaultConnection=Host=...;Database=...;Username=...;Password=...
Jwt__Key=din-hemliga-nyckel
Seed__AdminEmail=admin@tassain.se
Seed__AdminPassword=...
Cors__AllowedOrigins__0=https://ditt-vercel-projekt.vercel.app
```

`Cors:AllowedOrigins` måste innehålla frontendens exakta origin, annars blockerar backendens CORS-policy alla anrop från den. `Seed:AdminEmail`/`Seed:AdminPassword` **måste** vara satta utanför Development — appen vägrar starta annars (se ovan).

---

## Säkerhet

- **JWT-auth** via ASP.NET Core Identity, 8 timmars livslängd.
- **Kontolåsning**: 5 felaktiga inloggningsförsök låser kontot i 15 minuter (`AuthController.Login`).
- **CSP**: `index.html` får en `Content-Security-Policy`-tagg injicerad av en Vite-plugin i `vite.config.ts` — strikt (`script-src 'self'`) i produktionsbygget, med `'unsafe-eval'` bara i dev där Vites beroende-förbuntning kräver det. Syftar till att begränsa skadan om en XSS-lucka någonsin uppstår, eftersom admin-JWT:t ligger i `localStorage`.
- **Granskningslogg**: skapande/borttagning av adminkonton loggas till `AuditLog`-tabellen (vem, vad, när) och kan läsas via `GET /api/admin/audit-log`.
- **Hemligheter**: `appsettings.json`, `appsettings.Development.json` och `.env` är gitignorade — checka aldrig in riktiga lösenord/nycklar. Använd `appsettings.example.json` som mall.

---

## Se databasen

**psql (kommandorad, ingår med PostgreSQL):**
```bash
psql -U postgres -d tassa_in
```
```sql
\dt                        -- lista alla tabeller
\d "Bookings"              -- visa kolumner i Bookings-tabellen
SELECT * FROM "Bookings";  -- se alla bokningar
\q                         -- avsluta
```

**Grafiskt gränssnitt (välj ett):**
- [pgAdmin 4](https://www.pgadmin.org/download/) — webbgränssnitt, liknar Prisma Studio
- [DBeaver](https://dbeaver.io/download/) — desktopapp, gratis

Anslut med samma uppgifter som i `appsettings.json`.

---

## Tidszon

Alla tider lagras i UTC i databasen. Konvertering till/från svensk tid (`Europe/Stockholm`, CET/CEST) hanteras av `BookingService.cs` via paketet `TimeZoneConverter`. Sommartid och vintertid hanteras automatiskt — ingen manuell offset behövs.
