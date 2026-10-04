-- Email de lead y nombre de etiqueta únicos sin distinguir mayúsculas (sustituyen a los únicos exactos).
alter table public.leads drop constraint leads_email_key;
alter table public.etiquetas drop constraint etiquetas_nombre_key;
create unique index leads_email_lower_uidx on public.leads (lower(email)) where email is not null;
create unique index etiquetas_nombre_lower_uidx on public.etiquetas (lower(nombre));