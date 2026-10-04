export default function Cargando() {
  return (
    <div className="space-y-8" role="status" aria-label="Cargando">
      <div className="h-52 animate-pulse rounded-xxl bg-surface-strong" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-surface-strong" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-surface-strong" />
    </div>
  );
}
