import { test } from "node:test";
import { strict as assert } from "node:assert";
import { QUESTIONS } from "../data/questions";
import { FORMER_FREE_QUESTIONS } from "../data/former-free-questions";
import { PREMIUM_QUESTIONS } from "../data/premium-questions";
import { EXAM_QUESTIONS } from "../data/exam-questions";
import { EXTRA_QUESTIONS } from "../data/extra-questions";
import { TRIAL_QUESTIONS } from "../data/trial-questions";
import { ROAD_SIGNS } from "../data/signs";
import { SIGN_IMAGES } from "../data/sign-images";

const bank = [...QUESTIONS, ...FORMER_FREE_QUESTIONS, ...PREMIUM_QUESTIONS, ...EXAM_QUESTIONS, ...EXTRA_QUESTIONS, ...TRIAL_QUESTIONS];
function answer(id: string) {
  const question = bank.find((q) => q.id === id);
  assert.ok(question, id);
  return question.options[question.correct];
}

test("all 623 local questions retain unique IDs and four distinct options", () => {
  assert.equal(bank.length, 623);
  assert.equal(new Set(bank.map((q) => q.id)).size, 623);
  for (const q of bank) {
    assert.equal(q.options.length, 4, q.id);
    assert.equal(new Set(q.options.map((o) => o.trim().toLowerCase())).size, 4, q.id);
    assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4, q.id);
    if (q.image) assert.ok(SIGN_IMAGES[q.image], q.id);
  }
});

test("B knowledge tests from 19 August 2026 are valid one year", () => {
  assert.equal(answer("xf-254"), "Ett år");
});

test("inspection schedule is 36, 24 and then 14 months", () => {
  assert.equal(answer("q60"), "Först senast efter 36 månader, sedan 24 månader och därefter senast var 14:e månad");
});

test("dangerous vehicles with issued driving bans must be towed", () => {
  assert.equal(answer("tv-fk-7"), "Den måste bärgas");
  assert.equal(answer("xf-91"), "Den måste bärgas");
});

test("D5 artwork is tested as a walking path, not D6", () => {
  assert.equal(answer("tv-vm-7"), "Påbjuden gångbana");
  assert.equal(bank.find((q) => q.id === "tv-vm-7")?.image, "pabud-gangbana");
});

test("yielding signs have the official B classification", () => {
  for (const id of ["vajningsplikt", "forbud-stopp", "anv-overgang", "anv-huvudled", "anv-slut-huvudled"]) {
    assert.equal(ROAD_SIGNS.find((s) => s.id === id)?.category, "Väjningspliktsmärken");
    assert.equal(answer(`xs-${id}-cat`), "Väjningspliktsmärken");
  }
});

test("ordinary towing has one unambiguous maximum of 30 km/h", () => {
  assert.equal(answer("q67"), "Högst 30 km/h");
  assert.equal(bank.find((q) => q.id === "q67")?.options.includes("30 km/h"), false);
});

test("B96 and risk training duration remain correctly scoped", () => {
  assert.equal(answer("xf-64"), "Bil och släp med sammanlagd totalvikt högst 4 250 kg");
  assert.equal(answer("xf-247"), "Till den dag du tar körkortet, dock högst fem år");
});

test("C31 termination is not taught as a built-up area boundary", () => {
  assert.equal(answer("q12"), "Till annan hastighet med C31 eller till C32, E7 eller E9");
  assert.equal(answer("tv-vm-12"), answer("q12"));
});

test("C20 applies to actual gross weight rather than registered total weight", () => {
  assert.equal(answer("xf-121"), "Förbud mot fordon med bruttovikt över 3,5 ton");
});

test("calculated stopping distance at 50 km/h is 26 metres", () => {
  assert.equal(answer("xn-stop-50"), "26 meter");
});