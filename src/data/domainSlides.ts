// Shared "domain flow" used by slide 2 and slide 3.
// Slide 2 = top flow only. Slide 3 = identical top flow + lower example layer.
// The TOP_FLOW string is byte-identical on both slides so nothing shifts
// when advancing from slide 2 to slide 3 (PowerPoint-style build effect).

const ICON_DEVICE = `
  <svg width="86" height="86" viewBox="0 0 64 64" fill="none" stroke="currentColor"
       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="15" y="9" width="34" height="46" rx="7"/>
    <rect x="21" y="15" width="22" height="13" rx="2"/>
    <path d="M32 35c3.5 3.6 6 6 6 9a6 6 0 0 1-12 0c0-3 2.5-5.4 6-9z"/>
    <line x1="23" y1="48" x2="41" y2="48"/>
  </svg>`;

const ICON_REPORT = `
  <svg width="86" height="86" viewBox="0 0 64 64" fill="none" stroke="currentColor"
       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 8h21l13 13v35H15z"/>
    <path d="M36 8v13h13"/>
    <line x1="22" y1="30" x2="38" y2="30"/>
    <line x1="22" y1="37" x2="42" y2="37"/>
    <path d="M30 50l16-16 5 5-16 16-6 1z"/>
  </svg>`;

const ICON_REGULATORY = `
  <svg width="86" height="86" viewBox="0 0 64 64" fill="none" stroke="currentColor"
       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 24L32 10l23 14"/>
    <line x1="15" y1="25" x2="15" y2="47"/>
    <line x1="25" y1="25" x2="25" y2="47"/>
    <line x1="39" y1="25" x2="39" y2="47"/>
    <line x1="49" y1="25" x2="49" y2="47"/>
    <line x1="11" y1="47" x2="53" y2="47"/>
    <line x1="7" y1="53" x2="57" y2="53"/>
  </svg>`;

const ICON_SEARCH = `
  <svg width="62" height="62" viewBox="0 0 64 64" fill="none" stroke="currentColor"
       stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 8h20l10 10v30a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V8z"/>
    <path d="M36 8v10h10"/>
    <circle cx="30" cy="33" r="8"/>
    <line x1="36" y1="39" x2="44" y2="47"/>
  </svg>`;

const ARROW = `
  <div style="display:flex; align-items:center; justify-content:center; color:var(--terracotta-2);
              font-family:'JetBrains Mono',monospace; font-size:42px; line-height:1;">&rarr;</div>`;

const stepLabel = (n: string) => `
  <div style="font-family:'JetBrains Mono',monospace; font-size:21px; letter-spacing:.24em;
              text-transform:uppercase; color:var(--terracotta-2); font-weight:600;">${n}</div>`;

const TOP_FLOW = `
  <div class="eyebrow" style="margin-bottom:18px;">Domain</div>
  <h2 class="section" style="font-size:88px;">What is coding, <em>why it matters.</em></h2>
  <div class="serif" style="font-style:italic; font-size:32px; color:var(--muted); margin-top:12px;">
    From free text to a fixed code
  </div>

  <div style="margin-top:42px; display:grid; grid-template-columns:1fr 60px 1fr 60px 1fr; align-items:stretch;">

    <!-- CARD 1 -->
    <div class="card" style="display:flex; flex-direction:column; align-items:center; text-align:center; min-height:338px; padding:26px 34px;">
      ${stepLabel("Step 1")}
      <div style="margin:24px 0 22px; color:var(--terracotta-2);">${ICON_DEVICE}</div>
      <div class="serif" style="font-size:30px; line-height:1.3; color:var(--ink); font-weight:500;">
        An unexpected problem happens with a <b style="font-weight:700;">medical device</b>
      </div>
    </div>

    ${ARROW}

    <!-- CARD 2 -->
    <div class="card" style="display:flex; flex-direction:column; align-items:center; text-align:center; min-height:338px; padding:26px 34px;">
      ${stepLabel("Step 2")}
      <div style="margin:24px 0 22px; color:var(--terracotta-2);">${ICON_REPORT}</div>
      <div class="serif" style="font-size:30px; line-height:1.3; color:var(--ink); font-weight:500;">
        An <b style="font-weight:700;">incident report</b> is written
      </div>
    </div>

    ${ARROW}

    <!-- CARD 3 -->
    <div class="card" style="display:flex; flex-direction:column; align-items:center; text-align:center; min-height:338px; padding:26px 34px;">
      ${stepLabel("Step 3")}
      <div style="margin:24px 0 18px; color:var(--terracotta-2);">${ICON_REGULATORY}</div>
      <div class="serif" style="font-size:30px; line-height:1.25; color:var(--ink); font-weight:500;">Regulatory workflows</div>
      <div style="font-size:24px; line-height:1.4; color:var(--ink-2); margin-top:6px;">
        Require the event to be <b style="color:var(--ink); font-weight:600;">coded into MedDRA</b>
      </div>
      <div style="margin-top:auto; padding-top:16px; font-size:18px; line-height:1.35; color:var(--muted);">
        MedDRA = international medical terminology for safety reporting
      </div>
    </div>
  </div>`;

const footer = (page: string) => `
  <div class="ftr">
    <div>THOMAS HEGER &nbsp;|&nbsp; CAPSTONE II &nbsp;|&nbsp; 03 JUN 2026</div>
    <div class="rule"></div>
    <div style="color:var(--terracotta-2);">${page}</div>
  </div>`;

export const slide2Html = `
<section class="slide" data-screen-label="02 Domain" style="display:flex; flex-direction:column;">
  ${TOP_FLOW}
  ${footer("2 / 10")}
</section>`;

export const slide3Html = `
<section class="slide" data-screen-label="03 Domain" style="display:flex; flex-direction:column;">
  ${TOP_FLOW}

  <!-- Lower example layer (appears on top of the identical slide-2 flow) -->
  <div style="margin-top:26px; display:grid; grid-template-columns:1fr 70px 1fr; align-items:stretch;">

    <!-- INCIDENT REPORT -->
    <div style="background:var(--cream); border:1px solid var(--line); border-radius:12px; padding:26px 32px; display:flex; align-items:center; gap:22px;">
      <div style="color:var(--terracotta-2); flex:0 0 auto;">${ICON_SEARCH}</div>
      <div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:22px; letter-spacing:.12em;
                    text-transform:uppercase; color:var(--terracotta-2); font-weight:700; margin-bottom:12px;">
          Incident report
        </div>
        <div class="serif" style="font-style:italic; font-size:32px; line-height:1.3; color:var(--ink); font-weight:500;">
          &ldquo;Insulin pump user woke confused at 3&nbsp;AM. Blood glucose was 34&nbsp;mg/dL.&rdquo;
        </div>
      </div>
    </div>

    ${ARROW}

    <!-- PREFERRED TERM -->
    <div style="background:var(--cream); border:1px solid var(--line); border-radius:12px; padding:26px 32px;
                display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:18px; letter-spacing:.2em;
                  text-transform:uppercase; color:var(--terracotta-2); font-weight:600; margin-bottom:10px;">
        Preferred term
      </div>
      <div class="serif" style="font-size:42px; font-weight:600; color:var(--ink); line-height:1.05;">Hypoglycaemia</div>
      <div style="font-family:'JetBrains Mono',monospace; font-size:18px; color:var(--ink-2); margin-top:12px;">
        MedDRA PT code: 10020993
      </div>
    </div>
  </div>

  <!-- Dark summary bar (key message of slide 3) -->
  <div style="margin-top:22px; background:var(--ink); color:var(--cream); padding:24px 40px; border-radius:12px; text-align:center; font-size:30px; line-height:1.35;">
    From <b style="color:var(--amber);">free text</b> to <b style="color:var(--amber);">1 best term</b> out of <b style="color:var(--amber);">~27,000</b> possible terms
  </div>

  ${footer("3 / 10")}
</section>`;
