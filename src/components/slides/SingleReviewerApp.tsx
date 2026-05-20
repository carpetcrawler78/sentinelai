import { useReducer } from "react";

/* Slide 10 — Live demo app: rich reviewer screen (single case),
 * interactive Accept / Correct / Reject + Next case. */

type Candidate = { pt: string; code: string; soc?: string; confidence: number; rationale: string };
type Case = {
  id: string;
  deviceClass: string;
  device: string;
  productCode: string;
  eventDate: string;
  received: string;
  narrative: string;
  candidates: Candidate[];
};

const CASES: Case[] = [
  {
    id: "M-2026-1187",
    deviceClass: "device class IIb",
    device: "Acme Insulin Pump XR-100",
    productCode: "LZG",
    eventDate: "2024-11-08",
    received: "2024-11-14",
    narrative:
      "Patient using Acme Insulin Pump (XR-100) experienced unexpected battery depletion during overnight basal delivery. Pump alarm did not sound. Patient woke with severe hyperglycaemia (BG 480 mg/dL); hospitalized for 36h.",
    candidates: [
      { pt: "Hyperglycaemia", code: "10020639", soc: "Metabolism & nutrition", confidence: 0.83, rationale: "Severe BG 480 mg/dL with hospitalization indicates acute hyperglycaemia as the primary event." },
      { pt: "Diabetic ketoacidosis", code: "10012671", confidence: 0.41, rationale: "Possible secondary decompensation, not confirmed." },
      { pt: "Device malfunction", code: "10013636", confidence: 0.34, rationale: "Pump-side failure, but PMS rules favour the clinical PT." },
      { pt: "Battery issue", code: "10004734", confidence: 0.29, rationale: "Root cause, not the patient-facing adverse event." },
      { pt: "Blood glucose increased", code: "10005557", confidence: 0.22, rationale: "Lab-only PT; less specific given hospitalization." },
    ],
  },
  {
    id: "M-2026-2041",
    deviceClass: "device class IIb",
    device: "Acme CGM Sensor G7",
    productCode: "NBW",
    eventDate: "2025-01-22",
    received: "2025-01-25",
    narrative:
      "Patient woke confused, trembling. CGM read 34 mg/dL at 03:00. Device had not alarmed. Emergency glucose administered by paramedics.",
    candidates: [
      { pt: "Hypoglycaemia", code: "10020993", soc: "Metabolism & nutrition", confidence: 0.71, rationale: "BG 34 mg/dL + confusion + glucose rescue = textbook hypoglycaemia. Term never appears verbatim." },
      { pt: "Blood glucose decreased", code: "10005555", confidence: 0.52, rationale: "Lab-only PT; less specific given the clinical syndrome." },
      { pt: "Loss of consciousness", code: "10024855", confidence: 0.38, rationale: "Confusion noted, not LOC; weaker fit." },
      { pt: "Device alarm failure", code: "10063269", confidence: 0.31, rationale: "Concurrent device issue, secondary to the patient event." },
      { pt: "Mental status changes", code: "10048294", confidence: 0.24, rationale: "Symptom-level term; superseded by clinical syndrome." },
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
  reviewerSelected: boolean;
  queue: number;
};

const init = (caseIdx = 0, queue = 47): State => ({
  caseIdx,
  candidates: CASES[caseIdx].candidates,
  status: "open",
  mode: "view",
  selectedAlt: null,
  reviewerSelected: false,
  queue,
});

type Action =
  | { type: "accept" }
  | { type: "reject" }
  | { type: "enter-correct" }
  | { type: "cancel-correct" }
  | { type: "select-alt"; idx: number }
  | { type: "confirm-correct" }
  | { type: "next" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "accept":
      return { ...s, status: "coded" };
    case "reject":
      return { ...s, status: "rejected" };
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
      return { ...s, candidates: newOrder, mode: "view", selectedAlt: null, reviewerSelected: true, status: "coded" };
    }
    case "next": {
      const nextIdx = (s.caseIdx + 1) % CASES.length;
      return init(nextIdx, Math.max(0, s.queue - 1));
    }
  }
}

export function SingleReviewerApp() {
  const [s, dispatch] = useReducer(reducer, undefined, () => init());
  const c = CASES[s.caseIdx];
  const top = s.candidates[0];
  const alts = s.candidates.slice(1);

  const statusColor = s.status === "coded" ? "var(--good)" : s.status === "rejected" ? "var(--rust)" : "var(--good)";
  const statusLabel =
    s.status === "coded"
      ? s.reviewerSelected
        ? "Coded · reviewer-corrected"
        : "Coded · accepted"
      : s.status === "rejected"
      ? "Rejected · routed to manual queue"
      : "Audit log writing";

  const btn = (label: string, onClick: () => void, opts: { primary?: boolean; disabled?: boolean } = {}) => (
    <button
      onClick={onClick}
      disabled={opts.disabled}
      style={{
        fontSize: 14,
        padding: "7px 16px",
        border: `1.5px solid ${opts.primary ? "var(--terracotta-2)" : "var(--line)"}`,
        background: opts.primary ? "var(--terracotta-2)" : "var(--cream)",
        color: opts.primary ? "var(--cream)" : "var(--ink-2)",
        borderRadius: 6,
        fontWeight: opts.primary ? 600 : 500,
        cursor: opts.disabled ? "not-allowed" : "pointer",
        opacity: opts.disabled ? 0.5 : 1,
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );

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
          <em>SentinelAI</em> in the reviewer's hands.
        </h2>
      </div>

      {/* App mock */}
      <div
        style={{
          marginTop: 36,
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
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          {/* LEFT */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="serif" style={{ fontSize: 24, color: "var(--ink)", fontWeight: 600 }}>Case {c.id}</div>
              <span className="tag" style={{ fontSize: 12 }}>{c.deviceClass}</span>
            </div>

            <div
              className="mono"
              style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6, letterSpacing: ".08em", textTransform: "uppercase" }}
            >
              MAUDE narrative
            </div>
            <div className="case" style={{ padding: "18px 22px", borderLeftWidth: 4 }}>
              <blockquote style={{ fontSize: 20, lineHeight: 1.4, margin: 0 }}>{c.narrative}</blockquote>
            </div>

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 18px", fontSize: 16 }}>
              <div className="mono" style={{ color: "var(--muted)" }}>device</div><div>{c.device}</div>
              <div className="mono" style={{ color: "var(--muted)" }}>product_code</div><div>{c.productCode}</div>
              <div className="mono" style={{ color: "var(--muted)" }}>event_date</div><div>{c.eventDate}</div>
              <div className="mono" style={{ color: "var(--muted)" }}>received</div><div>{c.received}</div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
              <div className="serif" style={{ fontSize: 24, color: "var(--ink)", fontWeight: 600 }}>SentinelAI suggestions</div>
              <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>model llama3.2:3b · v2026-05-14</span>
            </div>

            {/* Top candidate */}
            <div
              style={{
                border: "2px solid var(--terracotta-2)",
                background:
                  s.status === "coded" ? "oklch(95% .035 145)" : s.status === "rejected" ? "oklch(95% .025 30)" : "oklch(96% .025 60)",
                borderRadius: 10,
                padding: "14px 18px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                <div>
                  <div style={{ fontFamily: "Newsreader, serif", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
                    {top.pt}
                    {s.status === "coded" && <span style={{ marginLeft: 10, fontSize: 14, color: "var(--good)" }}>✓ coded</span>}
                    {s.status === "rejected" && <span style={{ marginLeft: 10, fontSize: 14, color: "var(--rust)" }}>✕ rejected</span>}
                  </div>
                  <div className="mono" style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                    pt_code {top.code}{top.soc ? ` · SOC: ${top.soc}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 140 }}>
                  <div className="mono" style={{ fontSize: 13, color: s.reviewerSelected ? "var(--rust)" : "var(--good)", fontWeight: 700 }}>
                    {s.reviewerSelected ? "reviewer-selected" : `${top.confidence.toFixed(2)} confidence`}
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--cream-2)", overflow: "hidden", marginTop: 4 }}>
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
              <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 10, fontStyle: "italic" }}>
                “{top.rationale}”
              </div>

              {s.status === "open" && s.mode === "view" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  {btn("Accept", () => dispatch({ type: "accept" }), { primary: true })}
                  {btn("Correct…", () => dispatch({ type: "enter-correct" }))}
                  {btn("Reject", () => dispatch({ type: "reject" }))}
                </div>
              )}
              {s.mode === "correct" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  {btn("Confirm correction", () => dispatch({ type: "confirm-correct" }), {
                    primary: true,
                    disabled: s.selectedAlt == null,
                  })}
                  {btn("Cancel", () => dispatch({ type: "cancel-correct" }))}
                </div>
              )}
              {(s.status === "coded" || s.status === "rejected") && (
                <div style={{ marginTop: 12 }}>
                  {btn("Next case →", () => dispatch({ type: "next" }), { primary: true })}
                </div>
              )}
            </div>

            {/* Alternatives */}
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--muted)", margin: "14px 0 6px 0", letterSpacing: ".10em", textTransform: "uppercase" }}
            >
              {s.mode === "correct" ? "Pick the correct PT" : `Alternatives (top ${alts.length})`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {alts.map((alt, i) => {
                const selected = s.mode === "correct" && s.selectedAlt === i;
                return (
                  <div
                    key={alt.code}
                    onClick={() => s.mode === "correct" && dispatch({ type: "select-alt", idx: i })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 14px",
                      background: selected ? "oklch(96% .025 60)" : "var(--cream-2)",
                      border: `1px solid ${selected ? "var(--terracotta-2)" : "var(--line)"}`,
                      borderRadius: 8,
                      cursor: s.mode === "correct" ? "pointer" : "default",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {s.mode === "correct" && (
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            border: `2px solid ${selected ? "var(--terracotta-2)" : "var(--muted)"}`,
                            background: selected ? "var(--terracotta-2)" : "transparent",
                          }}
                        />
                      )}
                      <span style={{ fontSize: 16, color: "var(--ink)" }}>{alt.pt}</span>
                      <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{alt.code}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{alt.confidence.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 6px 0 6px", fontSize: 13 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: statusColor }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor }} />
              {statusLabel}
            </span>
            <span className="mono" style={{ color: "var(--muted)" }}>ts_in 14:32:08 · latency 1.4s</span>
          </div>
          <div className="mono" style={{ color: "var(--muted)" }}>SentinelAI v0.4.2 · Hetzner FRA</div>
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
