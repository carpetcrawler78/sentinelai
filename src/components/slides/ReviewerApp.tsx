import { useState } from "react";

type Alt = { pt: string; code: string; score: number };
type Case = {
  key: "easy" | "hard" | "idk";
  buttonLabel: string;
  buttonSub: string;
  case_id: string;
  device: string;
  device_class: string;
  product_code: string;
  event_date: string;
  received: string;
  narrative: string;
  top: { pt: string; code: string; soc: string; score: number; reason: string };
  alts: Alt[];
  ts_in: string;
  latency: string;
  lowConfidence?: boolean;
};

const CASES: Case[] = [
  {
    key: "easy",
    buttonLabel: "Easy case",
    buttonSub: "term in text",
    case_id: "M-2026-1187",
    device: "Acme Insulin Pump XR-100",
    device_class: "IIb",
    product_code: "LZG",
    event_date: "2024-11-08",
    received: "2024-11-14",
    narrative:
      "Patient using Acme Insulin Pump (XR-100) experienced unexpected battery depletion during overnight basal delivery. Pump alarm did not sound. Patient woke with severe hyperglycaemia (BG 480 mg/dL); hospitalized for 36h.",
    top: {
      pt: "Hyperglycaemia",
      code: "10020639",
      soc: "Metabolism & nutrition",
      score: 0.83,
      reason:
        "Severe BG 480 mg/dL with hospitalization indicates acute hyperglycaemia as the primary event.",
    },
    alts: [
      { pt: "Diabetic ketoacidosis", code: "10012671", score: 0.41 },
      { pt: "Device malfunction", code: "10013636", score: 0.34 },
      { pt: "Battery issue", code: "10004734", score: 0.29 },
      { pt: "Blood glucose increased", code: "10005557", score: 0.22 },
    ],
    ts_in: "14:32:08",
    latency: "1.4s",
  },
  {
    key: "hard",
    buttonLabel: "Hard case",
    buttonSub: "term not in text",
    case_id: "3011393376-2024-00990",
    device: "Acme Insulin Pump XR-100",
    device_class: "IIb",
    product_code: "LZG",
    event_date: "2024-09-03",
    received: "2024-09-10",
    narrative:
      "Patient reported device delivered an inaccurate amount of insulin during meal bolus. Elevated blood glucose above 300 mg/dL within two hours of dose. No alarm or error code displayed by the pump. Patient required correction bolus.",
    top: {
      pt: "Incorrect dose administered by device",
      code: "10080527",
      soc: "Injury, poisoning and procedural complications",
      score: 0.93,
      reason:
        "Narrative describes a dosing error attributable to the device, not user behavior; the elevated blood glucose is the downstream consequence. The MedDRA term itself is not present in the text — semantic reasoning required.",
    },
    alts: [
      { pt: "Hyperglycaemia", code: "10020639", score: 0.62 },
      { pt: "Device malfunction", code: "10013636", score: 0.48 },
      { pt: "Insulin overdose", code: "10022081", score: 0.27 },
      { pt: "Device alarm failure", code: "10063639", score: 0.19 },
    ],
    ts_in: "14:33:41",
    latency: "6.2s",
  },
  {
    key: "idk",
    buttonLabel: "“I don't know” case",
    buttonSub: "low ranking score",
    case_id: "M-2026-3022",
    device: "CGM Sensor MX",
    device_class: "IIb",
    product_code: "QFG",
    event_date: "2024-09-22",
    received: "2024-09-28",
    narrative:
      "Patient reported sensor 'felt off' since yesterday. Mild discomfort at insertion site. No specific symptoms otherwise. Sensor still attached and reading values.",
    top: {
      pt: "Application site discomfort",
      code: "10003041",
      soc: "General disorders and administration site conditions",
      score: 0.34,
      reason:
        "Narrative is too vague for confident assignment. Several plausible codes overlap; reviewer attention recommended.",
    },
    alts: [
      { pt: "Application site irritation", code: "10003046", score: 0.31 },
      { pt: "Device site reaction", code: "10063587", score: 0.27 },
      { pt: "Device malfunction", code: "10013636", score: 0.22 },
      { pt: "Pain", code: "10033371", score: 0.18 },
    ],
    ts_in: "14:35:02",
    latency: "1.1s",
    lowConfidence: true,
  },
];

export function ReviewerApp() {
  const [idx, setIdx] = useState(0);
  const c = CASES[idx];

  return (
    <section className="slide" data-screen-label="07 Reviewer demo" style={{ display: "flex", flexDirection: "column" }}>
      <div className="eyebrow" style={{ marginBottom: 18 }}>Demo · interactive</div>
      <h2 className="section" style={{ fontSize: 72 }}>
        How it looks for the <em>reviewer.</em>
      </h2>

      {/* Case switcher buttons */}
      <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {CASES.map((cc, i) => {
          const active = i === idx;
          return (
            <button
              key={cc.key}
              onClick={() => setIdx(i)}
              style={{
                padding: "16px 20px",
                borderRadius: 10,
                border: `2px solid ${active ? "var(--terracotta-2)" : "var(--line)"}`,
                background: active ? "var(--terracotta-2)" : "var(--cream)",
                color: active ? "var(--cream)" : "var(--ink)",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all .15s ease",
              }}
            >
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
                {cc.buttonLabel}
              </div>
              <div style={{ fontSize: 14, marginTop: 4, opacity: active ? 0.9 : 0.65, fontStyle: "italic" }}>
                {cc.buttonSub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Reviewer UI */}
      <div
        style={{
          marginTop: 22,
          background: "var(--cream)",
          border: "1.5px solid var(--ink)",
          borderRadius: 12,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "var(--ink)",
            color: "var(--cream)",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 14,
            letterSpacing: ".05em",
          }}
        >
          <span>sentinelai.local &middot; review &middot; {c.case_id}</span>
          <span style={{ opacity: 0.7 }}>queue: 47 &nbsp;|&nbsp; reviewer: th</span>
        </div>

        {/* Main two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 0, flex: 1 }}>
          {/* LEFT */}
          <div style={{ padding: "20px 24px", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="mono" style={{ fontSize: 14, color: "var(--ink-2)", fontWeight: 600 }}>
                case_id {c.case_id}
              </div>
              <span
                style={{
                  background: "var(--ink)",
                  color: "var(--cream)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 4,
                  letterSpacing: ".10em",
                  fontWeight: 700,
                }}
              >
                CLASS {c.device_class}
              </span>
            </div>

            <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600 }}>
              MAUDE narrative
            </div>
            <div
              style={{
                border: "1px solid var(--line)",
                borderLeft: "3px solid var(--terracotta-2)",
                background: "var(--cream-2)",
                padding: "14px 18px",
                borderRadius: 6,
                fontFamily: "Newsreader, serif",
                fontSize: 17,
                fontStyle: "italic",
                color: "var(--ink)",
                lineHeight: 1.45,
              }}
            >
              {c.narrative}
            </div>

            <table className="mono" style={{ width: "100%", fontSize: 13, color: "var(--ink-2)", borderCollapse: "collapse", marginTop: 6 }}>
              <tbody>
                {([
                  ["device", c.device],
                  ["product_code", c.product_code],
                  ["event_date", c.event_date],
                  ["received", c.received],
                ] as const).map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ padding: "5px 12px 5px 0", color: "var(--muted)", width: 130, borderBottom: "1px dashed var(--line)" }}>{k}</td>
                    <td style={{ padding: "5px 0", borderBottom: "1px dashed var(--line)" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT */}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div className="mono" style={{ fontSize: 14, color: "var(--ink-2)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700 }}>
                SentinelAI suggestions
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                model llama3.2:3b &middot; v2026-05-14
              </div>
            </div>

            {/* Top suggestion */}
            <div
              style={{
                background: c.lowConfidence ? "var(--warn-bg)" : "oklch(96% .025 60)",
                border: `2px solid ${c.lowConfidence ? "var(--warn)" : "var(--terracotta-2)"}`,
                borderRadius: 10,
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>{c.top.pt}</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    pt_code {c.top.code} &middot; SOC {c.top.soc}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".10em", textTransform: "uppercase" }}>ranking</div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: c.lowConfidence ? "var(--muted)" : "var(--good)",
                      lineHeight: 1,
                    }}
                  >
                    {c.top.score.toFixed(2)}
                  </div>
                  {c.lowConfidence && (
                    <div className="mono" style={{ fontSize: 9, color: "var(--warn)", marginTop: 4, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                      low confidence<br />reviewer required
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", fontStyle: "italic", marginTop: 10, lineHeight: 1.4 }}>
                “{c.top.reason}”
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button style={btn(true)}>Accept</button>
                <button style={btn(false)}>Correct…</button>
                <button style={btn(false)}>Reject</button>
              </div>
            </div>

            {/* Alternatives */}
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                Alternatives (top 4)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {c.alts.map((a) => (
                  <div
                    key={a.code}
                    style={{
                      padding: "7px 12px",
                      background: "var(--cream-2)",
                      border: "1px solid var(--line)",
                      borderRadius: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                      <span style={{ fontSize: 14, color: "var(--ink)" }}>{a.pt}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{a.code}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{a.score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 12,
            color: "var(--muted)",
            background: "var(--cream-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)" }} />
              Audit log writing
            </span>
            <span>ts_in {c.ts_in}</span>
            <span>latency {c.latency}</span>
            <button disabled style={{ ...btn(false), opacity: 0.4, cursor: "not-allowed", fontSize: 12, padding: "4px 10px" }}>
              Next case →
            </button>
          </div>
          <div>SentinelAI v0.4.2 &middot; Hetzner FRA</div>
        </div>
      </div>

      <div className="ftr">
        <div>Thomas Heger &nbsp;|&nbsp; Capstone II Midterm &nbsp;|&nbsp; 22 May 2026</div>
        <div className="rule" />
        <div style={{ color: "var(--terracotta-2)" }}>7 / 9</div>
      </div>
    </section>
  );
}

function btn(primary: boolean): React.CSSProperties {
  return {
    fontSize: 13,
    padding: "7px 14px",
    border: `1.5px solid ${primary ? "var(--terracotta-2)" : "var(--line)"}`,
    background: primary ? "var(--terracotta-2)" : "var(--cream)",
    color: primary ? "var(--cream)" : "var(--ink-2)",
    borderRadius: 6,
    fontWeight: primary ? 600 : 500,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}
