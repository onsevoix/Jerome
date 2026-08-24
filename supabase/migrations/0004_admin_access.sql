-- Autorise les utilisateurs Supabase Auth connectes (role "authenticated")
-- a lire les declas et participations, pour la page d'administration
-- privee /admin. Aucune policy d'ecriture : lecture seule.
--
-- IMPORTANT : ceci ne reste sur que si les inscriptions publiques sont
-- desactivees (Authentication > Providers > Email > "Allow new users to
-- sign up" doit etre decoche), et que seuls des comptes crees a la main
-- par vous existent. Sinon n'importe qui pourrait s'inscrire et lire ces
-- donnees.

create policy "Authenticated can read declas"
  on declas for select
  to authenticated
  using (true);

create policy "Authenticated can read participations"
  on participations for select
  to authenticated
  using (true);
