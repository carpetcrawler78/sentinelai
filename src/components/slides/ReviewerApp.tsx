import { useReducer } from "react";

/* =====================================================================
 * Slide 9 — Interactive reviewer screen
 * Mirrors the original mock visually but is fully clickable:
 *  - Accept   → suggestion locks, audit log entry appears, queue --
 *  - Correct  → alternatives become selectable, Confirm promotes choice
 *  - Reject   → top suggestion is dropped, next alternative promotes up
 *  - Click an alternative outside Correct mode → expands rationale
 *  - Next case → loads the next prepared case
 * ===================================================================*/

type Candidate = {
  pt: string;
  code: string;
  soc: string;
  confidence: number; // 0..1
  rationale: string;
};

type Case = {
  id: string;
  deviceClass: string;
  narrative: string;
  device: string;
  productCode: string;
  eventDate: string;
  received: string;
  candidates: Candidate[];
};

const CASES: Case[] = [
  {
    id: "M-2026-1187",
    deviceClass: "device class IIb",
    narrative:
      "Patient using Acme Insulin Pump (XR-100) experienced unexpected battery depletion during overnight basal delivery. Pump alarm did not sound. Patient woke with severe hyperglycaemia (BG 480 mg/dL); hospitalized for 36h.",
    device: "Acme Insulin Pump XR-100",
    productCode: "LZG",
    eventDate: "2024-11-08",
    received: "2024-11-14",
    candidates: [
      {
        pt: "Hyperglycaemia",
        code: "10020639",
        soc: "Metabolism & nutrition",
        confidence: 0.83,
        rationale:
          "Severe BG 480 mg/dL with hospitalization indicates acute hyperglycaemia as the primary event.",
      },
      {
        pt: "Diabetic ketoacidosis",
        code: "10012671",
        soc: "Metabolism & nutrition",
        confidence: 0.41,
        rationale: "Possible secondary metabolic decompensation, not confirmed in narrative.",
      },
      {
        pt: "Device malfunction",
        code: "10013636",
        soc: "General disorders",
        confidence: 0.34,
        rationale: "Pump-side failure, but PMS rules favour the clinical event PT here.",
      },
      {
        pt: "Battery issue",
        code: "10004734",
        soc: "Product issues",
        confidence: 0.29,
        rationale: "Underlying root cause but not the patient-facing adverse event.",
      },
      {
        pt: "Blood glucose increased",
        code: "10005557",
        soc: "Investigations",
        confidence: 0.22,
        rationale: "Lab-only PT; less specific than Hyperglycaemia given hospitalization.",
      },
    ],
  },
  {
    id: "M-2026-1188",
    deviceClass: "device class III",
    narrative:
      "Patient with implanted ICD (Vector-9) reported two inappropriate shocks within 30 minutes during normal sinus rhythm. Device interrogation showed lead noise on RV channel. No patient injury; admitted overnight for observation.",
    device: "Vector-9 ICD",
    productCode: "LWS",
    eventDate: "2025-02-03",
    received: "2025-02-05",
    candidates: [
      {
        pt: "Inappropriate shock delivered by device",
        code: "10078902",
        soc: "Cardiac disorders",
        confidence: 0.79,
        rationale: "Two confirmed inappropriate shocks during NSR is the clinical event.",
      },
      {
        pt: "Lead dislodgement",
        code: "10052010",
        soc: "Product issues",
        confidence: 0.44,
        rationale: "Lead noise suggests connection issue but dislodgement not confirmed.",
      },
      {
        pt: "Device malfunction",
        code: "10013636",
        soc: "General disorders",
        confidence: 0.31,
        rationale: "Generic fallback; the more specific PT is preferred.",
      },
      {
        pt: "Cardiac arrhythmia",
        code: "10007515",
        soc: "Cardiac disorders",
        confidence: 0.18,
        rationale: "Underlying condition, not the reported adverse event.",
      },
    ],
  },
];

type Status = "open" | "coded" | "rejected";
type Mode = "view" | "correct";

type State = {
  caseIdx: number;
  candidates: Candidate[];
  status: Status;
  mode: Mode;
  selectedAlt: number | null;
  expandedAlt: number | null;
  finalPt: string | null;
  reviewerSelected: boolean;
  queue: number;
  log: string[];
};

const initialFor = (caseIdx: number, queue: number): State => ({
  caseIdx,
  candidates: CASES[caseIdx].candidates,
  status: "open",
  mode: "view",
  selectedAlt: null,
  expandedAlt: null,
  finalPt: null,
  reviewerSelected: false,
  queue,
  log: [],
});

type Action =
  | { type: "accept" }
  | { type: "reject" }
  | { type: "enter-correct" }
  | { type: "cancel-correct" }
  | { type: "select-alt"; idx: number }
  | { type: "confirm-correct" }
  | { type: "toggle-expand"; idx: number }
  | { type: "next-case" };

function reducer(s: State, a: Action): State {
  const nowTs = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
  switch (a.type) {
    case "accept": {
      const top = s.candidates[0];
      return {
        ...s,
        status: "coded",
        finalPt: top.pt,
        log: [
          `${nowTs()} · accepted ${top.pt} (${top.code}) · conf ${top.confidence.toFixed(2)}`,
          ...s.log,
        ],
        queue: Math.max(0, s.queue - 1),
      };
    }
    case "reject": {
      if (s.candidates.length <= 1) return s;
      const dropped = s.candidates[0];
      const rest = s.candidates.slice(1);
      return {
        ...s,
        candidates: rest,
        log: [`${nowTs()} · rejected ${dropped.pt}`, ...s.log],
        expandedAlt: null,
      };
    }
    case "enter-correct":
      return { ...s, mode: "correct", selectedAlt: null, expandedAlt: null };
    case "cancel-correct":
      return { ...s, mode: "view", selectedAlt: null };
    case "select-alt":
      return { ...s, selectedAlt: a.idx };
    case "confirm-correct": {
      if (s.selectedAlt == null) return s;
      const altIdx = s.selectedAlt + 1; // alternatives are after top
      const chosen = s.candidates[altIdx];
      const newOrder = [chosen, ...s.candidates.filter((_, i) => i !== altIdx)];
      return {
        ...s,
        candidates: newOrder,
        mode: "view",
        selectedAlt: null,
        reviewerSelected: true,
        log: [`${nowTs()} · corrected → ${chosen.pt} (${chosen.code})`, ...s.log],
      };
    }
    case "toggle-expand":
      return { ...s, expandedAlt: s.expandedAlt === a.idx ? null : a.idx };
    case "next-case": {
      const next = (s.caseIdx + 1) % CASES.length;
      return initialFor(next, Math.max(0, s.queue - (s.status === "coded" ? 0 : 1)));
    }
  }
}

export function ReviewerApp() {
  const [s, dispatch] = useReducer(reducer, initialFor(0, 47));
  const c = CASES[s.caseIdx];
  const top = s.candidates[0];
  const alts = s.candidates.slice(1);

  return (
    <section className="slide" data-screen-label="09 App demo">
      <div className="hdr">
        <div className="mark">
          <svg width="22" height="22" style={{ color: "var(--ink)" }}>
            <use href="#logo-shield" />
          </svg>
          <span className="name">Reviewer screen</span>
        </div>
        <div className="pg">09 / 10</div>
      </div>

      <div style={{ marginTop: 60 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          Demo · interactive
        </div>
        <h2 className="section">
          <em>SentinelAI</em> in the reviewer's hands.
        </h2>
      </div>

      {/* App mock */}
      <div
        style={{
          marginTop: 32,
          background: "oklch(95% .010 75)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 14,
          boxShadow: "0 24px 60px -30px oklch(30% .03 60 / .25)",
        }}
      >
        {/* Browser chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px 12px 6px" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(70% .14 30)" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(85% .14 90)" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "oklch(70% .12 145)" }} />
          </div>
          <div
            className="mono"
            style={{
              fontSize: 13,
              color: "var(--muted)",
              padding: "5px 14px",
              background: "var(--cream)",
              borderRadius: 6,
              flex: 1,
              maxWidth: 600,
            }}
          >
            sentinelai.local · review · {c.id}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span className="tag" style={{ fontSize: 11, padding: "2px 8px" }}>queue: {s.queue}</span>
            <span className="tag" style={{ fontSize: 11, padding: "2px 8px" }}>reviewer: th</span>
          </div>
        </div>

        {/* App body */}
        <div
          style={{
            background: "var(--cream)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: 22,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 26,
            alignItems: "start",
          }}
        >
          {/* LEFT: narrative */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="serif" style={{ fontSize: 24, color: "var(--ink)", fontWeight: 600 }}>
                Case {c.id}
              </div>
              <span className="tag" style={{ fontSize: 12 }}>{c.deviceClass}</span>
            </div>

            <div
              className="mono"
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 6,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              MAUDE narrative
            </div>
            <div className="case" style={{ padding: "16px 22px", borderLeftWidth: 4 }}>
              <blockquote style={{ fontSize: 20, lineHeight: 1.4, margin: 0 }}>{c.narrative}</blockquote>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "6px 18px",
                fontSize: 16,
              }}
            >
              <div className="mono" style={{ color: "var(--muted)" }}>device</div>
              <div>{c.device}</div>
              <div className="mono" style={{ color: "var(--muted)" }}>product_code</div>
              <div>{c.productCode}</div>
              <div className="mono" style={{ color: "var(--muted)" }}>event_date</div>
              <div>{c.eventDate}</div>
              <div className="mono" style={{ color: "var(--muted)" }}>received</div>
              <div>{c.received}</div>
            </div>
          </div>

          {/* RIGHT: suggestions */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="serif" style={{ fontSize: 24, color: "var(--ink)", fontWeight: 600 }}>
                SentinelAI suggestions
              </div>
              <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>
                model llama3.2:3b · v2026-05-14
              </span>
            </div>

            {/* Top candidate */}
            <div
              style={{
                border: "2px solid var(--terracotta-2)",
                background: s.status === "coded" ? "oklch(95% .035 145)" : "oklch(96% .025 60)",
                borderRadius: 10,
                padding: "14px 18px",
                position: "relative",
                transition: "background .2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                <div>
                  <div style={{ fontFamily: "Newsreader, serif", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
                    {top.pt}
                    {s.status === "coded" && (
                      <span style={{ marginLeft: 10, fontSize: 16, color: "var(--good)" }}>✓ coded</span>
                    )}
                  </div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                    pt_code {top.code} · SOC: {top.soc}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 130 }}>
                  <div
                    className="mono"
                    style={{ fontSize: 13, color: s.reviewerSelected ? "var(--rust)" : "var(--good)", fontWeight: 700 }}
                  >
                    {s.reviewerSelected ? "reviewer-selected" : `${top.confidence.toFixed(2)} confidence`}
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: "var(--cream-2)",
                      overflow: "hidden",
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: s.reviewerSelected ? "100%" : `${Math.round(top.confidence * 100)}%`,
                        background: s.reviewerSelected ? "var(--rust)" : "var(--good)",
                        transition: "width .25s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--ink-2)",
                  marginTop: 10,
                  fontStyle: "italic",
                }}
              >
                “{top.rationale}”
              </div>

              {/* Action buttons */}
              {s.status === "open" && s.mode === "view" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className="rev-btn"
                    onClick={() => dispatch({ type: "accept" })}
                    style={{
                      fontSize: 14,
                      padding: "7px 16px",
                      border: "1.5px solid var(--terracotta-2)",
                      background: "var(--terracotta-2)",
                      color: "var(--cream)",
                      borderRadius: 6,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="rev-btn"
                    onClick={() => dispatch({ type: "enter-correct" })}
                    style={{
                      fontSize: 14,
                      padding: "7px 16px",
                      border: "1.5px solid var(--line)",
                      background: "var(--cream)",
                      color: "var(--ink-2)",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Correct…
                  </button>
                  <button
                    className="rev-btn"
                    onClick={() => dispatch({ type: "reject" })}
                    disabled={s.candidates.length <= 1}
                    style={{
                      fontSize: 14,
                      padding: "7px 16px",
                      border: "1.5px solid var(--line)",
                      background: "var(--cream)",
                      color: "var(--ink-2)",
                      borderRadius: 6,
                      cursor: s.candidates.length <= 1 ? "not-allowed" : "pointer",
                      opacity: s.candidates.length <= 1 ? 0.5 : 1,
                      fontFamily: "inherit",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {s.mode === "correct" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className="rev-btn"
                    onClick={() => dispatch({ type: "confirm-correct" })}
                    disabled={s.selectedAlt == null}
                    style={{
                      fontSize: 14,
                      padding: "7px 16px",
                      border: "1.5px solid var(--terracotta-2)",
                      background: s.selectedAlt == null ? "var(--cream-2)" : "var(--terracotta-2)",
                      color: s.selectedAlt == null ? "var(--muted)" : "var(--cream)",
                      borderRadius: 6,
                      fontWeight: 600,
                      cursor: s.selectedAlt == null ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="rev-btn"
                    onClick={() => dispatch({ type: "cancel-correct" })}
                    style={{
                      fontSize: 14,
                      padding: "7px 16px",
                      border: "1.5px solid var(--line)",
                      background: "var(--cream)",
                      color: "var(--ink-2)",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Alternatives */}
            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--muted)",
                margin: "14px 0 6px 0",
                letterSpacing: ".10em",
                textTransform: "uppercase",
              }}
            >
              {s.mode === "correct" ? "Pick the correct PT" : `Alternatives (top ${alts.length})`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {alts.map((alt, i) => {
                const selected = s.mode === "correct" && s.selectedAlt === i;
                const expanded = s.mode === "view" && s.expandedAlt === i;
                return (
                  <div
                    key={alt.code}
                    className={`rev-alt ${selected ? "selected" : ""}`}
                    onClick={() =>
                      s.mode === "correct"
                        ? dispatch({ type: "select-alt", idx: i })
                        : dispatch({ type: "toggle-expand", idx: i })
                    }
                    style={{
                      padding: "8px 14px",
                      background: "var(--cream-2)",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {s.mode === "correct" && (
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              border: `2px solid ${selected ? "var(--terracotta-2)" : "var(--muted)"}`,
                              background: selected ? "var(--terracotta-2)" : "transparent",
                              flex: "0 0 auto",
                            }}
                          />
                        )}
                        <span style={{ fontSize: 16, color: "var(--ink)" }}>{alt.pt}</span>
                        <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
                          {alt.code}
                        </span>
                      </div>
                      <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>
                        {alt.confidence.toFixed(2)}
                      </span>
                    </div>
                    {expanded && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--ink-2)",
                          fontStyle: "italic",
                          marginTop: 8,
                          paddingLeft: 2,
                        }}
                      >
                        “{alt.rationale}”
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 6px 0 6px",
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center", minWidth: 0, flex: 1 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--good)", flex: "0 0 auto" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)" }} />
              Audit log {s.log.length === 0 ? "writing" : `· ${s.log.length} entr${s.log.length === 1 ? "y" : "ies"}`}
            </span>
            <span
              className="mono"
              style={{
                color: "var(--muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {s.log[0] ?? "ts_in 14:32:08 · latency 1.4s"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "0 0 auto" }}>
            <button
              className="rev-btn"
              onClick={() => dispatch({ type: "next-case" })}
              style={{
                fontSize: 12,
                padding: "5px 12px",
                border: "1px solid var(--line)",
                background: "var(--cream)",
                color: "var(--ink-2)",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Next case →
            </button>
            <span className="mono" style={{ color: "var(--muted)" }}>SentinelAI v0.4.2 · Hetzner FRA</span>
          </div>
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
