import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeSwedishMobile } from "./phone.ts";

test("070-format blir +46", () => assert.equal(normalizeSwedishMobile("070-123 45 67"), "+46701234567"));
test("+46 behålls", () => assert.equal(normalizeSwedishMobile("+46 73 123 45 67"), "+46731234567"));
test("0046 normaliseras", () => assert.equal(normalizeSwedishMobile("0046761234567"), "+46761234567"));
test("fast nummer avvisas", () => assert.equal(normalizeSwedishMobile("08-123 456 78"), null));
test("för kort avvisas", () => assert.equal(normalizeSwedishMobile("070123"), null));
