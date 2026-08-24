import { useState } from "react";

export default function APropos() {
  const [showLegal, setShowLegal] = useState(false);

  return (
    <section>
      <h2 className="page__title">À propos de nous</h2>
      <p className="page__lead">
        <strong className="page__lead-strong">On se voix ?</strong> est le 1er podcast de
        rencontres amoureuses, classé Top 10 des podcasts Relations. Chaque épisode donne la
        parole à un⋅e célibataire qui se livre avec sincérité, pas de CV amoureux, pas de mise en
        scène, juste des vraies histoires et des vraies voix.
      </p>
      <p className="page__lead">
        Notre conviction : ce sont les petites choses du quotidien, les détails qui nous
        caractérisent vraiment, qui créent les vraies connexions et les vraies relations. Alors on
        écoute, on rit, on s'attache, et parfois, on se voix ?
      </p>
      <p className="page__lead">
        <strong className="page__lead-strong">On se voix ?</strong> est un podcast imaginé par
        Mahé Parisse et Jérôme Lavillat, et produit par le studio Engle.
      </p>

      <button
        type="button"
        className="legal-toggle"
        aria-expanded={showLegal}
        onClick={() => setShowLegal((v) => !v)}
      >
        Mentions légales
        <svg className="legal-toggle__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showLegal && (
        <div className="legal-panel">
          <h3 className="legal-heading">Éditeur du site</h3>
          <p className="page__lead">
            Le site <strong className="page__lead-strong">On se voix ?</strong> est édité par
            Mahé Parisse et Jérôme Lavillat, en tant que particuliers et à titre bénévole
            (activité non commerciale). Contact :{" "}
            <a href="mailto:onsevoix.podcast@gmail.com">onsevoix.podcast@gmail.com</a>.
          </p>

          <h3 className="legal-heading">Hébergement</h3>
          <p className="page__lead">
            Le site est hébergé par GitHub, Inc. (GitHub Pages). Les données et fichiers audio
            sont hébergés par Supabase, Inc.
          </p>

          <h3 className="legal-heading">Propriété intellectuelle</h3>
          <p className="page__lead">
            <strong className="page__lead-strong">On se voix ?</strong> est un concept original
            créé par Mahé Parisse et Jérôme Lavillat, dont l'antériorité de création a fait
            l'objet d'un dépôt probatoire. Toute reproduction ou exploitation du concept, en tout
            ou partie, sans autorisation préalable est interdite.
          </p>

          <h3 className="legal-heading">Données personnelles</h3>
          <p className="page__lead">
            Dans le cadre du formulaire « Faire une décla », nous collectons votre prénom, votre
            email et votre message. Dans le cadre du formulaire « Participer », nous collectons
            votre prénom, votre ville, votre âge, votre email, votre compte Instagram et votre
            vocal. Ces informations sont utilisées uniquement pour le fonctionnement du podcast
            (mise en relation et sélection des participant⋅es) et ne sont jamais partagées avec
            des tiers.
          </p>
          <p className="page__lead">
            En participant, vous consentez explicitement à ce que votre vocal soit diffusé sur
            les plateformes d'écoute et les réseaux sociaux du podcast.
          </p>
          <p className="page__lead">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
            suppression de vos données. Pour l'exercer, écrivez-nous à{" "}
            <a href="mailto:onsevoix.podcast@gmail.com">onsevoix.podcast@gmail.com</a>.
          </p>
        </div>
      )}
    </section>
  );
}
