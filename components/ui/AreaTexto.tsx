import type { TextareaHTMLAttributes } from "react";

type Props = { etiqueta: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Campo de texto de varias líneas con el mismo aspecto que `Campo`. */
export function AreaTexto({ etiqueta, error, id, className = "", ...resto }: Props) {
  const idCampo = id ?? `area-${etiqueta.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idCampo} className="text-caption font-medium text-ink">
        {etiqueta}
      </label>
      <textarea
        id={idCampo}
        aria-invalid={error ? true : undefined}
        className={`min-h-28 rounded-md border bg-surface-card px-4 py-3 text-ink placeholder:text-muted-soft focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--color-ink)] focus:outline-none ${
          error ? "border-error" : "border-hairline-strong"
        } ${className}`}
        {...resto}
      />
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
}
