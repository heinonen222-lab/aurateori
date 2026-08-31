const MAP: { match: RegExp; message: string }[] = [
  { match: /invalid login credentials/i, message: "Fel e-post eller lösenord." },
  {
    match: /email not confirmed/i,
    message: "E-postadressen är inte bekräftad än – kolla din inkorg och klicka på länken.",
  },
  {
    match: /user already registered|already been registered/i,
    message: "Det finns redan ett konto med den e-posten. Logga in i stället.",
  },
  { match: /password should be at least/i, message: "Lösenordet måste vara minst 6 tecken." },
  {
    match: /password.*(weak|compromised|pwned)/i,
    message: "Lösenordet är för svagt eller läckt – välj ett annat.",
  },
  {
    match: /rate limit|too many requests|429/i,
    message: "För många försök. Vänta en stund och prova igen.",
  },
  {
    match: /invalid email|unable to validate email/i,
    message: "E-postadressen ser inte giltig ut.",
  },
  {
    match: /signups not allowed|signup is disabled/i,
    message: "Nyregistrering är avstängd just nu.",
  },
  {
    match: /token has expired|invalid.*token|otp_expired/i,
    message: "Länken har gått ut. Begär en ny återställningslänk.",
  },
  {
    match: /same.*password|new password should be different/i,
    message: "Det nya lösenordet måste skilja sig från det gamla.",
  },
  { match: /unsupported provider/i, message: "Google-inloggning är inte aktiverad för appen än." },
];

export function authErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  for (const entry of MAP) {
    if (entry.match.test(raw)) return entry.message;
  }
  return raw || "Något gick fel. Försök igen.";
}
