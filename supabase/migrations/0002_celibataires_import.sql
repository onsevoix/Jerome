-- Ajoute les colonnes necessaires pour importer les vrais celibataires
-- (numero d'episode, email de contact, disponibilite) et separe l'acces
-- public (menu deroulant du formulaire decla) de l'acces prive (emails).

alter table celibataires add column if not exists numero integer;
alter table celibataires add column if not exists email text;
alter table celibataires add column if not exists disponible boolean not null default true;

alter table celibataires drop constraint if exists celibataires_numero_key;
alter table celibataires add constraint celibataires_numero_key unique (numero);

-- L'ancienne policy exposait toute la table (donc les emails) au public.
-- On la retire : plus aucun acces anon direct sur la table elle-meme.
drop policy if exists "Public can read celibataires" on celibataires;

-- Vue publique : uniquement le nom affiche, et seulement les celibataires
-- encore disponibles. Pas d'email, pas de statut, pas de numero brut.
create or replace view celibataires_public as
select nom
from celibataires
where disponible = true
order by numero desc;

grant select on celibataires_public to anon;
