// Logo SVG symbol used by all slides via <use href="#logo-shield" />
export function LogoSymbol() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="logo-shield" viewBox="0 0 100 100">
          <path
            d="M 50 12 L 82 24 L 82 54 C 82 70 68 82 50 88 C 32 82 18 70 18 54 L 18 24 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 50 22 L 74 30 L 74 53 C 74 65 64 74 50 79 C 36 74 26 65 26 53 L 26 30 Z"
            fill="var(--terracotta-2)"
            opacity="0.18"
          />
          <path
            d="M 26 54 L 38 54 L 42 44 L 48 64 L 54 38 L 60 58 L 64 54 L 74 54"
            stroke="var(--terracotta-2)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </symbol>
      </defs>
    </svg>
  );
}
