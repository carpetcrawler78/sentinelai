# SentinelAI -- Rehearsal Cue Sheet
## Zum Auswendig-Üben. Erster Satz wörtlich, Rest sind nur Stichworte.
Gesamt ~11 min. Drei Stellen langsamer: Slide 7, 10, 13.
Wenn du den Faden verlierst: Eyebrow oben links ist deine Landkarte.

---

**1 · Title [20s]**
> "Hi, I am Thomas. Today I will show you SentinelAI -- it helps safety
> officers code adverse-event reports about medical devices."
Cues: agenda in one breath -> coding, problem, how it works, models, two live screens. ~10 min.

**2 · Domain -- what is coding [40s]**
> "Before I show what SentinelAI does, I need to explain coding."
Cues: device problem -> manufacturer writes free text -> must become ONE standard code -> MedDRA, ~27k terms.

**3 · The example revealed [35s]**
> "Here is the same report with the answer."
Cues: right code = Hypoglycaemia, one term out of 27k. Without the code -> no comparison, regulator can't read them.

**4 · The problem [45s]**
> "This is the work today."
Cues: 4 limits -> 10 min/case · 27k to scan · varies by coder · specialist time scarce. = hard to scale, hard to reproduce.

**5 · The solution [45s]**
> "Same four points, now with SentinelAI."
Cues: minutes->seconds · 5 ranked suggestions + reason · same logic every time · reviewer in charge. NOT automation -- assistance.

**6 · Challenges + the law [70s]  (langsam)**
> "Why this is harder than it looks -- and why the law shapes every choice."
Cues: messy input · strict output (valid MedDRA PT) · lexical+semantic match. Then: regulated workflow -> AI Act / MDR / GDPR -> local, traceable, never autonomous.

**7 · The pipeline [70s]  (langsam)**
> "Three stages, all running locally, all logged."
Cues: Retrieve (report + 27k -> 100, lexical+semantic) -> Rerank (100 -> top 5) -> Suggest (top 5 -> 1 term + reason) -> human accepts/corrects/rejects. Not a black box.

**8 · Engineered system [45s]**
> "The same funnel -- but this is what makes it a real system, not a notebook."
Cues: persistent data (Postgres) · reproducible runtime (Docker) · observable runs (Grafana/MLflow) · quality gates (pytest/CI/git).

**9 · Evaluation [55s]**
> "How do we measure quality without an expert-labeled gold set?"
Cues: 24-case reference set, 3 device groups, graded. LLM proposes, I check by hand. Metrics: R@100, soft@5, p@1. Directional, NOT production validation.

**10 · Model selection [65s]  (langsam)**
> "We chose models one stage at a time."
Cues: Retrieve -> Hybrid, R@100 = 0.75. Rerank -> ELECTRA, soft@5 = 0.625. Suggest -> qwen2.5 local, p@1 = 0.375, edges out the cloud reference (greyed out -- excluded by GDPR, not capability). Stack is fully local.

**11 · Deployment [35s]**
> "That selected stack is running as a live workflow."
Cues: pipeline -> coding worker -> Postgres (source of truth) -> Grafana -> reviewer app. EU server, Docker. Next two screens = this, live.

**12 · Grafana LIVE [45s]**
> "This is the live operations view."
Cues: worker running · throughput · spread across 3 device types. The "observable runs" box, in production. [If blank: "captured this morning", move on. Never debug.]

**13 · Reviewer LIVE [90s]  (langsam, dein stärkster Moment)**
> "This is the reviewer screen -- three real patterns."
Cues:
- EASY: term is in the text. Hyperglycaemia, ranking index 0.83. Accept.
- HARD: bolus -> weakness, shakiness, sweating. Word not in text -- reason from symptoms. High ranking index. LLM earns its keep.
- I-DON'T-KNOW: vague. Low ranking index. System says "look closely". Honest about uncertainty.
> "That is the whole loop. Thank you -- I will take questions."

---

## Übe-Plan (heute Abend)
1. Einmal NUR die fettgedruckten ersten Sätze laut durchgehen -- nur die Einstiege.
2. Dann zwei volle Durchläufe laut, mit Handy-Stoppuhr. Ziel ~10-11 min.
3. Stolperst du wo -> diese eine Slide 3x isoliert wiederholen.
4. Letzter Durchlauf: stehend, im Tempo der echten Klicks.

## Gegen die Nervosität (konkret)
- Der erste Satz ist auswendig -> du startest nie aus dem Kalten. Danach trägt der Stoff.
- Vor Slide 7, 10, 13: kurz durchatmen, das sind die Tempo-Bremsen.
- Die Live-Demo (12/13) ist dein Freund, nicht dein Risiko -- da redest DU weniger, der Screen zeigt.
- Wenn was hakt: "happy to dig into that in Q&A" und weiter. Niemand merkt eine kleine Lücke.
- "Thank you" auf Slide 13 = Ende. Keine Zusammenfassung dranhängen.
