const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  useGrouping: "always", // en es-ES, 8300 saldría sin separador de millar
});

const fechaCorta = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" });

export function formatearEuros(valor: number) {
  return euros.format(valor);
}

/** Acepta fechas ISO completas (timestamptz) o solo día (date). Un `date` se lee como día local para que no se desplace. */
export function formatearFecha(iso: string | null) {
  if (!iso) return "Sin fecha";
  const solodia = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  const fecha = solodia ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return fechaCorta.format(fecha);
}

export function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes.length > 1 ? (partes[partes.length - 1][0] ?? "") : "")).toUpperCase();
}
