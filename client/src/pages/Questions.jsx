import { useRef, useState } from "react";
import { questions } from "../data/questions.js";

const SWIPE_THRESHOLD = 90;
const SHARE_HINT_DURATION = 4000;
const PROMO_INTERVAL = 7;
const PROMO_TEXT = "Vous aimez une question ? Partagez-la à votre entourage pour voir ce qu'il en pense";
const PEEK_STYLES = [
  null,
  { x: 14, y: 20, rotate: 5, scale: 0.95 },
  { x: -20, y: 38, rotate: -7, scale: 0.9 },
];

const CARD_COLORS = {
  lavande: { bg: "#d0d5fd", text: "#4f2b87" },
  violet: { bg: "#4f2b87", text: "#d0d5fd" },
  rose: { bg: "#f6d6e1", text: "#f44e26" },
  corail: { bg: "#f44e26", text: "#f6d6e1" },
};
const COLORS = Object.keys(CARD_COLORS);

// Numéro stable par question (position dans data/questions.js), conservé
// même si l'ordre d'affichage est mélangé.
let NUMBERED_QUESTIONS;

const NBSP = " ";
// Mots d'une à trois lettres qui ne doivent jamais se retrouver seuls en fin
// de ligne (typographie française classique).
const SHORT_WORDS = new Set([
  "à", "as", "ça", "ce", "ces", "ci", "de", "des", "du", "dès", "en", "es",
  "est", "et", "il", "je", "la", "le", "les", "ma", "me", "mes", "mi", "ne",
  "ni", "nos", "nu", "on", "ont", "or", "ou", "où", "que", "qui", "ses",
  "si", "su", "sur", "ta", "te", "tes", "tu", "un", "une", "vos", "vu", "y",
]);

function frenchTypography(text) {
  const words = text.split(" ");
  let out = words[0] ?? "";
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const prevBare = words[i - 1].toLowerCase().replace(/[.,;:!?'"«»()…]/g, "");
    const glue =
      SHORT_WORDS.has(prevBare) ||
      /\d/.test(words[i - 1]) ||
      /\d/.test(word) ||
      /^[?!:;»]/.test(word) ||
      /«$/.test(words[i - 1]);
    out += (glue ? NBSP : " ") + word;
  }
  return out;
}

NUMBERED_QUESTIONS = questions.map((text, i) => ({ number: i + 1, text: frenchTypography(text) }));
const FRENCH_PROMO_TEXT = frenchTypography(PROMO_TEXT);

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickColor(excluded) {
  const options = COLORS.filter((c) => !excluded.includes(c));
  return options[Math.floor(Math.random() * options.length)];
}

function buildDeck() {
  // Les 3 cartes visibles à l'écran en même temps (celle du dessus + les 2
  // qui dépassent derrière) doivent toujours avoir 3 couleurs différentes :
  // chaque carte évite donc la couleur des 2 précédentes, pas juste la
  // dernière. Une carte "partage" s'intercale tous les PROMO_INTERVAL
  // questions pour inciter à utiliser le bouton de partage.
  let prev1 = null;
  let prev2 = null;
  const nextColor = () => {
    const color = pickColor([prev1, prev2].filter(Boolean));
    prev2 = prev1;
    prev1 = color;
    return color;
  };

  const deck = [];
  shuffle(NUMBERED_QUESTIONS).forEach(({ number, text }, i) => {
    deck.push({ type: "question", number, text, color: nextColor() });
    if ((i + 1) % PROMO_INTERVAL === 0) {
      deck.push({ type: "promo", text: FRENCH_PROMO_TEXT, color: nextColor() });
    }
  });
  return deck;
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function renderCardImage(card) {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const colors = CARD_COLORS[card.color];

  await document.fonts.load("700 64px Inter");

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (card.number) {
    ctx.font = "700 32px Inter, sans-serif";
    ctx.fillText(`Question ${card.number}`, width / 2, 140);
  }

  ctx.font = "700 64px Inter, sans-serif";

  const maxWidth = width - 180;
  const lines = wrapText(ctx, card.text, maxWidth);
  const lineHeight = 82;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  ctx.font = "600 40px Inter, sans-serif";
  ctx.fillText("@onsevoix", width / 2, height - 110);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 16V4M12 4L7 9M12 4l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Questions() {
  const [deck, setDeck] = useState(buildDeck);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, dragging: false, exiting: null });
  const [sharing, setSharing] = useState(false);
  const [shareHint, setShareHint] = useState(null);

  const startXRef = useRef(0);
  const pointerIdRef = useRef(null);
  const hintTimeoutRef = useRef(null);

  function advance() {
    setDrag({ x: 0, dragging: false, exiting: null });
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= deck.length) {
        setDeck(buildDeck());
        return 0;
      }
      return next;
    });
  }

  function nextQuestion() {
    if (drag.exiting) return;
    setDrag({ x: -500, dragging: false, exiting: "left" });
    setTimeout(advance, 220);
  }

  function handlePointerDown(e) {
    if (drag.exiting) return;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    setDrag({ x: 0, dragging: true, exiting: null });
  }

  function handlePointerMove(e) {
    if (!drag.dragging || e.pointerId !== pointerIdRef.current) return;
    setDrag((prev) => ({ ...prev, x: e.clientX - startXRef.current }));
  }

  function handlePointerUp(e) {
    if (!drag.dragging || e.pointerId !== pointerIdRef.current) return;
    if (drag.x > SWIPE_THRESHOLD) {
      setDrag({ x: 500, dragging: false, exiting: "right" });
      setTimeout(advance, 220);
    } else if (drag.x < -SWIPE_THRESHOLD) {
      nextQuestion();
    } else {
      setDrag({ x: 0, dragging: false, exiting: null });
    }
  }

  function showHint(text) {
    clearTimeout(hintTimeoutRef.current);
    setShareHint(text);
    hintTimeoutRef.current = setTimeout(() => setShareHint(null), SHARE_HINT_DURATION);
  }

  async function shareCurrentQuestion() {
    const card = deck[index];
    if (!card || sharing || card.type === "promo") return;
    setSharing(true);
    try {
      const blob = await renderCardImage(card);
      const file = new File([blob], "on-se-voix-question.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "On se voix ?", text: card.text });
      } else if (navigator.share) {
        await navigator.share({ title: "On se voix ?", text: card.text });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "on-se-voix-question.png";
        link.click();
        URL.revokeObjectURL(url);
        showHint("Image téléchargée : tu peux la partager en story ou en post sur Instagram.");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        showHint("Impossible de partager cette question pour le moment.");
      }
    } finally {
      setSharing(false);
    }
  }

  const visibleCards = [deck[index], deck[index + 1], deck[index + 2]].filter(Boolean);

  return (
    <section>
      <h2 className="page__title page__title--centered">Questions</h2>
      <p className="page__lead page__lead--centered">
        Des centaines de questions pour mieux apprendre à connaître ses dates, ses potes et
        surtout se connaître soi-même
      </p>

      <div className="questions-stack">
        {visibleCards
          .map((card, i) => ({ card, i }))
          .reverse()
          .map(({ card, i }) => {
            const isTop = i === 0;
            const style = isTop
              ? {
                  transform: `translateX(${drag.x}px) rotate(${drag.x / 18}deg)`,
                  transition: drag.dragging ? "none" : "transform 0.25s var(--ease-soft)",
                  opacity: drag.exiting ? 0 : 1,
                }
              : {
                  transform: `translate(${PEEK_STYLES[i].x}px, ${PEEK_STYLES[i].y}px) rotate(${PEEK_STYLES[i].rotate}deg) scale(${PEEK_STYLES[i].scale})`,
                };
            return (
              <div
                key={`${index + i}-${card.text}`}
                className={`question-card question-card--${card.color} ${
                  card.type === "promo" ? "question-card--promo" : ""
                }`}
                style={style}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
              >
                {isTop && card.type === "promo" && (
                  <>
                    <span className="question-card__share-hint" aria-hidden="true">
                      <ShareIcon />
                    </span>
                    <svg
                      className="question-card__arrow-hint"
                      viewBox="0 0 64 56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 50C16 46,32 32,44 16" />
                      <path d="M42 27L44 16L34 21" />
                    </svg>
                  </>
                )}
                {isTop && card.type !== "promo" && (
                  <button
                    type="button"
                    className="question-card__share"
                    aria-label="Partager cette question"
                    disabled={sharing}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      shareCurrentQuestion();
                    }}
                  >
                    <ShareIcon />
                  </button>
                )}
                {card.type === "promo" && (
                  <span className="question-card__kicker">💡 Astuce</span>
                )}
                {card.type === "question" && (
                  <span className="question-card__kicker">Question {card.number}</span>
                )}
                <p>{card.text}</p>
              </div>
            );
          })}
      </div>

      <button
        type="button"
        className="questions-new-btn"
        aria-label="Nouvelle question"
        onClick={nextQuestion}
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      </button>

      {shareHint && <p className="field__hint questions-share-hint">{shareHint}</p>}
    </section>
  );
}
