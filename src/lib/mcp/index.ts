import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchSignsTool from "./tools/search-signs";
import searchQuestionsTool from "./tools/search-questions";
import lessonsTool from "./tools/list-lessons";
import premiumStatusTool from "./tools/premium-status";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "aurateori",
  title: "Aurateori",
  version: "0.1.0",
  instructions:
    "Tools for Aurateori, a Swedish driving licence (B) theory app. Use search_road_signs for the road sign library, search_theory_questions for the theory question bank, get_lessons for interactive lessons, and get_premium_status for the signed-in user's subscription.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchSignsTool, searchQuestionsTool, lessonsTool, premiumStatusTool],
});
