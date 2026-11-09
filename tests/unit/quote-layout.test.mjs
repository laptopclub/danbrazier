import assert from "node:assert/strict";
import test from "node:test";
import { quoteLineOffset } from "../../lib/quote-layout.ts";

test("the first quote line stays centred for every phase", () => {
  for (let phase = 0; phase < 2 * Math.PI; phase += 0.1) assert.equal(quoteLineOffset(0, phase), 0);
});

test("the wave is bounded and neighbouring lines move gradually", () => {
  for (let phase = 0; phase < 2 * Math.PI; phase += 0.1) {
    for (let line = 0; line < 20; line++) {
      assert.ok(Math.abs(quoteLineOffset(line, phase)) <= 4.5 + 1e-10);
      assert.ok(Math.abs(quoteLineOffset(line + 1, phase) - quoteLineOffset(line, phase)) <= 2.25 + 1e-10);
    }
  }
});
