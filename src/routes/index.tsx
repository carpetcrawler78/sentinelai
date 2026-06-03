import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/components/Deck";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinelAI · Final Presentation · 03 Jun 2026" },
      { name: "description", content: "SentinelAI PM meeting deck — assisted MedDRA coding under regulatory constraints." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Deck />;
}
