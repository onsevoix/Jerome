-- Schéma initial : célibataires (liste déroulante décla), déclas, participations.
-- Écriture réservée au service_role (utilisé uniquement par les Edge Functions) :
-- aucune policy d'insertion n'est donnée au rôle anon, pour empêcher l'écriture
-- directe depuis le navigateur en contournant la validation des Edge Functions.

create table if not exists celibataires (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  created_at timestamptz not null default now()
);

create table if not exists declas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  celibataire text not null,
  message text not null,
  email text not null
);

create table if not exists participations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prenom text not null,
  ville text not null,
  age integer not null,
  email text not null,
  instagram text not null,
  vocal_path text
);

alter table celibataires enable row level security;
alter table declas enable row level security;
alter table participations enable row level security;

-- Seule la liste des célibataires est lisible publiquement (pour peupler le menu
-- déroulant du formulaire décla). Les déclas et participations ne sont lisibles
-- que depuis le dashboard Supabase (service_role), pas depuis le site public.
drop policy if exists "Public can read celibataires" on celibataires;
create policy "Public can read celibataires"
  on celibataires for select
  to anon
  using (true);

insert into celibataires (nom)
select nom from (values
  ('Épisode 12 — Léa'),
  ('Épisode 13 — Thomas'),
  ('Épisode 14 — Nour')
) as seed(nom)
where not exists (select 1 from celibataires);

-- Bucket de stockage privé pour les vocaux (pas de policy anon : upload et
-- lecture réservés au service_role, donc aux Edge Functions et au dashboard).
insert into storage.buckets (id, name, public)
values ('vocaux', 'vocaux', false)
on conflict (id) do nothing;
