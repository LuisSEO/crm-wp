import { notFound } from "next/navigation";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { FichaLead } from "@/components/leads/FichaLead";
import { FormularioLead } from "@/components/leads/FormularioLead";
import { Boton } from "@/components/ui/Boton";
import { Insignia } from "@/components/ui/Insignia";
import { ETIQUETA_ESTADO, type Estado } from "@/lib/constantes";
import { obtenerCatalogoEtiquetas, obtenerFichaLead } from "@/lib/datos";

export const dynamic = "force-dynamic";

export default async function FichaDelLead({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [ficha, catalogoEtiquetas] = await Promise.all([obtenerFichaLead(id), obtenerCatalogoEtiquetas()]);
  if (!ficha) notFound();

  const { lead } = ficha;

  return (
    <div className="space-y-8">
      <Boton href="/leads" variante="texto">
        ← Volver a leads
      </Boton>

      <CabeceraPagina
        etiqueta="Ficha de lead"
        titulo={lead.nombre}
        descripcion={lead.empresa ?? undefined}
        color="sky"
        acciones={
          <>
            <Insignia>{ETIQUETA_ESTADO[lead.estado as Estado] ?? lead.estado}</Insignia>
            <FormularioLead lead={lead} />
          </>
        }
      />

      <FichaLead ficha={ficha} catalogoEtiquetas={catalogoEtiquetas} />
    </div>
  );
}
