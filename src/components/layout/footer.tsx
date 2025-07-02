import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                UX Checker
              </span>
            </Link>
            <p className="text-gray-600 max-w-md">
              Professionelle UX-Analysen für Websites mit KI-Power. Verbessern
              Sie die User Experience Ihrer Website mit datenbasierten
              Erkenntnissen und konkreten Handlungsempfehlungen.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Produkt</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link
                  href="#api"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#help"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Hilfe
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="#status"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 UX Checker. Alle Rechte vorbehalten.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#privacy"
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
            >
              Datenschutz
            </Link>
            <Link
              href="#terms"
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
            >
              AGB
            </Link>
            <Link
              href="#imprint"
              className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
            >
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
