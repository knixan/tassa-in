---
name: kanban
description: 'Visa och uppdatera kanban-tavlan för Tassa in! (GitHub Project 21): vad som pågår, vad som är nästa kort, flytta kort mellan Backlog/Later/In progress/In review/Done och skapa nya kort. Use when the user writes /kanban, "vad ska jag göra nu", "nästa kort", "uppdatera kanban", "flytta kortet", "skapa ett kort" or asks about the board/project.'
---

# /kanban – tavlan för Tassa in!

ID:n, kommandon och regler står i `AGENTS.md` § Kanban. Läs den delen först.

## Användning

| Användaren skriver       | Gör                                                                               |
| ------------------------ | --------------------------------------------------------------------------------- |
| `/kanban`                | Visa tavlan (se nedan).                                                           |
| `/kanban nästa`          | Föreslå nästa kort att jobba på, med motivering.                                  |
| `/kanban börja <sökord>` | Flytta kortet till _In progress_, läs det och sammanfatta vad som ska göras.      |
| `/kanban granska <sökord>` | Flytta kortet till _In review_.                                                 |
| `/kanban klar <sökord>`  | Flytta kortet till _Done_ (stänger issuen).                                       |
| `/kanban nytt <titel>`   | Skapa en issue i _Backlog_ med förslag på Priority och Size. Saknas `[Område]` – föreslå ett. |
| `/kanban städa`          | Jämför _In progress_ och _In review_ med koden och föreslå vad som kan flyttas.   |

`<sökord>` är ett issuenummer (`12`, `#12`) eller matchas mot titeln (skiftlägesokänsligt). Matchar flera kort – fråga vilket.

## Visa tavlan

1. Hämta alla kort: `gh project item-list 21 --owner knixan --format json --limit 200`.
2. Visa kort och tydligt, i den här ordningen:
   - **In progress** och **In review** – alla kort.
   - **Backlog** – grupperat per område (`[Bokning]`, `[Admin]` …), sorterat på Priority, med antal per område och titlarna.
   - **Later** och **Done** – bara antal.
3. Avsluta med ett förslag på nästa kort (se nedan) – en mening.

## Föreslå nästa kort

- Avsluta det som pågår först (_In progress_, sedan _In review_).
- `P0` före `P1` före `P2`. Säkerhetskort (behörighet, läckande fel, hemligheter, CSP) går före nya funktioner.
- Följ beroendena: `[Setup]`/`[Backend]` → `[Databas]` → `[Auth]`/`[Säkerhet]` → `[Bokning]` → `[Admin]` → `[UI]`/`[Startsida]` → `[Drift]`. Ett kort vars grund inte finns än får vänta. Kort som kräver backend-kod kan inte göras så länge `MyApi/` är tom – säg det.
- Föredra kort som är små nog för en session (`XS`–`M`). Är ett kort `L`/`XL` – föreslå att dela upp det i flera kort.

## Ändra kort

- Visa vad du tänker ändra innan du ändrar fler än ett kort i taget.
- Korten är issues: `id` (`PVTI_…`) används för status, Priority och Size, `content.number` för `gh issue view/edit/comment`.
- Ett kort i listan som fortfarande är `DraftIssue` (inte gjort om till issue) – säg till användaren i stället för att ändra det.
- Skriv långa bodies och kommentarer i en fil i scratchpad och använd `--body-file`.
- Bekräfta efteråt med en rad per kort: `#12 [Område] Titel: Backlog → In progress`.
