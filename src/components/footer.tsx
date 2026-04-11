import { PawPrint, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-heading text-lg font-bold text-foreground">Tassa in!</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professionell djurvård för katter och hundar. Vi tar hand om din fyrbenta vän med kärlek och omsorg.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>070-123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@tassain.se</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Djurvårdsgatan 1, Stockholm</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Öppettider</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Måndag–Fredag</span><span>08:00–18:00</span></li>
              <li className="flex justify-between"><span>Lördag</span><span>09:00–15:00</span></li>
              <li className="flex justify-between"><span>Söndag</span><span>Stängt</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tassa in! Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}
