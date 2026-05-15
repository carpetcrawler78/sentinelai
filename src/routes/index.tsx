import { createFileRoute } from "@tanstack/react-router";
import { Deck } from "@/components/Deck";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinelAI · PM Meeting · 22 May 2026" },
      { name: "description", content: "SentinelAI PM meeting deck — assisted MedDRA coding under regulatory constraints." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Deck />;
}
