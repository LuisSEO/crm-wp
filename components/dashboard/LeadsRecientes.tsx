import { FilaLead } from "@/components/leads/FilaLead";
import { Boton } from "@/components/ui/Boton";
import type { Lead } from "@/lib/datos";

export function LeadsRecientes({ leads }: { leads: Lead[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-display-sm text-ink">Leads recientes</h2>
        <Boton href="/leads" variante="texto">
          Ver todos
        </Boton>
      </div>
      {leads.length > 0 ? (
        <ul className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface-card">
          {leads.map((lead) => (
            <li key={lead.id}>
              <FilaLead lead={lead} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Todavía no hay leads.</p>
      )}
    </section>
  );
}
