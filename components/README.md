# components/ — Piezas reutilizables del frontend

Los **componentes** son trozos de interfaz que se construyen una vez y se reutilizan, como plantillas de Canva o piezas de LEGO. Forman parte de la pieza 1 (frontend).

## Qué va aquí

- `Dashboard` → las tarjetas de métricas (leads, oportunidades por fase, valor del pipeline).
- `ListaLeads` + `FiltrosLeads` → la tabla de leads con buscador y filtros (estado, etiqueta).
- `FichaLead` → el detalle de un lead: datos, etiquetas, notas y sus oportunidades.
- `PipelineOportunidades` + `TarjetaOportunidad` → el tablero de oportunidades por fases.
- `GestionEtiquetas` → crear y administrar etiquetas (nombre, color).

La página principal (`app/`) ensambla estos componentes.

## Por qué separarlos

Si un trozo (la tabla de leads, una tarjeta de oportunidad) aparece en dos sitios, lo escribes una vez aquí y lo reutilizas. Cambias el componente y cambia en todos lados.

## Skill que ayuda

`frontend-design` (sigue `design.md`). Para los textos, `copywriting`.

## Qué pedirle a la IA

"Saca la tabla de leads a `ListaLeads`, el detalle a `FichaLead` y el tablero a `PipelineOportunidades`, y úsalos en las páginas."
