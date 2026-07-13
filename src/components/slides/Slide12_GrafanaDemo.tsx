import { useState, useEffect } from "react";

const GRAFANA_URL =
  "http://localhost:3000/d/sentinelai-coding-v1/sentinelai-coding?orgId=1&theme=dark&kiosk&refresh=30s&from=now-14d&to=now";

export function GrafanaSlide() {
  const [live, setLive] = useState(false);
  const [manual, setManual] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const r = await fetch("http://localhost:8000/health", {
          signal: AbortSignal.timeout(3000),
        });
        if (!cancelled && manual === null) setLive(r.ok);
      } catch {
        if (!cancelled && manual === null) setLive(false);
      }
    };
    void check();
    const id = setInterval(() => void check(), 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [manual]);

  const showing = manual !== null ? manual : live;

  return (
    <section className="slide" data-screen-label="12 Ops Monitor"
      style={{ display: "flex", flexDirection: "column" }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>Operations</div>
      <h2 className="section" style={{ fontSize: 72 }}>
        Pipeline monitoring &mdash; <em>live.</em>
      </h2>

      <div style={{
        flex: 1, minHeight: 0, marginTop: 20,
        borderRadius: 12, overflow: "hidden",
        border: "1px solid var(--line)", position: "relative",
      }}>
        {showing ? (
          <iframe
            src={GRAFANA_URL}
            style={{
              // ZOOM-Knopf: SCALE kleiner = mehr passt rein (Text wird kleiner).
              // 0.8 zeigt ~25% mehr; fuer noch kleiner 0.7 + width/height 143%.
              width: "125%", height: "125%",
              transform: "scale(0.8)", transformOrigin: "top left",
              border: "none",
            }}
            title="SentinelAI Grafana Dashboard"
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#111", flexDirection: "column", gap: 20,
          }}>
            <img
              src="/grafana_dashboard_screenshot.png"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              alt="Grafana Dashboard"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 20,
              color: "#555", letterSpacing: ".12em", textTransform: "uppercase",
              textAlign: "center", lineHeight: 2,
            }}>
              Static screenshot<br />
              <span style={{ fontSize: 14, color: "#444" }}>
                live backend offline -- see README for details
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setManual(showing ? false : true)}
          style={{
            position: "absolute", bottom: 10, right: 12,
            background: "rgba(0,0,0,0.55)", color: "#ccc",
            border: "1px solid #555", borderRadius: 6,
            padding: "4px 10px", fontSize: 11,
            fontFamily: "JetBrains Mono, monospace",
            cursor: "pointer", letterSpacing: ".06em", zIndex: 10,
          }}
        >
          {showing ? "show screenshot" : "show live"}
        </button>
      </div>

      {/* Engineering strip -- Ops */}
      <div style={{ textAlign: "center", marginTop: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "var(--muted)", letterSpacing: ".04em" }}>
        Dockerized service stack &nbsp;&middot;&nbsp; FastAPI &nbsp;&middot;&nbsp; PostgreSQL &nbsp;&middot;&nbsp; Hetzner &nbsp;&middot;&nbsp; all local -- no external AI APIs
      </div>

    </section>
  );
}
