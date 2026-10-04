# Conectores · enchufar Supabase y GitHub a Claude Code

Los "conectores" (MCP) son enchufes que le dan a Claude Code manos para usar herramientas reales: leer/escribir en tu base de datos, crear repos, etc. Aquí montamos los dos que necesita el CRM. **La forma más sencilla es por terminal (CLI), pero hay otras.**

> No hace falta memorizar nada. Le puedes pedir a Claude: *"conéctame Supabase y GitHub siguiendo docs/conectores.md"* y él ejecuta los comandos, preguntándote antes.

## 1. Supabase (la base de datos)

Comando (a nivel proyecto, se guarda en `.mcp.json` y se comparte con el equipo):

```bash
claude mcp add --scope project --transport stdio supabase \
  -- npx -y @supabase/mcp-server-supabase
```

- La primera vez te pedirá **identificarte en Supabase** (se abre el navegador) y elegir tu proyecto.
- Para todos tus proyectos en vez de solo este, cambia `--scope project` por `--scope user`.

## 2. GitHub (donde vive el código)

Comando (servidor remoto de GitHub, el más simple):

```bash
claude mcp add --scope project --transport http github \
  https://api.githubcopilot.com/mcp/
```

- La primera vez abrirá el navegador para **autorizar con tu cuenta de GitHub**.
- Alternativa sin MCP: el CLI `gh` (GitHub CLI). Crear repo y subir: `gh repo create crm-leads --source=. --push`.

## 3. Comprobar que están conectados

```bash
claude mcp list
```

Debe salir algo así:

```
✓ Connected  supabase
✓ Connected  github
```

Dentro de una sesión de Claude, también puedes escribir `/mcp` para ver el estado.

## Reglas de seguridad

- Estos conectores tocan datos reales: trabaja en **plan mode** (Shift+Tab) para revisar antes de ejecutar.
- Las claves nunca se pegan en el chat ni en el código: van en `.env` o las gestiona el propio conector por OAuth.
- Para Supabase, mantén RLS activado y no uses la clave `service_role` en el frontend (ver skill `supabase-postgres-best-practices`).

> Comandos verificados con la documentación oficial de Claude Code, Supabase MCP y GitHub MCP (2026). Si un comando cambia, pídele a Claude que consulte la doc oficial.
