import type { InputHTMLAttributes } from "react";

type Props = {
  etiqueta: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/** Campo de texto con su etiqueta. Al enfocarlo, el borde se engrosa a 2px de tinta. */
export function Campo({ etiqueta, error, id, className = "", ...resto }: Props) {
  const idCampo = id ?? `campo-${etiqueta.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idCampo} className="text-caption font-medium text-ink">
        {etiqueta}
      </label>
      <input
        id={idCampo}
        aria-invalid={error ? true : undefined}
        className={`h-11 rounded-md border bg-surface-card px-4 text-ink placeholder:text-muted-soft focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--color-ink)] focus:outline-none ${
          error ? "border-error" : "border-hairline-strong"
        } ${className}`}
        {...resto}
      />
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
}
