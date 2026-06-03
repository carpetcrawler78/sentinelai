export function ThankYouSlide() {
  // Static snapshot of the reviewer UI -- faded background layer
  // No interactivity needed; this is the closing slide.
  return (
    <section
      className="slide"
      data-screen-label="14 Thank you"
      style={{ display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
    >
      {/* Reviewer UI -- faded background */}
      <div style={{ opacity: 0.45, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", pointerEvents: "none" }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Demo &middot; interactive</div>
        <h2 className="section" style={{ fontSize: 72 }}>
          How it looks for the <em>reviewer.</em>
        </h2>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Easy case", sub: "Term in text", active: true },
            { label: "Hard case", sub: "Term not in text", active: false },
            { label: "“I don’t know” case", sub: "Low ranking score", active: false },
          ].map(({ label, sub, active }) => (
            <div
              key={label}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: `2px solid ${active ? "var(--terracotta-2)" : "var(--line)"}`,
                background: active ? "var(--terracotta-2)" : "var(--cream)",
                color: active ? "var(--cream)" : "var(--ink)",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
                {label}
              </div>
              <div style={{ fontSize: 20, marginTop: 4, opacity: active ? 0.9 : 0.65, fontStyle: "italic" }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            background: "var(--cream)",
            border: "1.5px solid var(--ink)",
            borderRadius: 12,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: "var(--ink)",
              color: "var(--cream)",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 20,
              letterSpacing: ".05em",
            }}
          >
            <span>sentinelai.local &middot; review &middot; M-2026-1187</span>
            <span style={{ opacity: 0.7 }}>queue: 47 &nbsp;|&nbsp; reviewer: th</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 0, flex: 1 }}>
            <div style={{ padding: "12px 16px", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="mono" style={{ fontSize: 20, color: "var(--ink-2)", fontWeight: 600 }}>
                  case_id M-2026-1187
                </div>
                <span style={{ background: "var(--ink)", color: "var(--cream)", fontFamily: "JetBrains Mono, monospace", fontSize: 20, padding: "4px 12px", borderRadius: 4, letterSpacing: ".10em", fontWeight: 700 }}>
                  CLASS IIb
                </span>
              </div>
              <div className="mono" style={{ fontSize: 20, color: "var(--muted)", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600 }}>
                MAUDE narrative
              </div>
              <div style={{ border: "1px solid var(--line)", borderLeft: "3px solid var(--terracotta-2)", background: "var(--cream-2)", padding: "14px 18px", borderRadius: 6, fontFamily: "Newsreader, serif", fontSize: 20, fontStyle: "italic", color: "var(--ink)", lineHeight: 1.45 }}>
                Patient using Acme Insulin Pump (XR-100) experienced unexpected battery depletion during overnight basal delivery. Pump alarm did not sound. Patient woke with severe hyperglycaemia (BG 480 mg/dL); hospitalized for 36h.
              </div>
              <table className="mono" style={{ width: "100%", fontSize: 20, color: "var(--ink-2)", borderCollapse: "collapse", marginTop: 6 }}>
                <tbody>
                  {([["device", "Acme Insulin Pump XR-100"], ["product_code", "LZG"], ["event_date", "2024-11-08"], ["received", "2024-11-14"]] as const).map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ padding: "3px 12px 3px 0", color: "var(--muted)", width: 130, borderBottom: "1px dashed var(--line)" }}>{k}</td>
                      <td style={{ padding: "3px 0", borderBottom: "1px dashed var(--line)" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div className="mono" style={{ fontSize: 20, color: "var(--ink-2)", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700 }}>
                  SentinelAI suggestions
                </div>
                <div className="mono" style={{ fontSize: 20, color: "var(--muted)" }}>qwen2.5:7b + electra-base</div>
              </div>
              <div style={{ background: "oklch(96% .025 60)", border: "2px solid var(--terracotta-2)", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}>Hyperglycaemia</div>
                    <div className="mono" style={{ fontSize: 20, color: "var(--muted)", marginTop: 4 }}>pt_code 10020639 &middot; SOC Metabolism &amp; nutrition</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="mono" style={{ fontSize: 20, color: "var(--muted)", letterSpacing: ".10em", textTransform: "uppercase" }}>ranking</div>
                    <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--good)", lineHeight: 1 }}>0.83</div>
                  </div>
                </div>
                <div style={{ fontSize: 20, color: "var(--ink-2)", fontStyle: "italic", marginTop: 10, lineHeight: 1.4 }}>
                  &ldquo;Severe BG 480 mg/dL with hospitalization indicates acute hyperglycaemia as the primary event.&rdquo;
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  {["Accept", "Correct…", "Reject"].map((label) => (
                    <div key={label} style={{ fontSize: 20, padding: "7px 14px", border: "1.5px solid var(--line)", background: "var(--cream)", color: "var(--ink-2)", borderRadius: 6, fontWeight: 500 }}>{label}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 20, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Alternatives</div>
                {[
                  { pt: "Diabetic ketoacidosis", code: "10012671", score: "0.41" },
                  { pt: "Device malfunction", code: "10013636", score: "0.34" },
                  { pt: "Blood glucose increased", code: "10005557", score: "0.29" },
                ].map((a) => (
                  <div key={a.code} style={{ padding: "8px 12px", background: "var(--cream-2)", border: "1px solid var(--line)", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, opacity: 0.55, marginBottom: 5 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                      <span style={{ fontSize: 20, color: "var(--ink)" }}>{a.pt}</span>
                      <span className="mono" style={{ fontSize: 20, color: "var(--muted)" }}>{a.code}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 20, color: "var(--muted)", flexShrink: 0 }}>{a.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--line)", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "JetBrains Mono, monospace", fontSize: 20, color: "var(--muted)", background: "var(--cream-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)" }} />
                Audit log writing
              </span>
              <span>ts_in 14:32:08</span>
              <span>latency 1.4s</span>
            </div>
            <div>SentinelAI v0.4.2 &middot; Hetzner FRA</div>
          </div>
        </div>
      </div>

      {/* Thank you overlay -- front layer, two-column: text left / QR right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 64,
            background: "oklch(98% .015 60 / 0.88)",
            border: "1.5px solid var(--line)",
            borderRadius: 24,
            padding: "56px 72px",
          }}
        >
          {/* Left column: text */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 22,
                letterSpacing: ".20em",
                textTransform: "uppercase",
                color: "var(--terracotta-2)",
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              SentinelAI
            </div>
            <div
              style={{
                fontFamily: "Newsreader, serif",
                fontSize: 96,
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Thank you.
            </div>
            <div
              style={{
                marginTop: 32,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 24,
                color: "var(--muted)",
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              Questions?
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)", opacity: 0.6 }} />

          {/* Right column: QR code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <img
              src="/qrcode_github.com.png"
              alt="QR code for project page"
              style={{
                width: 260,
                height: 260,
                borderRadius: 10,
                border: "1.5px solid var(--line)",
                background: "white",
                padding: 6,
              }}
            />
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 21,
                  color: "var(--ink-2)",
                  fontWeight: 700,
                  letterSpacing: ".06em",
                }}
              >
                Project page
              </div>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 19,
                  color: "var(--muted)",
                  letterSpacing: ".02em",
                  marginTop: 4,
                }}
              >
                github.com/carpetcrawler78/sentinelai
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
