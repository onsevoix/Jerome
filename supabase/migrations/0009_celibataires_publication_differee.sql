-- Publication differee des celibataires : un celibataire n'apparait dans le
-- menu deroulant de la page Decla qu'a partir de la date indiquee (on utilise
-- la veille de la sortie de son episode, a minuit heure de Paris). Vide =
-- visible immediatement. "disponible" reste l'interrupteur manuel pour retirer
-- quelqu'un de la liste.
alter table celibataires add column if not exists disponible_a_partir_du timestamptz;

create or replace view celibataires_public as
select nom
from celibataires
where disponible = true
  and (disponible_a_partir_du is null or disponible_a_partir_du <= now())
order by numero desc;
