import { test } from "node:test";
import { strict as assert } from "node:assert";
import { getQuestionSources } from "./question-sources";
import { QUESTIONS } from "../data/questions";
import { FORMER_FREE_QUESTIONS } from "../data/former-free-questions";
import { PREMIUM_QUESTIONS } from "../data/premium-questions";
import { EXAM_QUESTIONS } from "../data/exam-questions";
import { EXTRA_QUESTIONS } from "../data/extra-questions";
import { TRIAL_QUESTIONS } from "../data/trial-questions";

test("every local question has a reference and HTTPS source links", () => {
  const bank = [...QUESTIONS, ...FORMER_FREE_QUESTIONS, ...PREMIUM_QUESTIONS, ...EXAM_QUESTIONS, ...EXTRA_QUESTIONS, ...TRIAL_QUESTIONS];
  assert.equal(bank.length, 623);
  for (const q of bank) {
    assert.ok(q.reference.trim(), q.id);
    const { links } = getQuestionSources(q);
    assert.ok(links.length > 0, q.id);
    for (const source of links) assert.equal(new URL(source.url).protocol, "https:", q.id);
  }
});

test("admin questions without a stored URL resolve traffic laws", () => {
  const { links } = getQuestionSources({ reference: "Trafikförordningen 3 kap. 18 §", category: "Trafikregler", question: "Högerregeln?" });
  assert.equal(links[0]?.url, "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/trafikforordning-19981276_sfs-1998-1276/");
});

test("E17 links to the official dead-end sign rather than E15", () => {
  const { links } = getQuestionSources({ reference: "Vägmärkesförordningen E17", category: "Vägmärken", question: "Återvändsväg?" });
  assert.ok(links.some((s) => s.url === "https://www.transportstyrelsen.se/sv/vagtrafik/trafikregler-och-vagmarken/vagmarken/anvisningsmarken/atervandsvag/"));
});

test("manufacturer guidance is not presented as an official rule", () => {
  assert.match(getQuestionSources({ reference: "Fordonets instruktionsbok", category: "Fordonskännedom", question: "Varningslampa?" }).note ?? "", /instruktionsboken/);
});