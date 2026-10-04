# Plan · Fase 2 — Frontend

## Objetivo
Construir todos los apartados visibles del CRM (dashboard, leads con ficha, pipeline de oportunidades y etiquetas) siguiendo `design.md`, mostrando los **datos reales de ejemplo** que ya hay en Supabase. Para quien gestiona los leads.

En esta fase la app **se ve y se navega, pero es de solo lectura**. Crear, editar, mover de fase y añadir notas llegan en la fase 3 (backend).

## Punto de partida (comprobado en Supabase)
- 5 tablas listas con RLS activado: 8 leads, 5 etiquetas, 11 relaciones lead-etiqueta, 10 oportunidades (hay de todas las fases) y 15 notas. Hay leads de los 3 estados.
- **No hay políticas RLS**: con la clave pública no se puede leer nada. Es lo correcto (puerta cerrada).
- El repo aún no tiene proyecto Next.js (solo carpetas con README y las skills).

## Qué piezas toca
- [x] Frontend (`app/`, `components/`)
- [x] Base de datos: solo **leer**; ninguna tabla cambia
- [ ] Backend (fase 3)
- [ ] Producción (fase 4)

## Decisión de arquitectura: cómo leen los datos las pantallas
Las páginas serán **Server Components** de Next.js: se ejecutan en el servidor, leen de Supabase con la clave maestra (`service_role`) guardada en `.env` y mandan al navegador solo el HTML resultante. Así la clave nunca llega al navegador y no hace falta abrir RLS. Toda la lectura pasa por un único archivo en `lib/` (funciones tipo "dame los leads"), para que en la fase 3 se pueda cambiar por las rutas de API sin tocar las pantallas.

## Pasos (pequeños y verificables)
1. **Arrancar el proyecto Next.js** (TypeScript, App Router, Tailwind) en la raíz, conservando los README y `.claude/`, e instalar el cliente de Supabase. Crear `.env.local` con la URL y las claves (comprobar que `.env*` está en `.gitignore`). — **se comprueba:** `npm run dev` abre una página en `localhost:3000` y `.env.local` no aparece como archivo a subir.
2. **Sistema de diseño base**: colores, tipografías (Inter + EB Garamond 300 como sustituto de Waldenburg), radios, sombras y espaciados de `design.md` como variables; componentes sueltos: botón (relleno y contorno), tarjeta, badge, campo de texto, etiqueta de color, orbes pastel. — **se comprueba:** una página temporal de muestra enseña todos los componentes y se ve coherente con `design.md`.
3. **Estructura de la app**: layout con barra superior (Dashboard / Leads / Oportunidades / Etiquetas), menú hamburguesa en móvil y fondo off-white. — **se comprueba:** se navega entre los 4 apartados y el menú se pliega por debajo de 768 px.
4. **Capa de lectura de datos** en `lib/`: cliente de Supabase solo servidor, tipos de las 5 tablas (generados desde Supabase) y funciones de lectura (leads con etiquetas, ficha completa, oportunidades con su lead, etiquetas con nº de leads, métricas). — **se comprueba:** una página temporal imprime los 8 leads y 10 oportunidades reales.
5. **Dashboard**: tarjetas con nº de leads (y por estado), oportunidades por fase, valor total del pipeline abierto y valor ganado, en formato €. Además: gráfico de barras del pipeline (valor en € por fase), los 5 leads más recientes con enlace a su ficha y las próximas oportunidades abiertas por fecha de cierre estimado. Titular editorial con un orbe pastel de fondo. — **se comprueba:** las cifras coinciden con una suma hecha a mano sobre los datos de ejemplo, el gráfico refleja los totales por fase y los enlaces abren la ficha correcta.
6. **Leads · lista**: filas tipo `voice-row` (avatar con iniciales, nombre, empresa, estado, etiquetas y fecha); buscador (nombre, email, empresa) y filtros por estado y por etiqueta, guardados en la URL. — **se comprueba:** buscar y filtrar reduce la lista como se espera y al recargar el filtro se mantiene.
7. **Leads · ficha** (`/leads/[id]`): datos de contacto, estado, etiquetas, oportunidades del lead y notas en orden cronológico inverso; botones de crear/editar presentes pero **desactivados** hasta la fase 3. — **se comprueba:** abrir 3 leads distintos y ver que sus etiquetas, notas y oportunidades son las correctas.
8. **Oportunidades · pipeline**: tablero con 5 columnas (contactado, propuesta, negociación, ganada, perdida), tarjetas con título, lead, valor y cierre estimado, total por columna. Scroll horizontal en móvil. — **se comprueba:** cada oportunidad está en su fase y los totales por columna cuadran.
9. **Etiquetas**: catálogo con su color y nº de leads de cada una. — **se comprueba:** los colores y recuentos coinciden con la base de datos.
10. **Estados vacíos, carga y errores** (sin resultados, ficha inexistente, fallo de conexión) y revisión responsive en móvil, tablet y escritorio. Todo el texto en español de España, sin emojis. — **se comprueba:** una búsqueda sin resultados, un id inventado en la URL y la vista a 375 px se ven bien.

## Skills que usaremos
`frontend-design` (dirección visual), `nextjs-app-router-patterns` (estructura y Server Components), `vercel-react-best-practices` (rendimiento, consultas en paralelo), `supabase-postgres-best-practices` (consultas y seguridad de la clave), `copywriting` (textos de la interfaz).

## Riesgos / dudas para el humano
- **Solo lectura en esta fase.** Hasta la fase 3 no se puede crear ni editar nada desde la web. ¿Te parece bien, o prefieres adelantar algún formulario?
- **Tipografía:** Waldenburg es de pago. Propongo EB Garamond 300 (gratuita, recomendada en `design.md`). ¿De acuerdo?
- **Mover oportunidades:** en el pipeline las tarjetas se verán, pero no se arrastrarán hasta la fase 3.
- **Clave `service_role`:** estará solo en `.env.local` y se usará solo en el servidor. Hay que pegar las claves del proyecto "CRM" de Supabase; puedo obtener la URL y la clave pública con el conector, pero la `service_role` hay que copiarla del panel de Supabase.
- **Sin login:** cualquiera con el enlace verá los datos. Es aceptable en desarrollo; conviene decidir antes de la fase 4 si se publica con datos de ejemplo.
- **Decididos contigo:** ficha en página propia (`/leads/[id]`), lista en filas tipo tabla, estilo editorial con orbes pastel discretos en cabeceras, y dashboard con gráfico del pipeline, leads recientes y próximos cierres.

## Hecho cuando
Las cuatro secciones (dashboard, leads con lista y ficha, pipeline y etiquetas) muestran los datos reales de Supabase con el estilo de `design.md`, funcionan con buscador y filtros, se ven bien en móvil y escritorio, y has recorrido toda la app a mano en el navegador dando tu visto bueno. No hay ninguna clave secreta en el código ni en el navegador.
