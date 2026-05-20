import { useReducer } from "react";

/* Slide 9 — Two reviewer cases side by side (Easy + Hard).
 * Each panel is independently interactive: Accept / Correct / Reject. */

type Candidate = { pt: string; code: string; confidence: number; rationale: string };
type Case = {
  id: string;
  narrative: string;
  bottomLabel: string;
  candidates: Candidate[];
};

const EASY: Case = {
  id: "M-2026-1187",
  narrative:
    "Patient using Acme Insulin Pump (XR-100) experienced unexpected battery depletion during overnight basal delivery. Pump alarm did not sound. Patient woke with severe hyperglycaemia (BG 480 mg/dL); hospitalized for 36h.",
  bottomLabel: "Term appears in text",
  candidates: [
    { pt: "Hyperglycaemia", code: "10020639", confidence: 0.83, rationale: "Narrative states 'severe hyperglycaemia (BG 480)' — direct lexical match." },
    { pt: "Diabetic ketoacidosis", code: "10012671", confidence: 0.41, rationale: "Possible secondary decompensation, not confirmed." },
    { pt: "Device malfunction", code: "10013636", confidence: 0.34, rationale: "Pump-side failure, but PMS rules favour the clinical PT." },
    { pt: "Battery issue", code: "10004734", confidence: 0.29, rationale: "Root cause, not the patient-facing adverse event." },
  ],
};

const HARD: Case = {
  id: "M-2026-2041",
  narrative:
    "Patient woke confused, trembling. CGM read 34 mg/dL at 03:00. Device had not alarmed. Emergency glucose administered by paramedics.",
  bottomLabel: "Term absent from text — semantic search required",
  candidates: [
    { pt: "Hypoglycaemia", code: "10020993", confidence: 0.71, rationale: "BG 34 mg/dL + confusion + glucose rescue = textbook hypoglycaemia. Term never appears verbatim." },
    { pt: "Blood glucose decreased", code: "10005555", confidence: 0.52, rationale: "Lab-only PT; less specific given the clinical syndrome." },
    { pt: "Loss of consciousness", code: "10024855", confidence: 0.38, rationale: "Confusion noted, not LOC; weaker fit." },
    { pt: "Device alarm failure", code: "10063269", confidence: 0.31, rationale: "Concurrent device issue, secondary to the patient event." },
  ],
};

type Status = "open" | "coded" | "rejected";
type Mode = "view" | "correct";
type State = {
  candidates: Candidate[];
  status: Status;
  mode: Mode;
  selectedAlt: number | null;
  reviewerSelected: boolean;
};

const init = (c: Case): State => ({
  candidates: c.candidates,
  status: "open",
  mode: "view",
  selectedAlt: null,
  reviewerSelected: false,
});

type Action =
  | { type: "accept" }
  | { type: "reject" }
  | { type: "enter-correct" }
  | { type: "cancel-correct" }
  | { type: "select-alt"; idx: number }
  | { type: "confirm-correct" }
  | { type: "reset"; c: Case };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "accept":
      return { ...s, status: "coded" };
    case "reject": {
      if (s.candidates.length <= 1) return s;
      return { ...s, candidates: s.candidates.slice(1), mode: "view", selectedAlt: null };
    }
    case "enter-correct":
      return { ...s, mode: "correct", selectedAlt: null };
    case "cancel-correct":
      return { ...s, mode: "view", selectedAlt: null };
    case "select-alt":
      return { ...s, selectedAlt: a.idx };
    case "confirm-correct": {
      if (s.selectedAlt == null) return s;
      const altIdx = s.selectedAlt + 1;
      const chosen = s.candidates[altIdx];
      const newOrder = [chosen, ...s.candidates.filter((_, i) => i !== altIdx)];
      return { ...s, candidates: newOrder, mode: "view", selectedAlt: null, reviewerSelected: true };
    }
    case "reset":
      return init(a.c);
  }
}

function CasePanel({ c, kind }: { c: Case; kind: "easy" | "hard" }) {
  const [s, dispatch] = useReducer(reducer, c, init);
  const top = s.candidates[0];
  const alts = s.candidates.slice(1);

  const labelBg = kind === "hard" ? "var(--rust)" : "var(--ink)";
  const labelText = kind === "hard" ? "Hard case" : "Easy case";

  const btn = (label: string, onClick: () => void, primary = false, disabled = false): JSX.Element => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: 13,
        padding: "7px 14px",
        border: `1.5px solid ${primary ? "var(--terracotta-2)" : "var(--line)"}`,
        background: primary ? "var(--terracotta-2)" : "var(--cream)",
        color: primary ? "var(--cream)" : "var(--ink-2)",
        borderRadius: 6,
        fontWeight: primary ? 600 : 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: "var(--cream)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 16px 40px -28px oklch(30% .03 60 / .35)",
      }}
    >
      {/* Header label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span
          style={{
            background: labelBg,
            color: "var(--cream)",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 13,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {labelText}
        </span>
        <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>Case {c.id}</span>
      </div>

      {/* Narrative */}
      <div className="case" style={{ padding: "14px 20px" }}>
        <blockquote style={{ fontSize: 18, lineHeight: 1.4, margin: 0 }}>{c.narrative}</blockquote>
      </div>

      {/* SentinelAI result */}
      <div
        style={{
          border: "2px solid var(--terracotta-2)",
          background: s.status === "coded" ? "oklch(95% .035 145)" : "oklch(96% .025 60)",
          borderRadius: 10,
          padding: "14px 18px",
        }}
      >
        <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6 }}>
          SentinelAI result
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div className="serif" style={{ fontSize: 24, fontWeight: 600, color: "var(--ink)" }}>
            {top.pt}
            {s.status === "coded" && <span style={{ marginLeft: 10, fontSize: 14, color: "var(--good)" }}>✓ coded</span>}
          </div>
          <div className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>pt_code {top.code}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".10em", textTransform: "uppercase" }}>
            Ranking index
          </span>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--cream-2)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: s.reviewerSelected ? "100%" : `${Math.round(top.confidence * 100)}%`,
                background: s.reviewerSelected ? "var(--rust)" : "var(--good)",
                transition: "width .25s ease",
              }}
            />
          </div>
          <span className="mono" style={{ fontSize: 14, color: s.reviewerSelected ? "var(--rust)" : "var(--good)", fontWeight: 700 }}>
            {s.reviewerSelected ? "reviewer-selected" : top.confidence.toFixed(2)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-2)", fontStyle: "italic", marginTop: 10 }}>
          “{top.rationale}”
        </div>

        {s.status === "open" && s.mode === "view" && (
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            {btn("Accept", () => dispatch({ type: "accept" }), true)}
            {btn("Correct…", () => dispatch({ type: "enter-correct" }))}
            {btn("Reject", () => dispatch({ type: "reject" }), false, s.candidates.length <= 1)}
          </div>
        )}
        {s.mode === "correct" && (
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            {btn("Confirm", () => dispatch({ type: "confirm-correct" }), true, s.selectedAlt == null)}
            {btn("Cancel", () => dispatch({ type: "cancel-correct" }))}
          </div>
        )}
        {s.status === "coded" && (
          <div style={{ marginTop: 10 }}>
            {btn("Reset", () => dispatch({ type: "reset", c }))}
          </div>
        )}
      </div>

      {/* Alternatives */}
      <div>
        <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
          {s.mode === "correct" ? "Pick the correct PT" : `Alternatives (${alts.length})`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {alts.map((alt, i) => {
            const selected = s.mode === "correct" && s.selectedAlt === i;
            return (
              <div
                key={alt.code}
                onClick={() => s.mode === "correct" && dispatch({ type: "select-alt", idx: i })}
                style={{
                  padding: "7px 12px",
                  background: selected ? "oklch(96% .025 60)" : "var(--cream-2)",
                  border: `1px solid ${selected ? "var(--terracotta-2)" : "var(--line)"}`,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  cursor: s.mode === "correct" ? "pointer" : "default",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {s.mode === "correct" && (
                    <span
                      style={{
                        width: 12, height: 12, borderRadius: "50%",
                        border: `2px solid ${selected ? "var(--terracotta-2)" : "var(--muted)"}`,
                        background: selected ? "var(--terracotta-2)" : "transparent",
                      }}
                    />
                  )}
                  <span style={{ fontSize: 15, color: "var(--ink)" }}>{alt.pt}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{alt.code}</span>
                </div>
                <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{alt.confidence.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom label */}
      <div
        style={{
          marginTop: 4,
          padding: "10px 14px",
          background: kind === "hard" ? "oklch(95% .04 60)" : "var(--cream-2)",
          border: `1px dashed ${kind === "hard" ? "var(--rust)" : "var(--line)"}`,
          borderRadius: 8,
          fontSize: 14,
          color: kind === "hard" ? "var(--rust)" : "var(--ink-2)",
          fontFamily: "JetBrains Mono, monospace",
          letterSpacing: ".04em",
          textAlign: "center",
        }}
      >
        {c.bottomLabel}
      </div>
    </div>
  );
}

export function ReviewerApp() {
  return (
    <section className="slide" data-screen-label="09 App demo">
      <div className="hdr">
        <div className="mark">
          <svg width="22" height="22" style={{ color: "var(--ink)" }}>
            <use href="#logo-shield" />
          </svg>
          <span className="name">Reviewer screen</span>
        </div>
        <div className="pg">09 / 11</div>
      </div>

      <div style={{ marginTop: 50 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Demo · interactive</div>
        <h2 className="section">
          <em>SentinelAI</em> in the reviewer's hands.
        </h2>
      </div>

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        <CasePanel c={EASY} kind="easy" />
        <CasePanel c={HARD} kind="hard" />
      </div>

      <div style={{ marginTop: 28, textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 22, color: "var(--ink)", fontStyle: "italic", fontWeight: 500 }}>
          Same pipeline handles both. Ranking index calibrates to difficulty.
        </div>
      </div>

      <div className="ftr">
        <div>PM Meeting</div>
        <div className="rule" />
        <div>App demo</div>
      </div>
    </section>
  );
}
