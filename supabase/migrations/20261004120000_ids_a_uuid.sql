-- Pasa los ids de bigint a uuid recreando las tablas (solo había datos de ejemplo).
drop table if exists public.lead_etiquetas, public.oportunidades, public.notas, public.etiquetas, public.leads cascade;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text unique,
  telefono text,
  empresa text,
  estado text not null default 'nuevo' check (estado in ('nuevo','cualificado','descartado')),
  origen text,
  created_at timestamptz not null default now()
);

create table public.etiquetas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  color text not null default '#6b7280'
);

create table public.lead_etiquetas (
  lead_id uuid not null references public.leads(id) on delete cascade,
  etiqueta_id uuid not null references public.etiquetas(id) on delete cascade,
  primary key (lead_id, etiqueta_id)
);

create table public.oportunidades (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  titulo text not null,
  valor numeric(12,2) not null default 0 check (valor >= 0),
  fase text not null default 'contactado' check (fase in ('contactado','propuesta','negociacion','ganada','perdida')),
  cierre_estimado date,
  created_at timestamptz not null default now()
);

create table public.notas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
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

insert into public.leads (nombre, email, telefono, empresa, estado, origen) values
('Marta Gómez','marta.gomez@aurora.es','600111222','Aurora Estudio','cualificado','web'),
('Javier Ruiz','javier@tecnosur.com','600222333','Tecnosur','nuevo','referido'),
('Lucía Fernández','lucia@bellavista.es','600333444','Bellavista Hoteles','cualificado','linkedin'),
('Pablo Martín','pablo@constructoramv.es','600444555','Constructora MV','descartado','web'),
('Elena Navarro','elena@nubelab.io','600555666','NubeLab','nuevo','evento'),
('Carlos Ortega','carlos@logisticaog.es','600666777','Logística OG','cualificado','llamada'),
('Sara Molina','sara@verdeplus.es','600777888','Verde Plus','nuevo','web'),
('Andrés Peña','andres@clinicapena.es','600888999','Clínica Peña','cualificado','referido');

insert into public.etiquetas (nombre, color) values
('Prioritario','#ef4444'),('Hosteleria','#f59e0b'),('Tecnologia','#3b82f6'),('Pyme','#10b981'),('Seguimiento','#8b5cf6');

insert into public.lead_etiquetas (lead_id, etiqueta_id)
select l.id, e.id from (values
 ('marta.gomez@aurora.es','Prioritario'),('marta.gomez@aurora.es','Pyme'),
 ('javier@tecnosur.com','Tecnologia'),
 ('lucia@bellavista.es','Hosteleria'),('lucia@bellavista.es','Prioritario'),
 ('elena@nubelab.io','Tecnologia'),('elena@nubelab.io','Seguimiento'),
 ('carlos@logisticaog.es','Pyme'),('carlos@logisticaog.es','Seguimiento'),
 ('sara@verdeplus.es','Pyme'),
 ('andres@clinicapena.es','Prioritario')
) v(email, etiqueta)
join public.leads l on l.email = v.email
join public.etiquetas e on e.nombre = v.etiqueta;

insert into public.oportunidades (lead_id, titulo, valor, fase, cierre_estimado)
select l.id, v.titulo, v.valor, v.fase, v.cierre::date from (values
 ('marta.gomez@aurora.es','Rediseño web corporativo',4500,'propuesta','2026-11-15'),
 ('marta.gomez@aurora.es','Mantenimiento anual',1200,'contactado','2026-12-01'),
 ('javier@tecnosur.com','Integración ERP',9800,'contactado','2027-01-20'),
 ('lucia@bellavista.es','Sistema de reservas',15000,'negociacion','2026-11-30'),
 ('lucia@bellavista.es','Campaña temporada alta',3200,'ganada','2026-09-30'),
 ('pablo@constructoramv.es','Portal de clientes',6000,'perdida','2026-09-10'),
 ('elena@nubelab.io','Consultoría de producto',2800,'propuesta','2026-12-10'),
 ('carlos@logisticaog.es','Panel de seguimiento de flotas',12500,'negociacion','2026-11-25'),
 ('carlos@logisticaog.es','App de repartidores',7400,'contactado','2027-02-05'),
 ('andres@clinicapena.es','Gestión de citas online',5100,'ganada','2026-10-01')
) v(email, titulo, valor, fase, cierre)
join public.leads l on l.email = v.email;

insert into public.notas (lead_id, texto)
select l.id, v.texto from (values
 ('marta.gomez@aurora.es','Primera llamada: interesada en rediseñar la web antes de enero.'),
 ('marta.gomez@aurora.es','Enviada propuesta por email, pendiente de respuesta.'),
 ('javier@tecnosur.com','Contacto desde el formulario web, pedir reunión.'),
 ('lucia@bellavista.es','Reunión en sus oficinas, buen feeling con la dirección.'),
 ('lucia@bellavista.es','Piden rebaja del 10% en el sistema de reservas.'),
 ('lucia@bellavista.es','Campaña de temporada alta cerrada y facturada.'),
 ('pablo@constructoramv.es','Han elegido a otro proveedor por precio.'),
 ('pablo@constructoramv.es','Descartado, revisar en seis meses.'),
 ('elena@nubelab.io','Conocida en el evento de startups, enviar dossier.'),
 ('elena@nubelab.io','Pide una segunda demo para su socio.'),
 ('carlos@logisticaog.es','Necesitan el panel antes de la campaña de Navidad.'),
 ('carlos@logisticaog.es','Pendiente de validar presupuesto con finanzas.'),
 ('sara@verdeplus.es','Ha rellenado el formulario, llamar esta semana.'),
 ('andres@clinicapena.es','Recomendado por otro cliente, muy receptivo.'),
 ('andres@clinicapena.es','Contrato firmado, empieza el 1 de octubre.')
) v(email, texto)
join public.leads l on l.email = v.email;
