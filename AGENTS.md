# Regler för AI-agenter i det här repot

Skriv på **svenska**: UI-texter, kommentarer, felmeddelanden (både i React och i API:ts svar) och commit-meddelanden. Namn på variabler, funktioner, komponenter, klasser och metoder är på engelska. URL:er på svenska (`/boka`, `/tjanster`, `/om-oss`, `/admin`). Befintliga engelska kommentarer behöver inte skrivas om bara för språkets skull, men engelska UI-texter (t.ex. felsidan i `src/router.tsx`) ska översättas när du ändå är där.

## Vad är Tassa in?

Ett bokningssystem för djurvård (hund och katt): bad, klippning, pälsvård, kloklippning, tassbehandling och VIP-paket. **Kunder bokar utan konto** – de väljer datum, tidslucka och tjänst och fyller i sina och djurets uppgifter. **Admin** loggar in och ser, filtrerar och tar bort bokningar, hanterar andra adminkonton och läser granskningsloggen.

Monorepo: frontend i roten, backend i `MyApi/`.

| Del         | Teknik                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Frontend    | React 19, Vite 8, TypeScript 6, TanStack Router (filbaserad routing)    |
| Formulär    | React Hook Form 7 + zod 4 (`@hookform/resolvers`)                       |
| UI          | Tailwind v4, shadcn 4 (stil `radix-nova`, bygger på **Radix UI**), lucide |
| Datum       | date-fns 4 + date-fns-tz 3 (svensk locale `sv`)                         |
| Backend     | ASP.NET Core 10 Web API (C#), controllers + services                    |
| Auth        | ASP.NET Core Identity + JWT (bara admin)                                |
| ORM/databas | Entity Framework Core 10 + Npgsql, PostgreSQL                           |
| Tidszon     | `TimeZoneConverter` (`Europe/Stockholm`)                                |
| Hosting     | Frontend: Vercel (statisk SPA). Backend: egen värd (Railway/Render/Azure) |

### `MyApi/` är ett eget git-repo

`MyApi` är registrerad som en gitlänk (submodul) i det här repot, men det finns ingen `.gitmodules` – så en vanlig klon får en **tom** `MyApi/`-mapp. Backend-koden versionshanteras alltså inte här.

- Är `MyApi/` tom: **säg det till användaren** och hitta inte på backend-kod. Strukturen nedan och endpointsen i README är det som gäller tills koden finns på plats.
- En ändring i backend committas i backendens repo, inte här. Påstå aldrig i ett commit-meddelande för det här repot att `Program.cs` eller annan C#-kod har ändrats.

### Struktur

```
src/routes/                 sidor (TanStack Router, filbaserat) – tunna, renderar komponenter
src/routes/__root.tsx       layout (Navbar + Footer), 404, meta-taggar
src/routeTree.gen.ts        GENERERAD av TanStack Router – ändra aldrig för hand
src/router.tsx              router-konfiguration och standardfelsida
src/components/ui/          shadcn-komponenter (läggs till med `npx shadcn@latest add`)
src/components/<område>/    egna komponenter per område (booking/, admin/, layout/, home/ …)
src/lib/api.ts              ALL kommunikation med API:t + TypeScript-typer för DTO:erna
src/lib/schemas.ts          zod-scheman och delade konstanter (tjänster, djurtyper)
src/lib/utils.ts            `cn` m.m.
src/hooks/                  egna React-hooks
src/styles.css              temat (färger, typsnitt) – här ändras utseendet

MyApi/Controllers/          tunna controllers: validera → anropa service → returnera DTO
MyApi/Services/             affärslogik (BookingService: luckor, tidszon, dubbelbokningsskydd)
MyApi/DTOs/                 in- och utdata för API:t – aldrig EF-entiteter ut
MyApi/Models/               EF Core-entiteter (AppUser, Booking, AuditLogEntry)
MyApi/Data/AppDbContext.cs  DbContext (Identity + Bookings + AuditLog)
MyApi/Migrations/           EF Core-migreringar
MyApi/Program.cs            DI, CORS, Identity, lockout, JWT, startvakter, admin-seed
```

Mappar som inte finns än skapas när första filen behövs, enligt strukturen ovan. Idag ligger komponenterna direkt i `src/components/` – flytta dem till rätt område när du ändå arbetar i dem, inte i en separat stor flytt utan att fråga.

## Gör så här – frontend

- **Alla anrop till API:t går via `src/lib/api.ts`** (`request<T>` med timeout, felmeddelanden och central 401-hantering). Komponenter anropar aldrig `fetch` själva. Nya endpoints läggs till som en funktion i `api`-objektet (admin-anrop under `api.admin` med `authHeaders()`).
- **Typerna i `api.ts` speglar C#-DTO:erna** (JSON i camelCase). Ändras en DTO i `MyApi/DTOs/` ska typen i `api.ts` ändras i samma uppgift – och tvärtom.
- **Formulär:** React Hook Form + `zodResolver`. Schemat ligger i `src/lib/schemas.ts`. Behövs en variant – härled den (`bookingSchema.omit(...)`, som i bokningen), skriv inte ett nytt schema.
- **Kopiera aldrig konstanter eller gränser.** Tjänster, djurtyper, min-/maxlängder osv. definieras en gång i `src/lib/schemas.ts` och importeras. (`SERVICE_TYPES`/`PET_TYPES` i `BookingCalendar.tsx` är dubbletter av schemat – rätta när du är där.) Gränserna ska stämma med backendens valideringsattribut.
- **Routes** skapas som filer i `src/routes/` (`createFileRoute`). `routeTree.gen.ts` genereras av TanStack Router när dev-servern körs – committa den genererade filen, men redigera den aldrig.
- **Sidor är tunna.** En fil i `src/routes/` hämtar data och renderar komponenter från `src/components/<område>/`. Logik och stora JSX-block hör hemma i komponenter. `BookingCalendar.tsx` (~480 rader) och `routes/admin/index.tsx` (~420 rader) är för stora – dela upp dem i mindre komponenter när du ändrar i dem.
- **Filnamn** i kebab-case på engelska (`booking-calendar.tsx` → `BookingCalendar`), som shadcn. Byt namn på gamla filer när du ändå ändrar i dem.
- **UI:** shadcn-komponenterna bygger på **Radix** (paketet `radix-ui`), så `asChild` finns. Kolla komponentens kod i `src/components/ui/` innan du använder den. Klassnamn slås ihop med `cn` från `@/lib/utils`.
- **Färger och typsnitt kommer bara från temat** i `src/styles.css`: `bg-background`, `text-foreground`, `bg-primary text-primary-foreground`, `bg-secondary`, `bg-card`, `bg-warm`, `text-muted-foreground`, `border-border`, `text-destructive` och typsnitten `font-heading` (DM Serif Display), `font-body` (Poppins), `font-decorative` (Allura). **Aldrig** hexkoder (`bg-[#4B5437]`) eller Tailwinds standardfärger (`text-amber-500`) i komponenter. Behövs en ny färg (t.ex. för varningar) – lägg till en token i `styles.css` och säg till.
  - `src/index.css` innehåller shadcns grå standardtema och rester från Vites mall. `styles.css` laddas efter och vinner. Ändra temat i `styles.css`, inte i `index.css`.
  - Det finns inget mörkt läge i temat idag. Lägg inte till `dark:`-klasser förrän det är beslutat.
  - Räkna kontrasten (WCAG AA, 4,5:1 för vanlig text) när du byter färger – särskilt `text-muted-foreground` på `bg-card`/`bg-secondary`.
- **Mobil först.** De flesta kunder bokar från telefonen. Bygg för smal skärm först, med stora tryckytor i kalendern och tidsluckorna.
- **Datum:** använd date-fns med `locale: sv` för allt som visas. Datum skickas till API:t som `yyyy-MM-dd` och tider som `HH:mm` i svensk tid – backend räknar om till UTC. Räkna aldrig ut lediga tider i frontend; luckorna kommer alltid från `GET /api/bookings/slots/{date}`.
- **`App.tsx` och `App.css`** är oanvända rester från Vites mall – bygg inte vidare på dem.

## Gör så här – backend (C#)

- **Controllers är tunna:** ta emot en DTO, låt `[ApiController]` + valideringsattribut (`[Required]`, `[StringLength]`, `[EmailAddress]` …) stoppa felaktig indata, anropa en service, returnera en DTO. Ingen affärslogik och inga `DbContext`-anrop direkt i controllers.
- **Affärslogik i `Services/`**, registrerad i DI i `Program.cs`. Öppettider, luckor och kapacitet finns **bara** i `BookingService` – kopiera dem inte till andra ställen.
- **Returnera aldrig EF-entiteter** från en endpoint – mappa alltid till en DTO, så att inga fält (t.ex. `PasswordHash` på `AppUser`) läcker ut av misstag.
- **async hela vägen:** `async`/`await` med EF Cores `...Async`-metoder, aldrig `.Result` eller `.Wait()`. Ta emot och skicka vidare `CancellationToken` i nya endpoints.
- **Läsningar** som inte ska ändra något använder `AsNoTracking()`.
- **Nullable reference types** är på – skriv inte `!` för att tysta varningar utan att veta att värdet finns.
- **Konfiguration** läses via `IConfiguration`/options. Ny nyckel → lägg till den i `appsettings.example.json` (med platshållare, aldrig ett riktigt värde) och i README, både som `Sektion:Nyckel` och som miljövariabel `Sektion__Nyckel`. Är nyckeln nödvändig i produktion ska `Program.cs` vägra starta utan den (som `Jwt:Key` och `Seed:*`).
- **Felsvar** har formen `{ "message": "..." }` på svenska – det är vad `api.ts` läser. Skicka aldrig `ex.Message`, stacktrace eller databasfel till klienten. Logga felet på servern (utan persondata) och svara med ett allmänt meddelande.

## Domänregler

- **Öppettider:** mån–fre 10–18, lör 10–14, sön 11–15. Varje lucka är 1 timme. **Max 2 bokningar per lucka** (2 anställda). Ändras något av detta – uppdatera `BookingService` och tabellen i README i samma uppgift.
- **Dubbelbokning förhindras** med ett Postgres advisory lock runt kontroll-och-skapa i `BookingService.CreateBookingAsync`. Ta aldrig bort låset, och allt nytt som påverkar en luckas kapacitet (ombokning, flytt, nya tjänster med längre tid) måste ske innanför samma lås.
- **Alla tider lagras i UTC.** Omräkning till/från `Europe/Stockholm` sker bara i `BookingService` via `TimeZoneConverter`. Lägg aldrig på en fast offset (+1/+2) – sommartid sköts automatiskt. Tänk på dagarna då klockan ställs om (sista söndagen i mars och oktober).
- **Servern har sista ordet.** Zod-valideringen i frontend är för användarens skull och går att kringgå. Varje endpoint validerar själv: datum i framtiden och inom öppettiderna, giltig tjänst och djurtyp, längder på fält.
- **Bokning kräver inget konto** – därför är `POST /api/bookings` öppen. Lita aldrig på något från klienten som kan påverka andras bokningar (id, status, pris).
- **Admin:** alla admin-endpoints kräver `[Authorize(Roles = "Admin")]` på controllern. Roll och användar-id kommer alltid från JWT:n (`User`), aldrig från body, query eller URL. En admin får inte ta bort sig själv.
- **Granskningslogg:** allt en admin gör som ändrar konton (och nya admin-åtgärder som ändrar data) loggas i `AuditLog` – vem, vad, när.
- **Inloggning:** kontot låses i 15 minuter efter 5 felförsök. Lösenord: minst 12 tecken med versal, siffra och specialtecken. Sänk aldrig de här kraven. Felmeddelandet vid inloggning avslöjar inte om e-posten finns.
- **Persondata (GDPR):** bokningar innehåller namn, e-post, telefon och uppgifter om djuret. Bara admin får se dem. De loggas aldrig (inte i `ILogger`, inte i `console.log`) och skickas aldrig till tredjepartstjänster. Ny persondata (fält, tabell, e-postutskick, tredjepartstjänst) → säg till användaren, så att det kommer med i integritetspolicyn och gallringen.
- **XSS och JWT:** admin-JWT:t ligger i `localStorage` (`admin_token`), så en XSS-lucka = stulet adminkonto. Använd aldrig `dangerouslySetInnerHTML`, `eval` eller inline-skript. CSP:n injiceras av en Vite-plugin i `vite.config.ts` – ny extern källa (typsnitt, skript, API) kräver en medveten ändring där. Säg till innan du lättar på CSP:n.
- **CORS** styrs av `Cors:AllowedOrigins`. Använd aldrig `AllowAnyOrigin`.
- **Hemligheter:** `MyApi/appsettings.json`, `appsettings.Development.json` och `.env*` är gitignorerade. Lägg aldrig riktiga nycklar, lösenord eller anslutningssträngar i `appsettings.example.json`, README, kod eller commit-meddelanden. Bara variabler med `VITE_` når frontend – och allt i frontend är publikt, så lägg aldrig hemligheter där.

## Dokumentation – gissa inte

Versionerna är nyare än det du lärt dig (React 19, Vite 8, TypeScript 6, Tailwind 4, zod 4, .NET 10). Slå upp i dokumentationen innan du använder ett API du är osäker på, och **alltid** när det gäller auth, databas, tidszoner eller säkerhet.

- **`llms.txt` är en innehållsförteckning.** Hämta den, hitta rätt sida och hämta bara den sidan. Hämta aldrig `llms-full.txt` – den fyller sammanhanget med sådant som inte behövs.
- **Kolla versionen.** Microsoft Learn visar ofta en annan version som standard – välj `aspnetcore-10.0` / EF Core 10. Stämmer dokumentationen inte med tabellen: leta efter en versionerad sida eller säg till.

| Bibliotek         | Version | Dokumentation                                                              |
| ----------------- | ------- | -------------------------------------------------------------------------- |
| React             | 19      | https://react.dev/llms.txt                                                 |
| Vite              | 8       | https://vite.dev/llms.txt                                                  |
| TanStack Router   | 1       | https://tanstack.com/router/latest/docs/framework/react/overview           |
| React Hook Form   | 7       | https://react-hook-form.com/docs                                           |
| zod               | 4       | https://zod.dev/llms.txt                                                   |
| shadcn/ui         | 4       | https://ui.shadcn.com/llms.txt                                             |
| Radix UI          | 1       | https://www.radix-ui.com/primitives/docs                                   |
| Tailwind CSS      | 4       | https://tailwindcss.com/docs                                               |
| date-fns / -tz    | 4 / 3   | https://date-fns.org/docs · https://github.com/marnusw/date-fns-tz         |
| ASP.NET Core      | 10      | https://learn.microsoft.com/aspnet/core/?view=aspnetcore-10.0              |
| ASP.NET Identity  | 10      | https://learn.microsoft.com/aspnet/core/security/authentication/identity   |
| EF Core           | 10      | https://learn.microsoft.com/ef/core/                                       |
| Npgsql EF Core    | 10      | https://www.npgsql.org/efcore/                                             |
| PostgreSQL        | –       | https://www.postgresql.org/docs/current/                                   |
| TimeZoneConverter | –       | https://github.com/mattjohnsonpint/TimeZoneConverter                       |
| Vercel            | –       | https://vercel.com/docs/llms.txt                                           |

## Kommandon

```bash
# Frontend (roten) – npm, inte pnpm
npm run dev                      # http://localhost:5173, proxy /api → localhost:5207
npm run lint                     # ESLint
npx tsc -b                       # typkontroll
npm run build                    # tsc -b + vite build
npx shadcn@latest add <komponent>

# Backend (MyApi/)
dotnet build
dotnet run                       # http://localhost:5207
dotnet format --verify-no-changes
dotnet ef migrations add <Namn>  # ny migrering (PascalCase, t.ex. AddBookingStatus)
dotnet ef database update
```

Lägg inte till nya npm- eller NuGet-paket utan att säga varför. Föreslå hellre något som redan finns i stacken.

## Klart betyder

1. `npm run lint` och `npm run build` går igenom (build kör också typkontrollen). Ändrade filer lintas automatiskt av hooken.
2. Vid ändringar i backend: `dotnet build` utan nya varningar. Vid ändrad modell: en ny migrering är skapad (inte en ändrad gammal) – kör `dotnet ef database update` bara om användaren har bett om det.
3. DTO:er i C# och typer i `api.ts` stämmer överens, och valideringen i `schemas.ts` stämmer med backendens.
4. **Det finns inga tester än.** Ändrar du luckor, kapacitet, tidszon eller behörighet – föreslå vilka tester som borde finnas (t.ex. xUnit för `BookingService` runt sommartidsbytet). Skapa inte testprojekt utan att fråga.
5. Ändringar i UI: säg tydligt vad du **inte** har kunnat testa (t.ex. adminpanelen inloggad, mobil, mot riktig backend).
6. README är uppdaterad om du ändrat endpoints, konfiguration, öppettider eller struktur.
7. Du har skrivit ett commit-meddelande.
8. Du har avslutat med ett "Lär dig"-block (se nedan), om uppgiften var större än en småfix.

## Lärande

Användaren vill fräscha upp och fördjupa sina kunskaper medan hen bygger – inte bara få koden skriven. Avsluta därför varje **större** uppgift (ny funktion, buggfix med en lärdom, säkerhet, databas, arkitektur) med ett kort block, **efter** sammanfattning och commit-meddelande:

```
**Lär dig: <ämne>**
**Fakta:** en sak från koden du just skrev, med länk till filen/raden.
**Varför:** varför man gör så – och vad som händer om man inte gör det.
**Frågor:**
1. en fråga om just den här koden (förstå, förutsäga eller hitta i koden),
2. en fråga till – gärna en vanlig intervjufråga inom samma ämne.
```

- **Max ca 10 rader och 2 frågor.** Hoppa över för småfix (stavfel, formatering, konfig utan lärdom).
- **Utgå från det som just byggdes**, inte allmänna övningar. Rotera ämnen: C#, ASP.NET Core (DI, middleware, controllers), EF Core/PostgreSQL (migreringar, lås, transaktioner), Identity/JWT, React, TanStack Router, React Hook Form/zod, Tailwind, säkerhet (XSS, CSP, CORS, OWASP), tidszoner, verktyg (git, npm, dotnet CLI).
- **Avslöja inte svaren.** Vänta på användarens svar, rätta kort (rätt/delvis/fel + det viktigaste i 2–4 meningar). Säger hen "vet inte": ledtråd först.
- **Logga** varje block i `.claude/larande/logg.md` (privat, gitignore) i samma format som de som redan finns, och uppdatera status när användaren har svarat (`ny` → `rätt`/`delvis`/`fel` + datum). Frågor med `fel` tas upp igen i ett senare block eller i `/quiz`.
- **Nivå:** användaren kan bygga projekt och förstår helheten, men har skrivit lite kod själv på sistone. Svarar hen lätt rätt – gå djupare (avvägningar, alternativ). Svarar hen fel – enklare och mer konkret.
- Användaren styr: "hoppa över" hoppar över ett block, "pausa lärandet" stänger av blocken tills hen säger till, "mer om det här" ger en fördjupning. `/quiz` ger 5 repetitionsfrågor ur loggen (`.claude/skills/quiz`, privat).

## Git

- **Committa och pusha aldrig.** Användaren committar själv. En hook stoppar `git commit` och `git push`.
- Avsluta med ett commit-meddelande på svenska: kort rubrik, tom rad, punktlista. Sist: `Co-Authored-By`-raden från systemet. Beskriv bara det som faktiskt ändrats i **det här** repot (se `MyApi/` ovan).
- Jobbet sker direkt på `master`.
- Det finns ingen CI än – därför är "Klart betyder" det enda som fångar fel innan push.

## Databas

- PostgreSQL via EF Core (Npgsql). Schemat styrs av entiteterna i `MyApi/Models/` och `AppDbContext`, och ändras **bara** via migreringar (`dotnet ef migrations add`).
- **Redigera aldrig en migrering som redan körts** – skapa en ny. Ta bara bort den senaste migreringen (`dotnet ef migrations remove`) om den inte har körts mot någon databas.
- Migreringar ska bevara data: lägg till kolumner som nullable eller med default, döp om i stället för att droppa och skapa nytt. Säg alltid till när en ändring kan radera data.
- `dotnet ef database drop`, `TRUNCATE`, `DELETE` utan `WHERE` och liknande kräver alltid uttryckligt godkännande från användaren i ett nytt meddelande.
- Identity-tabellerna (`AspNetUsers`, `AspNetRoles` …) ändras via `AppUser` och Identity-konfigurationen, aldrig med rå SQL.
- Tabellnamn i PostgreSQL är i PascalCase med citattecken (`"Bookings"`) – tänk på det i rå SQL.
