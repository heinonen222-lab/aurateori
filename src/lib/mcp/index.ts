import { auth, defineMcp } from "@lovable.dev/mcp-js";
import premiumStatus from "./tools/get-subscription";
import practiceQuestions from "./tools/practice-questions";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "aurateori",
  title: "Aurateori",
  version: "0.1.0",
  instructions: "Verktyg för Aurateori, en svensk teoriapp för B-körkort. Läs Premium-status och hämta övningsfrågor som den inloggade eleven har tillgång till.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [premiumStatus, practiceQuestions],
});
