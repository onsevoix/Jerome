import { useState } from "react";
import { socialLinks } from "../data/links.js";

const faqs = [
  {
    question: "Est-ce que je peux participer si je n'habite pas à Paris ?",
    answer: "Oui, depuis le 1er septembre, tous les célibataires peuvent participer. 🌍",
  },
  {
    question: "Est-ce que je peux participer si je suis une personne LGBT ?",
    answer:
      "Oui ! Le podcast est ouvert à toutes les orientations ou préférences. N'oubliez pas de préciser ce que vous recherchez dans votre vocal. 🏳️‍🌈",
  },
  {
    question: "Est-ce que c'est payant ?",
    answer:
      "Non, notre podcast est totalement gratuit, aussi bien pour les auditeurs que les participants. 🆓",
  },
  {
    question: "Est-ce que tous les vocaux sont diffusés ?",
    answer:
      "Non, nous sélectionnons les meilleurs : les plus authentiques, les plus originaux, les meilleurs grains de voix. ✨",
  },
  {
    question: "Est-ce que mon épisode sera supprimé quand je ne serai plus célibataire ?",
    answer:
      "Si vous n'êtes plus célibataire, nous vous retirons de la liste des déclarations. Les auditeurs ne pourront alors plus vous envoyer de messages. 🔒",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section>
      <h2 className="page__title page__title--centered">FAQ</h2>
      <p className="page__lead page__lead--centered">
        Les réponses aux questions les plus fréquentes sur{" "}
        <strong className="page__lead-strong">On se voix ?</strong>
      </p>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="faq-item">
              <button
                type="button"
                className="faq-item__question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {item.question}
                <svg className="faq-item__chevron" viewBox="0 0 16 16" aria-hidden="true">
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
              {isOpen && <p className="faq-item__answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

      <p className="page__lead page__lead--centered">
        Vous avez d'autres questions ? Envoyez-nous un message sur{" "}
        <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
    </section>
  );
}
