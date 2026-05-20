import { useEffect, useState } from "react";
import { LogoSymbol } from "./LogoSymbol";
import { ReviewerApp } from "./slides/ReviewerApp";

import slide1 from "../data/slide1.html?raw";
import slide2 from "../data/slide2.html?raw";
import slide3 from "../data/slide3.html?raw";
import slide4 from "../data/slide4.html?raw";
import slide5 from "../data/slide5.html?raw";
import slide6 from "../data/slide6.html?raw";
import slide7 from "../data/slide7.html?raw";
import slide8 from "../data/slide8.html?raw";
import slide10 from "../data/slide10.html?raw";
import slide11 from "../data/slide11.html?raw";

const htmlSlides: Record<number, string> = {
  1: slide1, 2: slide2, 3: slide3, 4: slide4, 5: slide5,
  6: slide6, 7: slide7, 8: slide8, 10: slide10, 11: slide11,
};

const TOTAL = 11;

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
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setIdx((i) => Math.min(TOTAL, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIdx((i) => Math.max(1, i - 1));
      } else if (e.key === "Home") setIdx(1);
      else if (e.key === "End") setIdx(TOTAL);
      else if (/^[0-9]$/.test(e.key)) {
        const n = e.key === "0" ? 10 : parseInt(e.key, 10);
        if (n >= 1 && n <= TOTAL) setIdx(n);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="deck-viewport">
      <LogoSymbol />
      <div className="deck-stage-wrap" style={{ ["--scale" as string]: scale }}>
        {idx === 9 ? <ReviewerApp /> : <HtmlSlide html={htmlSlides[idx]} />}
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
