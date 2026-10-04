type Color = "mint" | "peach" | "lavender" | "sky" | "rose";

const colores: Record<Color, string> = {
  mint: "var(--color-gradient-mint)",
  peach: "var(--color-gradient-peach)",
  lavender: "var(--color-gradient-lavender)",
  sky: "var(--color-gradient-sky)",
  rose: "var(--color-gradient-rose)",
};

/**
 * Orbe pastel de ambiente. Solo decoración: no recibe clics ni lo leen los lectores de pantalla.
 * Colócalo dentro de un contenedor `relative` (idealmente con `overflow-hidden`) y ponle el
 * contenido por encima con `relative`.
 */
export function Orbe({ color, className = "" }: { color: Color; className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full opacity-70 blur-3xl ${className}`}
      style={{ background: `radial-gradient(circle at center, ${colores[color]} 0%, transparent 70%)` }}
    />
  );
}
