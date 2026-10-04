"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const enlaces = [
  { href: "/", texto: "Dashboard" },
  { href: "/leads", texto: "Leads" },
  { href: "/oportunidades", texto: "Oportunidades" },
  { href: "/etiquetas", texto: "Etiquetas" },
];

function estaActivo(ruta: string, href: string) {
  return href === "/" ? ruta === "/" : ruta === href || ruta.startsWith(`${href}/`);
}

/** Barra superior fija: marca a la izquierda, apartados a la derecha; hamburguesa por debajo de 768 px. */
export function BarraNavegacion() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-display-sm text-ink" onClick={() => setAbierto(false)}>
          CRM de leads
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {enlaces.map(({ href, texto }) => (
            <Link
              key={href}
              href={href}
              aria-current={estaActivo(ruta, href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                estaActivo(ruta, href) ? "bg-surface-strong text-ink" : "text-body hover:text-ink"
              }`}
            >
              {texto}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-surface-strong md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
            {abierto ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" aria-label="Principal" className="border-t border-hairline bg-canvas px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {enlaces.map(({ href, texto }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setAbierto(false)}
                  aria-current={estaActivo(ruta, href) ? "page" : undefined}
                  className={`block rounded-lg px-3 py-3 text-title-sm ${
                    estaActivo(ruta, href) ? "bg-surface-strong text-ink" : "text-body"
                  }`}
                >
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
