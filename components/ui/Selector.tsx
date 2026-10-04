import type { SelectHTMLAttributes } from "react";

type Props = {
  etiqueta: string;
  opciones: { valor: string; texto: string }[];
  /** Texto de la opción vacía (sin filtro). Si no se indica, no hay opción vacía. */
  vacio?: string;
  error?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">;

/** Desplegable con el mismo aspecto que `Campo`. */
export function Selector({ etiqueta, opciones, vacio, error, id, className = "", ...resto }: Props) {
  const idCampo = id ?? `selector-${etiqueta.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idCampo} className="text-caption font-medium text-ink">
        {etiqueta}
      </label>
      <select
        id={idCampo}
        aria-invalid={error ? true : undefined}
        className={`h-11 rounded-md border ${error ? "border-error" : "border-hairline-strong"} bg-surface-card px-3 text-ink focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--color-ink)] focus:outline-none ${className}`}
        {...resto}
      >
        {vacio !== undefined && <option value="">{vacio}</option>}
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
}
