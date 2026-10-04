# Plan · Fase 3 — Backend

## Objetivo
Dar vida al CRM: que se pueda **crear y editar leads, etiquetarlos, crear oportunidades y moverlas de fase, añadir notas y gestionar etiquetas** desde la web, guardándolo en Supabase. Para quien gestiona los leads. Al terminar, la app deja de ser de solo lectura.

## Punto de partida
- La fase 2 está hecha: todas las pantallas leen de Supabase desde `lib/datos.ts` (Server Components, clave maestra solo en servidor).
- `app/api/` solo tiene un README: no hay ninguna ruta todavía.
- Los botones de crear/editar de la ficha y el pipeline están presentes pero **desactivados**; las tarjetas del pipeline no se pueden mover.
- Sin login (decisión del plan maestro). Las 5 tablas tienen RLS activado y sin políticas: solo el servidor, con la clave maestra, puede escribir.

## Decisiones tomadas contigo
- **Arquitectura:** rutas de API en `app/api/` (endpoints REST), no Server Actions.
- **Alcance:** lo del plan maestro. **Sin borrar** nada en esta fase (ni leads, ni notas, ni etiquetas, ni oportunidades).
- **Interfaz:** se conecta en esta misma fase; se activan los botones y formularios.
- **Validación:** Zod, con mensajes en español de España.
- **Mover de fase:** arrastrar y soltar en el pipeline.
- **Lectura:** las páginas siguen usando `lib/datos.ts`; las rutas GET reutilizan esas mismas funciones.
- **Reglas en el servidor:** email único por lead y nombre de etiqueta único.
- **Seguridad:** sin login ni clave compartida por ahora (se anota como riesgo para la fase 4).

## Qué piezas toca
- [x] Backend (`app/api/`, validación y funciones de escritura en `lib/`)
- [x] Frontend: solo activar botones/formularios y el arrastre (el diseño no cambia)
- [x] Base de datos: dos **índices únicos** (email de lead, nombre de etiqueta). Ninguna tabla nueva
- [ ] Producción (fase 4)

## Las rutas (el mapa)

| Ruta | Qué hace |
|------|----------|
| `GET /api/leads` | Lista con búsqueda y filtros por estado y etiqueta (mismos parámetros que la URL de la lista). |
| `POST /api/leads` | Crea un lead (nombre obligatorio; email, teléfono, empresa, origen opcionales; estado por defecto "nuevo"). |
| `GET /api/leads/[id]` | Ficha completa: lead, etiquetas, oportunidades y notas. |
| `PATCH /api/leads/[id]` | Edita datos y/o estado del lead. |
| `PUT /api/leads/[id]/etiquetas` | Fija el conjunto de etiquetas del lead (añade las nuevas, quita las que sobran). |
| `GET /api/etiquetas` | Catálogo con nº de leads. |
| `POST /api/etiquetas` | Crea una etiqueta (nombre único, color válido). |
| `GET /api/oportunidades` | Todas, con su lead (para el pipeline). |
| `POST /api/oportunidades` | Crea una oportunidad ligada a un lead (título, valor ≥ 0, fase, cierre estimado). |
| `PATCH /api/oportunidades/[id]` | Cambia fase, valor, título o cierre estimado. |
| `GET /api/notas?lead=…` · `POST /api/notas` | Lista las notas de un lead · añade una. |
| `GET /api/metricas` | Los números del dashboard. |

Todas responden con un formato común y errores claros en español: 400 datos no válidos (con el campo que falla), 404 no existe, 409 duplicado, 500 fallo inesperado (sin filtrar detalles internos).

## Pasos (pequeños y verificables)
1. **Base común del backend:** instalar Zod; crear en `lib/` los esquemas de validación (estados y fases permitidos, email, valor no negativo, color de etiqueta, ids) reutilizando `lib/constantes.ts`, y un ayudante de respuestas/errores uniforme. — **se comprueba:** una prueba rápida de los esquemas acepta datos válidos y rechaza los inválidos con mensajes en español.
2. **Índices únicos en Supabase** (migración): email de lead sin distinguir mayúsculas (los vacíos no cuentan) y nombre de etiqueta sin distinguir mayúsculas. Antes de aplicarla se comprueba que los 8 leads y 5 etiquetas de ejemplo no tienen duplicados. — **se comprueba:** el asesor de seguridad de Supabase no da avisos nuevos e insertar un duplicado a mano falla.
3. **Leads (crear, listar, ver, editar):** `GET/POST /api/leads` y `GET/PATCH /api/leads/[id]`. Un email repetido devuelve 409 con mensaje claro. — **se comprueba:** con peticiones de prueba se crea un lead, aparece en la lista y en `/leads`, se edita su estado, y un id inventado da 404.
4. **Etiquetas de los leads y catálogo:** `GET/POST /api/etiquetas` y `PUT /api/leads/[id]/etiquetas`. — **se comprueba:** se crea una etiqueta, se asigna a un lead, se le quita otra, y los recuentos de la página de etiquetas cuadran; un nombre repetido da 409.
5. **Oportunidades:** `GET/POST /api/oportunidades` y `PATCH /api/oportunidades/[id]`. Se rechaza una fase no permitida, un valor negativo y un lead que no existe. — **se comprueba:** se crea una oportunidad, se mueve de fase y los totales del pipeline y del dashboard cambian en consecuencia.
6. **Notas y métricas:** `GET/POST /api/notas` y `GET /api/metricas` (reutiliza las funciones de `lib/datos.ts`). No se admiten notas vacías ni sin lead. — **se comprueba:** una nota nueva sale arriba en la ficha; las métricas de la API coinciden con las del dashboard.
7. **Interfaz · leads:** formulario de crear lead (desde la lista) y de editar (en la ficha), cambio de estado, y selector de etiquetas en la ficha. Mensajes de error junto al campo, botón con estado "guardando" y refresco de los datos al terminar. — **se comprueba:** en el navegador, crear un lead con un email repetido muestra el error; crear y editar uno válido lo refleja al instante en la lista y la ficha.
8. **Interfaz · notas, oportunidades y etiquetas:** añadir nota en la ficha; crear oportunidad desde la ficha (y desde el pipeline eligiendo lead); crear etiqueta en la página de etiquetas. — **se comprueba:** cada alta aparece en su sitio sin recargar a mano y el dashboard se actualiza.
9. **Interfaz · arrastrar y soltar en el pipeline:** mover una tarjeta entre columnas llama a la API; el cambio se ve al instante y, si falla, la tarjeta vuelve a su sitio con un aviso. Con teclado también se puede mover (accesibilidad) y en móvil hay una alternativa táctil. — **se comprueba:** arrastrar una tarjeta de "propuesta" a "ganada" cambia el total de ambas columnas, y al recargar sigue ahí; con la API caída vuelve atrás.
10. **Repaso final:** estados de error y vacío de los formularios, textos en español de España sin emojis, y revisión de seguridad (la clave maestra solo en servidor, ningún dato sin validar llega a la base). — **se comprueba:** recorrido completo a mano de todo el flujo, y búsqueda en el código de que no hay claves en el navegador.

## Skills que usaremos
`nextjs-app-router-patterns` (rutas de API y refresco de datos), `supabase-postgres-best-practices` (índices, consultas y claves), `vercel-react-best-practices` (actualizaciones en la interfaz), `frontend-design` (formularios y arrastre coherentes con `design.md`), `copywriting` (mensajes de error y de confirmación).

## Riesgos / dudas para el humano
- **Sin login, cualquiera con el enlace podría crear o modificar datos** (las rutas de escritura quedan abiertas). Es aceptable en desarrollo; antes de publicar en la fase 4 hay que decidir: contraseña compartida simple, login, o publicar solo con datos de ejemplo.
- **Sin borrado:** si creas algo por error no podrás eliminarlo desde la web en esta fase (solo editarlo). Si lo echas en falta, será una fase extra.
- **Email único:** si dejas el email vacío, se permite (varios leads sin email). El mismo email con distintas mayúsculas se considera repetido.
- **Arrastrar y soltar** añade una librería o código propio y es lo más delicado de la fase; está al final para poder aparcarlo sin bloquear el resto.
- **Descartar un lead** no cierra sus oportunidades (no elegiste esa regla). Un lead descartado puede seguir teniendo oportunidades abiertas.
- **Dos personas editando a la vez:** gana el último cambio guardado; no hay aviso de conflicto.

## Estado
Pasos 1 a 10 implementados. Rutas probadas con peticiones reales (altas, ediciones, duplicados 409, datos no válidos 400, ids inventados 404); build, tipos y lint sin errores. **Pendiente: prueba manual en el navegador** (formularios, etiquetas, notas y arrastre) y tu visto bueno.

## Hecho cuando
Desde el navegador puedes crear y editar un lead, ponerle y quitarle etiquetas, añadirle notas, crearle oportunidades y arrastrarlas entre fases; el dashboard y las listas reflejan los cambios; los duplicados (email y etiqueta) se rechazan con un mensaje claro; las rutas devuelven errores comprensibles ante datos no válidos; no hay ninguna clave secreta en el navegador; y has recorrido todo a mano dando tu visto bueno.
