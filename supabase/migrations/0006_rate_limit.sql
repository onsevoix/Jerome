-- Trace les envois par adresse IP pour limiter le spam sur les formulaires
-- publics (decla, participation). Ecriture/lecture reservees au
-- service_role (utilise uniquement par les Edge Functions).

create table if not exists rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_events_lookup_idx
  on rate_limit_events (ip, action, created_at);

alter table rate_limit_events enable row level security;
