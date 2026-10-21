<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Android distribution
- Package Android as a Bubblewrap TWA for `app.aurateori.android`; retain its upload key and increment versionCode for every upload so Play accepts updates.
- Keep Android tooling and private signing material outside the web project; only encrypted signing backups may be delivered to the owner.
- Treat a signed AAB as a test artifact until Play app-signing Digital Asset Links and Google Play Billing are configured; packaging alone does not make the Paddle web checkout Play-compliant.
- Android checkout uses the Digital Goods API with server-side Android Publisher verification; web checkout stays on Paddle to keep provider ownership separate.
- Play purchase tokens are server-only and atomically bound to one account; refresh Play entitlements before access and keep question-bank grants fresh for at most ten minutes to reject revoked purchases.
- Billing-enabled Bubblewrap releases must use startUrl with `play=1` and retain that marker during navigation; unavailable Play Billing must never fall back to Paddle inside the Android package.

## Learning experience
- Derive dashboard and topic progress from existing answer/exam logs; topic filters map existing questions without changing stored categories, preserving saved results.
- Keep exam choices keyed by question ID in a frozen session question set; commit outcomes once at submission, allowing revisits without duplicate scoring.
- Render the five primary mobile destinations directly and keep secondary tools in the header menu; preserve all existing public URLs.
