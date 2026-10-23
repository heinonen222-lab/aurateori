import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep published bookmarks working after retiring the 3D learning experience.
export const Route = createFileRoute("/genomgangar")({
  beforeLoad: () => {
    throw redirect({ to: "/quiz", statusCode: 301, replace: true });
  },
  head: () => ({ meta: [
    { title: "Genomgångar har flyttat – Aurateori" },
    { name: "description", content: "Fortsätt lära dig svenska trafikregler med Aurateoris teorifrågor och förklaringar." },
    { property: "og:title", content: "Genomgångar har flyttat – Aurateori" },
    { property: "og:description", content: "Fortsätt din teoriträning i Aurateori." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
