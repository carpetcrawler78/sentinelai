# SentinelAI -- Speaker Notes
## Final Presentation -- 03 June 2026 (v5 deck, 13 slides)

These notes go on your second screen during the talk.
Plain English, no buzzwords. Read at a calm pace, ~100-120 words per minute.
Time budget per slide in brackets. Eyebrow at the top of each slide is your map:
Title -> Domain -> Scope -> Constraints -> Architecture -> Engineering ->
Evaluation -> Deployment -> Live demo.

Framing rules (do not slip): say "ranking index", never "confidence" or
"accuracy". The retrieval store is pgvector, not FAISS. Numbers are
device-separated -- "across three device types", never one blended percentage.
The cloud model is a benchmark reference only; it is excluded from production
by law, not by capability.

---

## Slide 1 -- Title  [~20 sec]

Hi, I am Thomas. Today I will show you SentinelAI -- a system that helps
safety officers code adverse-event reports about medical devices.

I will walk you through what coding is, the problem, how the system works,
how we chose each model, and then two live screens. About ten minutes, then
questions.

---

## Slide 2 -- What is coding, why it matters  [~40 sec]

Before I show what SentinelAI does, I need to explain coding.

When a medical device causes a problem, the manufacturer writes a report --
free text, a few sentences in plain language. To do anything useful with it --
compare it to other reports, spot a safety pattern, send it to the regulator --
you have to turn that free text into one standard code. We use the MedDRA code
book: about twenty-seven thousand standard terms.

---

## Slide 3 -- The example, revealed  [~35 sec]

Here is the same report with the answer. The right code for this case is
Hypoglycaemia -- one Preferred Term out of twenty-seven thousand.

Without that code, reports from different companies cannot be compared, and
the regulator cannot read them as a group. That one term is the whole job.

---

## Slide 4 -- The problem: manual coding does not scale  [~45 sec]

This is the work today. A safety officer reads each report, searches the
MedDRA book, picks one term, saves the decision. Four limits show up:

About ten minutes per case -- when reports come in waves, the backlog grows.
Twenty-seven thousand terms to scan -- easy to miss the right one. The result
varies by coder -- two specialists can pick different terms on the same report.
And specialist time is scarce -- small and mid-size companies have very few
people who can do this.

Together: coding is hard to scale and hard to reproduce.

---

## Slide 5 -- The solution: SentinelAI assists, never decides  [~45 sec]

Same four points, now with SentinelAI.

Ten minutes becomes seconds. Instead of scanning twenty-seven thousand terms,
the coder sees five ranked suggestions, each with a written reason. The same
logic runs on every report -- no day-to-day variation. And the reviewer stays
in charge: the system suggests, the person decides, every step is saved.

This is not automation. It is assistance -- faster, more consistent, nothing
autonomous.

---

## Slide 6 -- Challenges behind medical-device coding  [~70 sec]

Why this is harder than it looks -- and why the law shapes every design choice.

The input is messy: device issue, patient outcome, and timeline, often in one
short narrative. The output is strict: not a summary, but a valid MedDRA
Preferred Term. And the match can be an exact word, a paraphrase, or ambiguous
clinical wording -- so we need both keyword and meaning-based search.

On top of that, this is a regulated workflow, not just prediction. Three
European frameworks apply -- the EU AI Act, the MDR, and GDPR. Together they
force three properties: local by default, traceable by design, and never
autonomous. Patient data cannot leave Europe; a human must stay in the loop;
every decision and the exact model version must be on record.

That is why the design is staged and local: retrieve candidates, rank
carefully, suggest within constraints, human review.

---

## Slide 7 -- A controlled funnel, not a black box  [~70 sec]

Three stages, all running locally, all logged.

Stage one, Retrieve: the report plus the twenty-seven thousand terms go in;
two parallel searches -- one lexical, one semantic -- narrow it to one hundred
candidates.

Stage two, Rerank: a smaller model reads the report together with those one
hundred and keeps the best top five.

Stage three, Suggest: a local language model reads the report and the top five,
picks one term, and writes a one-sentence reason.

Then the human reviewer accepts, corrects, or rejects. Each stage just narrows
the search space before a person decides -- that is what keeps it reviewable
instead of a black box.

---

## Slide 8 -- From workflow to engineered system  [~45 sec]

The same funnel, but this is what makes it a real system, not a notebook.

Persistent data -- PostgreSQL, with raw and processed schemas and audit-ready
results. Reproducible runtime -- Docker Compose, Python workers, pinned config.
Observable runs -- Grafana and MLflow, so every run is visible. And quality
gates -- pytest, GitHub Actions, Git versioning on every change.

Persistent data, reproducible workers, observable runs, tested changes. You
will see two of these live in a moment.

---

## Slide 9 -- Evaluation without production labels  [~55 sec]

How do we measure quality without an expert-labeled clinical gold set? We
built a small reference set -- twenty-four device incident reports, three
device groups, graded simple, moderate, difficult. The language model proposes
a term and a rationale; I check each one by hand for plausibility; that becomes
the reference label.

We read it with three metrics. R-at-100: is the reference term anywhere in the
candidate pool? Soft-at-5: is a clinically usable term in the top five? And
p-at-1: is the exact reference term at rank one?

This is directional model selection on a prototype -- not production
validation. I am explicit about that.

---

## Slide 10 -- Stage-wise model selection  [~65 sec]

We chose models one stage at a time: fix the best upstream stage, then compare
the next component against the right metric.

Stage one, on candidate recall: hybrid search wins at R-at-100 of zero point
seven-five -- vector-only and keyword-only are both clearly behind.

Stage two, on the usable shortlist: ELECTRA-base wins at soft-at-5 of zero
point six-two-five, ahead of the two MiniLM rerankers.

Stage three, the suggestion: our local qwen-2.5 model reaches p-at-1 of zero
point three-seven-five -- and on this small twenty-four-case evaluation it
slightly edges out the cloud reference. The cloud model is greyed out on
purpose: it is a benchmark only, excluded from production by GDPR, not by
capability.

So the selected stack is fully local: hybrid retrieval, ELECTRA rerank, qwen
suggestion.

---

## Slide 11 -- From selected pipeline to live system  [~35 sec]

That selected stack is running as a live workflow. The pipeline -- hybrid,
ELECTRA, qwen -- feeds a coding worker that processes reports in batches.
Results land in PostgreSQL, our source of truth. Grafana watches the system,
and the reviewer app puts a human on the final decision.

All of it on an EU-hosted server, in Docker. The next two screens are this,
live.

---

## Slide 12 -- Grafana monitoring [LIVE]  [~45 sec]

This is the live operations view. [If the tunnel is up, the dashboard is on
screen; if not, this is a captured screenshot -- say so plainly and move on.]

What you are looking at: the coding worker running, throughput over time, and
the spread of coded terms across the three device types. This is the
"observable runs" box from two slides ago, in production -- so an operator can
see at a glance that the pipeline is alive and healthy.

[Do not debug live. If a panel is slow, narrate what it shows and move to the
reviewer.]

---

## Slide 13 -- How it looks for the reviewer [LIVE]  [~90 sec, 3 cases]

This is the reviewer screen -- three real patterns. [self-contained, no server
needed.]

[click EASY CASE] The easy one. The term is essentially in the text. Top
suggestion: Hyperglycaemia, ranking index zero point eight-three. Reviewer
accepts in seconds.

[click HARD CASE] The hard one. Read it: a larger-than-programmed bolus, then
weakness, shakiness, sweating. The word is not in the report -- the symptoms
point to it. The system has to reason from symptoms to diagnosis, and the
ranking index is high. This is where the local language model earns its keep.

[click "I DON'T KNOW" CASE] The vague one. The ranking index is low. The system
is saying: I am not sure, please look closely. That is the real value -- it
does not pretend to know when it does not. The reviewer stays in charge, and
every decision is saved.

That is the whole loop. Thank you -- I will take questions.

---

## Q&A defenses (memorize these)

**"How accurate is it?"**
Strict accuracy needs an expert-labeled clinical reference set -- that is next.
What I show today: consistent staged selection on a controlled reference set,
every decision saved with the exact model version, all running on our own
server as the law requires.

**"Why not use ChatGPT / the cloud model?"**
GDPR Article 44 -- patient data cannot leave Europe -- and health data is a
special category under Article 9. The MDR also requires us to pin the exact
model version per case, years later. The cloud model in my comparison is a
benchmark reference only; on a small twenty-four-case eval our local model
matched or slightly beat it.

**"What is the ranking index? Is it accuracy?"**
A ranking index, not an accuracy number. Higher means earlier in the review
queue, not "X percent correct". It is heuristic and ordinal -- and honest about
uncertainty.

**"Why one hundred candidates, then five, then one?"**
A single big model would be too slow or too imprecise on twenty-seven thousand
terms. The first stage narrows cheaply, the second is precise on a short list,
the third adds the written reason. Right tool for the right candidate count.

**"Is this signal detection / did you find a device problem?"**
No -- statistical signal detection on the coded data is future work. SentinelAI
is a MedDRA coding assistant. It flags where data is unusual; a safety officer
decides if there is a real issue.

**"How much data is coded?"**
Around eleven thousand reports, coded across three device types -- insulin
pumps, pacemakers, and continuous glucose sensors. Device-separated on purpose;
I do not blend them into one number.

---

## Q&A -- Dashboard / distribution (Slide 12, falls jemand fragt)

**"Why does the ranking-index distribution look like that?"**
The ranking index is heuristic and ordinal -- not a probability. The histogram
is the spread of the combined retrieve-rerank-suggest score over all coded
records. The mass sits low-to-mid (peaks around 0.3 and 0.5); few records reach
0.7-0.9. Meaning: clean exact matches are rare, most narratives are only
moderately matchable -- which is exactly why we show a top five and keep a human
in the loop. It is NOT an accuracy curve. A high index means "earlier in the
review queue", not "X percent correct".

**"What are the triage categories -- and why is 'Uncertain' so large?"**
Operational buckets from ranking-index thresholds: flag for review, uncertain,
accept. Most records land in "uncertain" by design -- the system rarely
auto-accepts. That is the whole thesis: assist, never decide. The bulk is routed
to a person, which is also what the AI Act requires for high-risk software.

**"How does this dashboard relate to your eval metrics (R@100, soft@5, p@1)?"**
Two different things, do not conflate. The dashboard is OPERATIONAL monitoring on
the full production set (~16k records): throughput, LLM response rate, latency,
ranking spread, triage routing. The eval metrics are QUALITY on a small,
hand-checked 24-case reference set: R@100=0.75, soft@5=0.625, p@1=0.375. One says
the system is alive, fast, and routing conservatively; the other says how good
the suggestions are on a labeled set.

**"What is 'LLM Success 98.8%' -- is that accuracy?"**
No -- it is the response rate: did the local model return a valid suggestion
versus fall back to a default. Not correctness. If pushed, keep it
device-separated rather than one blended number.

**"Avg LLM 23.5s -- isn't that slow?"**
Stage three (the local language model) is the slow step by design, five to fifty
seconds, on our own CPU, no cloud. Still seconds against roughly ten minutes of
manual coding -- throughput is about fifty to sixty cases per hour.

---

## Delivery notes

- Pace 100-120 wpm. Slow down on slides 7, 10, and 13.
- Slides 4 and 5 are an appear pair -- same left column; let the right column
  land row by row. Do not re-read the left side on slide 5.
- Slide 12 (Grafana): start your SSH tunnel before the talk
  (`ssh -N -L 8000:127.0.0.1:8000 -L 3000:127.0.0.1:3000 cap@<server>`).
  If it is down, the slide auto-shows the screenshot -- say "captured this
  morning" and keep moving. Never debug live.
- Slide 13 is the strongest moment -- give each of the three cases room.
- The "thank you" on slide 13 ends the talk. Do not add a closing summary.
- If anyone pushes on the law (slide 6), say "happy to dig into article numbers
  in Q&A" and keep moving.

---

## Note on footers (cosmetic, not blocking)
The HTML slides have hard-coded footer counters that are out of sync
(e.g. 5/10, 6/12, 10/10, 11/11) and predate the 13-slide deck. The on-screen
pager (12/13, 13/13) is correct. Worth a cleanup pass before the dry run, but
it does not affect the spoken talk.
