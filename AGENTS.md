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
