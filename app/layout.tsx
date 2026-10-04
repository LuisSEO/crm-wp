import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import { BarraNavegacion } from "@/components/BarraNavegacion";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Sustituta gratuita de Waldenburg (ver design.md). Empieza en peso 400.
const displaySerif = EB_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM de leads",
  description: "Gestiona tus leads, oportunidades y notas en un solo lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${displaySerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <BarraNavegacion />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-8 sm:py-12">{children}</main>
      </body>
    </html>
  );
}
