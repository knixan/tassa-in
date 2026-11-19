// PostToolUse(Edit|Write): kör ESLint på TS/TSX-filen som just ändrades, med
// samma config som `npm run lint` (eslint.config.js i roten). Lintfel skickas
// tillbaka till agenten (exit 2 + stderr) medan ändringen fortfarande är färsk.
//
// Bara fel rapporteras, inte varningar. C#-filer i MyApi/ hoppas över –
// `dotnet build` / `dotnet format` körs i stället enligt AGENTS.md § Klart betyder.
// Fail-open: allt vi inte kan hantera säkert släpps igenom med exit 0.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const repo = process.env.CLAUDE_PROJECT_DIR;
if (!repo) process.exit(0);

let fil = "";
try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  fil = String(input?.tool_input?.file_path ?? "");
} catch {
  process.exit(0);
}
if (!fil || !existsSync(fil)) process.exit(0);

const abs = path.resolve(fil);
const rel = path.relative(repo, abs);
if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);
if (!/\.(ts|tsx)$/.test(abs)) process.exit(0);
if (/(^|[\\/])(node_modules|dist|MyApi)[\\/]/.test(rel)) process.exit(0);
if (rel.endsWith("routeTree.gen.ts")) process.exit(0);

let eslint;
try {
  const req = createRequire(path.join(repo, "package.json"));
  eslint = path.join(path.dirname(req.resolve("eslint/package.json")), "bin", "eslint.js");
} catch {
  process.exit(0);
}

try {
  execFileSync(process.execPath, [eslint, rel, "--quiet", "--no-warn-ignored"], {
    cwd: repo,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
  process.exit(0);
} catch (err) {
  // Exit 1 = lintfel. Annat (krasch, saknad config) släpps igenom.
  if (err?.status !== 1) process.exit(0);
  const ut = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
  if (!ut) process.exit(0);
  console.error(`ESLint hittade fel i ${rel}:\n\n${ut}`);
  process.exit(2);
}
