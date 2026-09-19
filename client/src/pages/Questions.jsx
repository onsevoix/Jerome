import { useRef, useState } from "react";
import { questions } from "../data/questions.js";

const COLORS = ["lavande", "violet", "rose", "corail"];
const SWIPE_THRESHOLD = 90;

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

export default function Questions() {
  const [deck, setDeck] = useState(buildDeck);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, dragging: false, exiting: null });

  const startXRef = useRef(0);
  const pointerIdRef = useRef(null);

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

  function goTo(direction) {
    if (drag.exiting) return;
    setDrag({ x: direction === "right" ? 500 : -500, dragging: false, exiting: direction });
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
      goTo("right");
    } else if (drag.x < -SWIPE_THRESHOLD) {
      goTo("left");
    } else {
      setDrag({ x: 0, dragging: false, exiting: null });
    }
  }

  const visibleCards = [deck[index], deck[index + 1], deck[index + 2]].filter(Boolean);

  return (
    <section>
      <h2 className="page__title page__title--centered">Questions</h2>
      <p className="page__lead page__lead--centered">
        Des questions à se poser entre célibataires. Fais glisser la carte pour découvrir la
        suivante.
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
        <button type="button" className="questions-nav__btn" onClick={() => goTo("left")}>
          ← Suivante
        </button>
        <button type="button" className="questions-nav__btn" onClick={() => goTo("right")}>
          Suivante →
        </button>
      </div>
    </section>
  );
}
