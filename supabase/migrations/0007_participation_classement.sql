-- Classement final d'une participation (distinct du statut de tri fin,
-- qui reste le champ "statut"). Alimente les 3 onglets de filtre de la page
-- /admin : A traiter (classement null), Confirmes, Archives.

alter table participations add column if not exists classement text
  check (classement is null or classement in ('Confirmé', 'Archivé'));

grant update (classement) on participations to authenticated;
