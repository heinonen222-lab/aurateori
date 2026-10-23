import type { Question, QuestionSource } from "@/data/questions";

const ts = "https://www.transportstyrelsen.se/sv/vagtrafik/";
const tv = "https://www.trafikverket.se/";
const safety = `${tv}resa-och-trafik/trafiksakerhet/sakerhet-pa-vag/`;
const laws = "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/";
const signs = `${ts}trafikregler-och-vagmarken/vagmarken/`;
const link = (label: string, url: string): QuestionSource => ({ label, url });

/** Browser-safe metadata only; never import paid question content here. */
export function getQuestionSources(question: Pick<Question, "reference" | "category" | "source" | "question">): { links: QuestionSource[]; note?: string } {
  const ref = question.reference.toLowerCase();
  const links: QuestionSource[] = [];
  if (question.source) links.push(question.source);
  if (/trafikförordning/.test(ref)) links.push(link("Trafikförordningen – lagtext", `${laws}trafikforordning-19981276_sfs-1998-1276/`));
  if (/vägmärkesförordning|vmf/.test(ref)) links.push(link("Vägmärkesförordningen – lagtext", `${laws}vagmarkesforordning-200790_sfs-2007-90/`));
  if (/körkortslagen/.test(ref)) links.push(link("Körkortslagen – lagtext", `${laws}korkortslag-1998488_sfs-1998-488/`));
  if (/trafikbrott|straff för vissa trafikbrott/.test(ref)) links.push(link("Trafikbrottslagen – lagtext", `${laws}lag-1951649-om-straff-for-vissa-trafikbrott_sfs-1951-649/`));
  if (/vägtrafikdefinitioner/.test(ref)) links.push(link("Förordningen om vägtrafikdefinitioner", `${laws}forordning-2001651-om-vagtrafikdefinitioner_sfs-2001-651/`));
  if (/fordonsförordning/.test(ref)) links.push(link("Fordonsförordningen – lagtext", `${laws}fordonsforordning-2009211_sfs-2009-211/`));
  if (/lokala.*föreskrifter|miljöbalk/.test(ref)) links.push(link("Transportstyrelsen – Svensk trafikföreskriftssamling", "https://rdt.transportstyrelsen.se/rdt/AF06_Search.aspx"));
  if (question.category === "Vägmärken" || /vägmärken|vägmärkesförordning|vmf/.test(ref)) {
    links.push(link("Transportstyrelsen – Vägmärken", signs));
    const code = question.reference.match(/\b([ABCDEFM])\d+/)?.[1];
    const groups: Record<string, [string, string]> = { A: ["Varningsmärken", "varningsmarken"], B: ["Väjningspliktsmärken", "vajningspliktsmarken"], C: ["Förbudsmärken", "forbudsmarken"], D: ["Påbudsmärken", "pabudsmarken"], E: ["Anvisningsmärken", "anvisningsmarken"], F: ["Lokaliseringsmärken för vägvisning", "lokaliseringsmarken-for-vagvisning"], M: ["Vägmarkeringar", "vagmarkeringar"] };
    if (code && groups[code]) {
      const [label, path] = groups[code];
      links.push(link(`Transportstyrelsen – ${label}`, `${signs}${path}/`));
    }
    if (/\bE17\b/i.test(question.reference) || /återvändsväg/i.test(question.question)) {
      links.push(link("Transportstyrelsen – E17 Återvändsväg", `${signs}anvisningsmarken/atervandsvag/`));
    }
  }
  if (!links.length) {
    if (/besiktning/.test(ref)) links.push(link("Transportstyrelsen – Besiktningsregler för personbil", `${ts}fordon/aga-kopa-eller-salja-fordon/fordonsbesiktning/besiktningsregler/personbil-och-lastbil-som-inte-overstiger-3500-kg-i-totalvikt/`));
    else if (/däck/.test(ref)) links.push(link("Transportstyrelsen – Däck", `${ts}fordon/fordonsregler/dack/${/vinter/.test(ref) ? "vinterdack/" : ""}`));
    else if (/riskutbildning|trötthet/.test(ref)) links.push(link("Transportstyrelsen – Riskutbildning för personbil", `${ts}korkort/ta-korkort/riskutbildning/riskutbildning-bil/`));
    else if (/vikter|släp/.test(ref)) links.push(link("Transportstyrelsen – Vikter för bil och släpvagn", `${ts}fordon/fordonsregler/regler-for-olika-fordonsslag/slap/vikter/`));
    else if (/kunskapsprov|personbil och lätt|behörighet|övningskörning/.test(ref)) links.push(link("Trafikverket – Personbil och lätt lastbil (B)", `${tv}korkort/ta-korkort/personbil-och-latt-lastbil/`));
    else if (/alkohol/.test(ref)) links.push(link("Trafikverket – Alkohol och narkotika i vägtrafiken", `${safety}alkohol-och-narkotika-i-vagtrafiken/`));
    else if (/hastighet|stoppsträcka|reaktionstid|kinetisk energi|avstånd/.test(ref)) links.push(link("Trafikverket – Hastighet och krockvåld", `${safety}hastighetsgranser-pa-vag/hastighet-och-krockvald/`));
    else if (/trafikförsäkring/.test(ref)) links.push(link("Transportstyrelsen – Trafikförsäkring", `${ts}fordon/aga-kopa-eller-salja-fordon/trafikforsakring/`));
    else if (/försäkring|självrisk/.test(ref)) links.push(link("Konsumenternas – Bilförsäkringar", "https://www.konsumenternas.se/forsakringar/fordonsforsakringar/bilforsakringar/"));
    else if (/energimyndigheten/.test(ref)) links.push(link("Energimyndigheten", "https://www.energimyndigheten.se/"));
    else if (/naturvårdsverket/.test(ref)) links.push(link("Naturvårdsverket", "https://www.naturvardsverket.se/"));
    else if (/läkemedel/.test(ref)) links.push(link("Läkemedelsverket", "https://www.lakemedelsverket.se/"));
    else if (/vti/.test(ref)) links.push(link("VTI – Statens väg- och transportforskningsinstitut", "https://www.vti.se/"));
    else if (/trafikanalys/.test(ref)) links.push(link("Trafikanalys – Statistik", "https://www.trafa.se/"));
    else if (/viltolycksrådet/.test(ref)) links.push(link("Nationella Viltolycksrådet", "https://www.viltolycka.se/"));
    else if (/röda korset/.test(ref)) links.push(link("Svenska Röda Korset", "https://www.rodakorset.se/"));
    else if (/112|sos alarm/.test(ref)) links.push(link("SOS Alarm – 112", "https://www.sosalarm.se/112-och-andra-viktiga-nummer/112/"));
    else if (/transportstyrelsen|fordon/.test(ref)) links.push(link("Transportstyrelsen – Fordonsregler", `${ts}fordon/fordonsregler/`));
    else links.push(link("Trafikverket – Säkerhet på väg", safety));
  }
  let note: string | undefined;
  if (/instruktionsbok|fordonsteknik/.test(ref)) note = "Fordonsspecifik funktion: kontrollera instruktionsboken för din bil. Myndighetslänken är bakgrund, inte en källa för varje bilmodell.";
  else if (/modell|räkne|tumregel/i.test(question.reference + " " + question.question) || /kinetisk energi|reaktionstid|stoppsträcka/.test(ref)) note = "Beräkningar och tumregler är pedagogiska modeller, inte lagstadgade eller garanterade sträckor.";
  else if (!question.source && !/förordning|körkortslagen|trafikbrott/.test(ref)) note = "Översiktskälla: använd ämnet och referensen för att kontrollera uppgiften. Länken är inte en certifiering av frågan.";
  return { links: links.filter((source, i, all) => all.findIndex((s) => s.url === source.url) === i), note };
}