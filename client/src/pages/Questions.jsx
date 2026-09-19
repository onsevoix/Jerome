import { useRef, useState } from "react";
import { questions } from "../data/questions.js";

const SWIPE_THRESHOLD = 90;
const SHARE_HINT_DURATION = 4000;

const CARD_COLORS = {
  lavande: { bg: "#d0d5fd", text: "#4f2b87" },
  violet: { bg: "#4f2b87", text: "#d0d5fd" },
  rose: { bg: "#f6d6e1", text: "#f44e26" },
  corail: { bg: "#f44e26", text: "#f6d6e1" },
};
const COLORS = Object.keys(CARD_COLORS);

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickColor(previousColor) {
  const options = COLORS.filter((c) => c !== previousColor);
  return options[Math.floor(Math.random() * options.length)];
}

function buildDeck() {
  let previousColor = null;
  return shuffle(questions).map((text) => {
    const color = pickColor(previousColor);
    previousColor = color;
    return { text, color };
  });
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

  await Promise.all([
    document.fonts.load("700 64px Inter"),
    document.fonts.load("italic 600 46px Fraunces"),
  ]);

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 64px Inter, sans-serif";

  const maxWidth = width - 180;
  const lines = wrapText(ctx, card.text, maxWidth);
  const lineHeight = 82;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  ctx.font = "italic 600 46px Fraunces, Georgia, serif";
  ctx.fillText("On se voix ?", width / 2, height - 110);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
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
    if (!card || sharing) return;
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
                  transform: `translateY(${i * 10}px) scale(${1 - i * 0.04})`,
                };
            return (
              <div
                key={`${index + i}-${card.text}`}
                className={`question-card question-card--${card.color}`}
                style={style}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
              >
                <p>{card.text}</p>
              </div>
            );
          })}
      </div>

      <div className="questions-nav">
        <button type="button" className="questions-nav__btn" onClick={nextQuestion}>
          🔀 Nouvelle question
        </button>
        <button
          type="button"
          className="questions-nav__btn questions-nav__btn--secondary"
          onClick={shareCurrentQuestion}
          disabled={sharing}
        >
          {sharing ? "Préparation…" : "📤 Partager"}
        </button>
      </div>

      {shareHint && <p className="field__hint questions-share-hint">{shareHint}</p>}
    </section>
  );
}
