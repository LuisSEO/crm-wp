import { FilaLead } from "@/components/leads/FilaLead";
import type { LeadConEtiquetas } from "@/lib/datos";

export function ListaLeads({ leads }: { leads: LeadConEtiquetas[] }) {
  return (
    <ul className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-surface-card">
      {leads.map(({ etiquetas, ...lead }) => (
        <li key={lead.id}>
          <FilaLead lead={lead} etiquetas={etiquetas} />
        </li>
      ))}
    </ul>
  );
}
