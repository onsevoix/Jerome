-- Etend la colonne "classement" (affichee cote UI comme le nouveau "Statut")
-- avec l'etat "Diffuse". Elle garde son nom en base pour rester compatible
-- avec les donnees existantes ; seul le libelle affiche change.
alter table participations drop constraint if exists participations_classement_check;
alter table participations add constraint participations_classement_check
  check (classement is null or classement in ('Confirmé', 'Diffusé', 'Archivé'));

-- Commentaire libre laisse par l'equipe sur une participation.
alter table participations add column if not exists commentaire text;
grant update (commentaire) on participations to authenticated;

-- Avis individuels de Jerome et Mahe sur une participation (1 = pas bien,
-- 4 = tres bien). Deux colonnes distinctes car un seul compte de connexion
-- est partage entre les deux : l'app cote client demande "qui note ?" et
-- ecrit dans la colonne correspondante.
alter table participations add column if not exists avis_jerome smallint
  check (avis_jerome is null or avis_jerome between 1 and 4);
alter table participations add column if not exists avis_mahe smallint
  check (avis_mahe is null or avis_mahe between 1 and 4);
grant update (avis_jerome, avis_mahe) on participations to authenticated;

-- L'ancienne colonne "statut" (Pré-accepté/Accepté/Pré-refusé/Refusé) n'est
-- plus utilisee par l'interface (remplacee par les avis ci-dessus) mais est
-- volontairement conservee : elle contient l'historique des evaluations
-- deja faites par l'equipe.
