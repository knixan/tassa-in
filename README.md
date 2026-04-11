# Tassa in! – Professionell djurvård

Webbapp för djurvårdsalongen Tassa in! med bokningssystem för hundar och katter.

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite 8
- TanStack Router (filbaserad routing)
- Tailwind CSS v4
- shadcn/ui (Radix UI)

**Backend**
- .NET 10 (ASP.NET Core Web API)
- PostgreSQL
- Entity Framework Core 10

## Kom igång

### Krav

- Node.js 20+
- .NET 10 SDK
- PostgreSQL (kör lokalt eller via Docker)

### Frontend

```bash
npm install
npm run dev
```

Körs på `http://localhost:5173`.

### Backend

```bash
cd MyApi
dotnet ef database update
dotnet run
```

Körs på `http://localhost:5295`.

### Databas

Standardanslutning i `MyApi/appsettings.json`:

```
Host=localhost;Database=tassa_in;Username=postgres;Password=postgres
```

Ändra vid behov. Kör sedan:

```bash
cd MyApi
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

## Sidor

| Route | Beskrivning |
|-------|-------------|
| `/` | Startsida med hero, tjänsteöversikt och bokningssystem |
| `/tjanster` | Alla tjänster med priser |
| `/om-oss` | Om salongen och teamet |
| `/boka` | Separat bokningssida |

## API-endpoints

| Metod | Endpoint | Beskrivning |
|-------|----------|-------------|
| `GET` | `/api/bookings/available?date=YYYY-MM-DD` | Returnerar lediga tidsluckor för ett datum |
| `POST` | `/api/bookings` | Skapar en bokning |

Öppettider för bokning: **15:00–19:00** (en timme per tid).
