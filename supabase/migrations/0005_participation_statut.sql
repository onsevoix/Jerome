-- Statut de traitement d'une participation, choisi par l'equipe depuis la
-- page /admin. Ecriture restreinte a cette seule colonne (defense en
-- profondeur : meme avec une requete forgee, impossible de modifier
-- email/vocal_url/etc depuis le role authenticated).

alter table participations add column if not exists statut text
  check (statut is null or statut in ('Pré-accepté', 'Accepté', 'Pré-refusé', 'Refusé'));

create policy "Authenticated can update participation statut"
  on participations for update
  to authenticated
  using (true)
  with check (true);

revoke update on participations from authenticated;
grant update (statut) on participations to authenticated;
