import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** Eleva la tarjeta con la sombra suave al pasar el cursor (para tarjetas clicables). */
  interactiva?: boolean;
  className?: string;
};

/** Tarjeta blanca con borde fino, radio 16px y relleno de 24px. */
export function Tarjeta({ children, as: Etiqueta = "div", interactiva = false, className = "" }: Props) {
  return (
    <Etiqueta
      className={`rounded-xl border border-hairline bg-surface-card p-6 text-ink ${
        interactiva ? "transition-shadow hover:shadow-soft" : ""
      } ${className}`}
    >
      {children}
    </Etiqueta>
  );
}
