/**
 * Wave 3A consumption-tax (消費税) calculator tests.
 * Run with: npx tsx --test tests/consumption-tax.test.ts
 * (or extend the "test" script in package.json to tests/*.test.ts)
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  calcFromTaxExcluded,
  calcFromTaxIncluded,
  STANDARD_TAX_RATE,
  REDUCED_TAX_RATE,
} from "../src/lib/calculators/consumption-tax";

/* ---------------- 税抜 → 税込 ---------------- */

test("税抜 1000 @10% floor: tax 100, total 1100", () => {
  const r = calcFromTaxExcluded({ amount: 1000, rate: STANDARD_TAX_RATE, round: "floor" });
  assert.equal(r.baseAmount, 1000);
  assert.equal(r.taxAmount, 100);
  assert.equal(r.totalAmount, 1100);
});

test("税抜 1000 @8% (軽減税率): tax 80, total 1080", () => {
  const r = calcFromTaxExcluded({ amount: 1000, rate: REDUCED_TAX_RATE, round: "floor" });
  assert.equal(r.taxAmount, 80);
  assert.equal(r.totalAmount, 1080);
});

/* ---------------- 税込 → 税抜（逆算） ---------------- */

test("税込 1100 @10%: base 1000, tax 100 (all rounding modes)", () => {
  for (const round of ["floor", "round", "ceil"] as const) {
    const r = calcFromTaxIncluded({ amount: 1100, rate: STANDARD_TAX_RATE, round });
    assert.equal(r.baseAmount, 1000);
    assert.equal(r.taxAmount, 100);
    assert.equal(r.totalAmount, 1100);
  }
});

test("税込 1080 @8%: base 1000, tax 80", () => {
  const r = calcFromTaxIncluded({ amount: 1080, rate: REDUCED_TAX_RATE, round: "floor" });
  assert.equal(r.baseAmount, 1000);
  assert.equal(r.taxAmount, 80);
});

/* ---------------- 端数処理のエッジケース ---------------- */

test("税抜 999 @10% (raw tax 99.9): floor 99, ceil 100, round 100", () => {
  const floor = calcFromTaxExcluded({ amount: 999, rate: 0.1, round: "floor" });
  assert.equal(floor.taxAmount, 99);
  assert.equal(floor.totalAmount, 1098);

  const ceil = calcFromTaxExcluded({ amount: 999, rate: 0.1, round: "ceil" });
  assert.equal(ceil.taxAmount, 100);
  assert.equal(ceil.totalAmount, 1099);

  const round = calcFromTaxExcluded({ amount: 999, rate: 0.1, round: "round" });
  assert.equal(round.taxAmount, 100);
  assert.equal(round.totalAmount, 1099);
});

test("税込 999 @10% (raw base 908.18...): floor base 908 tax 91, ceil base 909 tax 90", () => {
  const floor = calcFromTaxIncluded({ amount: 999, rate: 0.1, round: "floor" });
  assert.equal(floor.baseAmount, 908);
  assert.equal(floor.taxAmount, 91);

  const ceil = calcFromTaxIncluded({ amount: 999, rate: 0.1, round: "ceil" });
  assert.equal(ceil.baseAmount, 909);
  assert.equal(ceil.taxAmount, 90);

  const round = calcFromTaxIncluded({ amount: 999, rate: 0.1, round: "round" });
  assert.equal(round.baseAmount, 908);
  assert.equal(round.taxAmount, 91);
});

test("逆算では常に base + tax = total が一致する", () => {
  for (const amount of [1, 98, 100, 999, 1085, 12345, 999999]) {
    for (const rate of [0.1, 0.08]) {
      for (const round of ["floor", "round", "ceil"] as const) {
        const r = calcFromTaxIncluded({ amount, rate, round });
        assert.equal(r.baseAmount + r.taxAmount, r.totalAmount);
      }
    }
  }
});

/* ---------------- 任意税率・ゼロ・エラー ---------------- */

test("任意税率 5%: 税抜 1000 -> tax 50, total 1050", () => {
  const r = calcFromTaxExcluded({ amount: 1000, rate: 0.05, round: "floor" });
  assert.equal(r.taxAmount, 50);
  assert.equal(r.totalAmount, 1050);
});

test("ゼロ金額は両方向ともゼロを返す (siblings と同じ空入力=0 の扱い)", () => {
  const a = calcFromTaxExcluded({ amount: 0, rate: 0.1, round: "floor" });
  assert.deepEqual([a.baseAmount, a.taxAmount, a.totalAmount], [0, 0, 0]);
  const b = calcFromTaxIncluded({ amount: 0, rate: 0.1, round: "floor" });
  assert.deepEqual([b.baseAmount, b.taxAmount, b.totalAmount], [0, 0, 0]);
});

test("負の金額・NaN・不正な税率はエラーを投げる", () => {
  assert.throws(
    () => calcFromTaxExcluded({ amount: -1, rate: 0.1, round: "floor" }),
    /金額が無効です/,
  );
  assert.throws(
    () => calcFromTaxIncluded({ amount: NaN, rate: 0.1, round: "floor" }),
    /金額が無効です/,
  );
  assert.throws(
    () => calcFromTaxExcluded({ amount: 1000, rate: 1.5, round: "floor" }),
    /税率が無効です/,
  );
  assert.throws(
    () => calcFromTaxExcluded({ amount: 1000, rate: NaN, round: "floor" }),
    /税率が無効です/,
  );
});
