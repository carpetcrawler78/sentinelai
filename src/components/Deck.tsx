import { useEffect, useState } from "react";
import { LogoSymbol } from "./LogoSymbol";
import { ReviewerApp } from "./slides/ReviewerApp";

import slide1 from "../data/slide1.html?raw";
import slide2 from "../data/slide2.html?raw";
import slide3 from "../data/slide3.html?raw";
import slide4 from "../data/slide4.html?raw";
import slide5 from "../data/slide5.html?raw";
import slide6 from "../data/slide6.html?raw";
import slide8 from "../data/slide8.html?raw";
import slide9 from "../data/slide9.html?raw";

// Slide 7 = ReviewerApp (React, interactive)
const htmlSlides: Record<number, string> = {
  1: slide1, 2: slide2, 3: slide3, 4: slide4, 5: slide5, 6: slide6, 8: slide8, 9: slide9,
};

const TOTAL = 9;

function HtmlSlide({ html }: { html: string }) {
  return <div className="slide-html" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Deck() {
  const [idx, setIdx] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function fit() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScale(Math.min(w / 1920, h / 1080));
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "BUTTON" || target.tagName === "INPUT")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setIdx((i) => Math.min(TOTAL, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIdx((i) => Math.max(1, i - 1));
      } else if (e.key === "Home") setIdx(1);
      else if (e.key === "End") setIdx(TOTAL);
      else if (/^[1-9]$/.test(e.key)) {
        setIdx(parseInt(e.key, 10));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="deck-viewport">
      <LogoSymbol />
      <div className="deck-stage-wrap" style={{ ["--scale" as string]: scale }}>
        {idx === 7 ? <ReviewerApp /> : <HtmlSlide html={htmlSlides[idx]} />}
      </div>

      <div className="deck-pager">
        <button onClick={() => setIdx((i) => Math.max(1, i - 1))} disabled={idx === 1} aria-label="Previous">
          ←
        </button>
        <span>
          {String(idx).padStart(2, "0")} / {TOTAL}
        </span>
        <button onClick={() => setIdx((i) => Math.min(TOTAL, i + 1))} disabled={idx === TOTAL} aria-label="Next">
          →
        </button>
      </div>
    </div>
  );
}
