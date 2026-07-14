import { PawPrint, Phone, Mail, MapPin } from "lucide-react";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-7 w-7" strokeWidth={1.5} />
              <span className="font-decorative text-3xl leading-none pt-1">Tassa in!</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              Professionell djurvård för katter och hundar. Vi tar hand om din fyrbenta vän med kärlek och omsorg.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>070-123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@tassain.se</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Djurvårdsgatan 1, Stockholm</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg mb-4">Öppettider</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li className="flex justify-between gap-4"><span>Måndag–Fredag</span><span>08:00–18:00</span></li>
              <li className="flex justify-between gap-4"><span>Lördag</span><span>09:00–15:00</span></li>
              <li className="flex justify-between gap-4"><span>Söndag</span><span>Stängt</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-secondary-foreground/70">
          <span>© {new Date().getFullYear()} Tassa in! Alla rättigheter förbehållna.</span>
          <span>Kod och Design av Josefine Eriksson</span>
        </div>
      </div>
    </footer>
  );
}
