/** Etiqueta de lead: píldora con un punto del color de la etiqueta (el color viene de la base de datos). */
export function EtiquetaColor({ nombre, color }: { nombre: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption text-ink"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
        borderColor: `color-mix(in srgb, ${color} 30%, white)`,
      }}
    >
      <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {nombre}
    </span>
  );
}
