export default function MentionsLegales() {
  return (
    <section>
      <h2 className="page__title">Mentions légales</h2>

      <h3 className="legal-heading">Éditeur du site</h3>
      <p className="page__lead">
        Le site <strong className="page__lead-strong">On se voix ?</strong> est édité par Mahé
        Parisse et Jérôme Lavillat, en tant que particuliers et à titre bénévole (activité non
        commerciale). Contact :{" "}
        <a href="mailto:onsevoix.podcast@gmail.com">onsevoix.podcast@gmail.com</a>.
      </p>

      <h3 className="legal-heading">Hébergement</h3>
      <p className="page__lead">
        Le site est hébergé par GitHub, Inc. (GitHub Pages). Les données et fichiers audio sont
        hébergés par Supabase, Inc.
      </p>

      <h3 className="legal-heading">Propriété intellectuelle</h3>
      <p className="page__lead">
        <strong className="page__lead-strong">On se voix ?</strong> est un concept original créé
        par Mahé Parisse et Jérôme Lavillat, dont l'antériorité de création a fait l'objet d'un
        dépôt probatoire. Toute reproduction ou exploitation du concept, en tout ou partie, sans
        autorisation préalable est interdite.
      </p>

      <h3 className="legal-heading">Données personnelles</h3>
      <p className="page__lead">
        Dans le cadre du formulaire « Faire une décla », nous collectons votre prénom, votre email
        et votre message. Dans le cadre du formulaire « Participer », nous collectons votre
        prénom, votre ville, votre âge, votre email, votre compte Instagram et votre vocal. Ces
        informations sont utilisées uniquement pour le fonctionnement du podcast (mise en relation
        et sélection des participant⋅es) et ne sont jamais partagées avec des tiers.
      </p>
      <p className="page__lead">
        En participant, vous consentez explicitement à ce que votre vocal soit diffusé sur les
        plateformes d'écoute et les réseaux sociaux du podcast.
      </p>
      <p className="page__lead">
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression
        de vos données. Pour l'exercer, écrivez-nous à{" "}
        <a href="mailto:onsevoix.podcast@gmail.com">onsevoix.podcast@gmail.com</a>.
      </p>
    </section>
  );
}
