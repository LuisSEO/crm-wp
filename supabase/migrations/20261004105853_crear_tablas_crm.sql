create table public.leads (
  id bigint generated always as identity primary key,
  nombre text not null,
  email text unique,
  telefono text,
  empresa text,
  estado text not null default 'nuevo' check (estado in ('nuevo','cualificado','descartado')),
  origen text,
  created_at timestamptz not null default now()
);

create table public.etiquetas (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  color text not null default '#6b7280'
);

create table public.lead_etiquetas (
  lead_id bigint not null references public.leads(id) on delete cascade,
  etiqueta_id bigint not null references public.etiquetas(id) on delete cascade,
  primary key (lead_id, etiqueta_id)
);

create table public.oportunidades (
  id bigint generated always as identity primary key,
  lead_id bigint not null references public.leads(id) on delete cascade,
  titulo text not null,
  valor numeric(12,2) not null default 0 check (valor >= 0),
  fase text not null default 'contactado' check (fase in ('contactado','propuesta','negociacion','ganada','perdida')),
  cierre_estimado date,
  created_at timestamptz not null default now()
);

create table public.notas (
  id bigint generated always as identity primary key,
  lead_id bigint not null references public.leads(id) on delete cascade,
  texto text not null,
  created_at timestamptz not null default now()
);

create index leads_estado_idx on public.leads(estado);
create index lead_etiquetas_etiqueta_id_idx on public.lead_etiquetas(etiqueta_id);
create index oportunidades_lead_id_idx on public.oportunidades(lead_id);
create index oportunidades_fase_idx on public.oportunidades(fase);
create index notas_lead_id_idx on public.notas(lead_id);

alter table public.leads enable row level security;
alter table public.etiquetas enable row level security;
alter table public.lead_etiquetas enable row level security;
alter table public.oportunidades enable row level security;
alter table public.notas enable row level security;
