import { Geist, Geist_Mono, Fraunces, Archivo } from "next/font/google";
import CookieConsent from "./components/CookieConsent";
import ReloadOnHistoryNav from "./components/ReloadOnHistoryNav";
import { PAGE_METADATA, SITE_URL } from "@/lib/seo/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Grotesca variável (display) — headlines gigantes da Funerária Costa.
// Peso variável 100–900 e eixo de largura, para títulos condensados e pesados.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Serifada editorial (display) — usada na experiência da Funerária Costa.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...PAGE_METADATA.home,
  icons: {
    icon: "/logogrupo.png",
    apple: "/logogrupo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      charSet="utf-8"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReloadOnHistoryNav />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
