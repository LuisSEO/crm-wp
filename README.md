# Kit de inicio · CRM de leads

Este es el **punto de partida** para construir tu primera app con Claude Code: un **CRM** (dashboard, leads con etiquetas, oportunidades con pipeline y notas, sobre una base de datos).

No tienes que escribir código. Tienes que **entender el mapa y dirigir a la IA**.

## Qué hay aquí

```
crm-sistema/
├── CLAUDE.md        ← el manual del proyecto (qué es y cómo está organizado)
├── AGENTS.md        ← cómo trabajar con la IA (planificar, probar, aprobar)
├── design.md        ← cómo se ve la app (sistema de diseño real, ElevenLabs)
├── README.md        ← esto que estás leyendo
├── Plans/           ← los planes (empieza por 00-plan-maestro.md)
├── docs/conectores.md ← cómo enchufar Supabase y GitHub
├── .claude/skills/  ← capacidades ya hechas que la IA puede usar
├── app/             ← el frontend (dashboard, leads, oportunidades, etiquetas) + app/api (el backend)
├── components/      ← piezas reutilizables del frontend
└── lib/             ← la conexión con la base de datos (Supabase)
```

## La idea

1. El **cerebro** del proyecto ya está escrito: `CLAUDE.md` (qué es), `AGENTS.md` (cómo trabajar) y `design.md` (cómo se ve).
2. Las **skills** son capacidades reutilizables. Las de dominio son reales del marketplace **skills.sh** (instaladas con `npx skills add`); las de metodología (`crear-plan`, `implementar`) vienen en el kit.
3. Tú le pides a la IA lo que quieres, ella planifica e implementa, y **tú lo pruebas a mano** en el navegador.

## Cómo arrancar (en la clase de desarrollo)

1. Abre esta carpeta con Claude Code.
2. La IA lee `CLAUDE.md`, `AGENTS.md` y `design.md` automáticamente.
3. Pídele: *"Móntame el CRM siguiendo el CLAUDE.md y el plan maestro, fase a fase, en plan mode."*
4. Aprueba el plan, deja que construya una fase, y **pruébala tú** (abre la web) antes de seguir.

> Las herramientas (Node.js, cuentas de Supabase y Vercel) se instalan en la clase de desarrollo. Aquí están el esqueleto, el cerebro y las skills listos.
