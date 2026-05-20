import { CasePanel, HARD_CASE } from "./ReviewerApp";

/* Slide 10 — single Live App: focused reviewer screen, hard case */

export function SingleReviewerApp() {
  return (
    <section className="slide" data-screen-label="10 Live app">
      <div className="hdr">
        <div className="mark">
          <svg width="22" height="22" style={{ color: "var(--ink)" }}>
            <use href="#logo-shield" />
          </svg>
          <span className="name">Reviewer screen · live</span>
        </div>
        <div className="pg">10 / 12</div>
      </div>

      <div style={{ marginTop: 50 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Live · interactive</div>
        <h2 className="section">
          One case, <em>end-to-end</em>.
        </h2>
      </div>

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "minmax(0, 980px)",
          justifyContent: "center",
        }}
      >
        <CasePanel c={HARD_CASE} kind="hard" />
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 20, color: "var(--ink-2)", fontStyle: "italic" }}>
          Accept · Correct · Reject — every action writes to the audit log.
        </div>
      </div>

      <div className="ftr">
        <div>PM Meeting</div>
        <div className="rule" />
        <div>Live app</div>
      </div>
    </section>
  );
}
