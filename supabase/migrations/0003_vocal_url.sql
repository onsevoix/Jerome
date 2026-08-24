-- Ajoute une colonne contenant un lien d'ecoute direct (URL signee) vers le
-- fichier audio, pour eviter d'avoir a chercher le fichier manuellement dans
-- Storage a partir de son identifiant technique.

alter table participations add column if not exists vocal_url text;
