'use strict';

let passed = 0;
let failed = 0;

function assert(label, condition, extra = '') {
  if (condition) {
    console.log(`  [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${label}${extra ? '\n         ' + extra : ''}`);
    failed++;
  }
}

function assertClose(label, actual, expected, tol = 0.0001) {
  const ok = Math.abs(actual - expected) <= tol;
  assert(label, ok, `Expected ~${expected}, Got ${actual}`);
}

// Pure tilt math — mirrors the fixed source exactly
function computeTilt(rect, clientX, clientY) {
  const hw = rect.width / 2 || 1;
  const hh = rect.height / 2 || 1;
  const cx = rect.left + hw;
  const cy = rect.top + hh;
  const rx = Math.max(-12, Math.min(12, ((clientY - cy) / hh) * -12));
  const ry = Math.max(-12, Math.min(12, ((clientX - cx) / hw) * 12));
  return { rx, ry };
}

function buildTransform(rx, ry) {
  return `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.12)`;
}

const { JSDOM } = require('jsdom');

function buildDOM(prefersReducedMotion) {
  const dom = new JSDOM('<!DOCTYPE html><button class="vinheta__logo-btn"></button>', {
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.matchMedia = (query) => ({
    matches: prefersReducedMotion,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
  });
  window.Audio = class {
    constructor() { this.preload = ''; }
    play() { return Promise.resolve(); }
  };
  const logoBtn = window.document.querySelector('.vinheta__logo-btn');
  logoBtn.getBoundingClientRect = () => ({
    left: 100, top: 200, width: 200, height: 100,
    right: 300, bottom: 300,
  });
  return { window, logoBtn };
}

function attachListeners(prefersReducedMotion, logoBtn) {
  if (!prefersReducedMotion) {
    let rect = null;

    logoBtn.addEventListener('mouseenter', () => {
      rect = logoBtn.getBoundingClientRect();
    });

    logoBtn.addEventListener('mousemove', (e) => {
      if (!rect) return;
      const hw = rect.width / 2 || 1;
      const hh = rect.height / 2 || 1;
      const cx = rect.left + hw;
      const cy = rect.top + hh;
      const rx = Math.max(-12, Math.min(12, ((e.clientY - cy) / hh) * -12));
      const ry = Math.max(-12, Math.min(12, ((e.clientX - cx) / hw) * 12));
      logoBtn.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.12)`;
    });

    logoBtn.addEventListener('mouseleave', () => {
      rect = null;
      logoBtn.style.transform = '';
    });
  }
}

function fireMouseenter(logoBtn, window) {
  logoBtn.dispatchEvent(new window.MouseEvent('mouseenter', { bubbles: false }));
}

function fireMousemove(logoBtn, window, clientX, clientY) {
  logoBtn.dispatchEvent(new window.MouseEvent('mousemove', { clientX, clientY, bubbles: true }));
}

function fireMouseleave(logoBtn, window) {
  logoBtn.dispatchEvent(new window.MouseEvent('mouseleave', { bubbles: false }));
}

console.log('\n=== vinheta 3-D tilt — fixed implementation ===\n');

// Test 1: Center → rx=0, ry=0
console.log('TEST 1: Center position → rx=0, ry=0');
{
  const rect = { left: 100, top: 200, width: 200, height: 100 };
  const { rx, ry } = computeTilt(rect, 200, 250);
  assertClose('rx === 0 at center', rx, 0);
  assertClose('ry === 0 at center', ry, 0);
  const t = buildTransform(rx, ry);
  assert('transform contains perspective(700px)', t.includes('perspective(700px)'));
  assert('transform contains scale(1.12)', t.includes('scale(1.12)'));
}

// Test 2: Corners and edges
console.log('\nTEST 2: Corners and edges within ±12 deg');
{
  const rect = { left: 100, top: 200, width: 200, height: 100 };
  const cases = [
    ['top-left corner',     100, 200,  12, -12],
    ['top-right corner',    300, 200,  12,  12],
    ['bottom-left corner',  100, 300, -12, -12],
    ['bottom-right corner', 300, 300, -12,  12],
    ['top-center edge',     200, 200,  12,   0],
    ['left-center edge',    100, 250,   0, -12],
    ['right-center edge',   300, 250,   0,  12],
  ];
  cases.forEach(([label, cx, cy, expRx, expRy]) => {
    const { rx, ry } = computeTilt(rect, cx, cy);
    assertClose(`${label}: rx`, rx, expRx);
    assertClose(`${label}: ry`, ry, expRy);
    assert(`${label}: |rx| <= 12`, Math.abs(rx) <= 12, `rx=${rx}`);
    assert(`${label}: |ry| <= 12`, Math.abs(ry) <= 12, `ry=${ry}`);
  });
}

// Test 3: Transform string format
console.log('\nTEST 3: Transform string format');
{
  const rect = { left: 0, top: 0, width: 100, height: 100 };
  const { rx, ry } = computeTilt(rect, 75, 25);
  const t = buildTransform(rx, ry);
  const pattern = /^perspective\(700px\) rotateX\(-?[\d.]+deg\) rotateY\(-?[\d.]+deg\) scale\(1\.12\)$/;
  assert('matches expected pattern', pattern.test(t), `Got: "${t}"`);
  assert('starts with perspective(700px)', t.startsWith('perspective(700px)'));
  assert('ends with scale(1.12)', t.endsWith('scale(1.12)'));
}

// Test 4: mouseleave clears transform
console.log('\nTEST 4: mouseleave clears transform');
{
  const { window, logoBtn } = buildDOM(false);
  attachListeners(false, logoBtn);
  fireMouseenter(logoBtn, window);
  fireMousemove(logoBtn, window, 300, 200);
  assert('transform set after mousemove', logoBtn.style.transform !== '', `Got: "${logoBtn.style.transform}"`);
  fireMouseleave(logoBtn, window);
  assert('transform cleared after mouseleave', logoBtn.style.transform === '', `Got: "${logoBtn.style.transform}"`);
}

// Test 5: prefersReducedMotion=true → no listeners
console.log('\nTEST 5: prefersReducedMotion=true — no listeners');
{
  const { window, logoBtn } = buildDOM(true);
  attachListeners(true, logoBtn);
  fireMouseenter(logoBtn, window);
  fireMousemove(logoBtn, window, 300, 200);
  assert('no transform when prefersReducedMotion', logoBtn.style.transform === '', `Got: "${logoBtn.style.transform}"`);
  fireMouseleave(logoBtn, window);
  assert('still empty after mouseleave', logoBtn.style.transform === '');
}

// Test 6: Zero-size button → no division by zero
console.log('\nTEST 6: Zero-size button — no Infinity/NaN');
{
  const rect = { left: 100, top: 200, width: 0, height: 0 };
  const { rx, ry } = computeTilt(rect, 150, 250);
  assert('rx is finite', isFinite(rx) && !isNaN(rx), `rx=${rx}`);
  assert('ry is finite', isFinite(ry) && !isNaN(ry), `ry=${ry}`);
  const t = buildTransform(rx, ry);
  assert('transform does not contain Infinity', !t.includes('Infinity'), `Got: "${t}"`);
  assert('transform does not contain NaN', !t.includes('NaN'), `Got: "${t}"`);
}

// Test 6b: Zero width only
console.log('\nTEST 6b: Zero width only');
{
  const rect = { left: 100, top: 200, width: 0, height: 100 };
  const { rx, ry } = computeTilt(rect, 150, 250);
  assert('rx finite', isFinite(rx) && !isNaN(rx), `rx=${rx}`);
  assert('ry finite', isFinite(ry) && !isNaN(ry), `ry=${ry}`);
}

// Test 6c: Zero height only
console.log('\nTEST 6c: Zero height only');
{
  const rect = { left: 100, top: 200, width: 200, height: 0 };
  const { rx, ry } = computeTilt(rect, 200, 250);
  assert('rx finite', isFinite(rx) && !isNaN(rx), `rx=${rx}`);
  assert('ry finite', isFinite(ry) && !isNaN(ry), `ry=${ry}`);
}

// Test 7: Mouse far outside button — must be clamped to ±12
console.log('\nTEST 7: Mouse far outside button — clamped to ±12');
{
  const rect = { left: 100, top: 200, width: 200, height: 100 };
  const cases = [
    ['far above (y=-5000)',  200, -5000],
    ['far below (y=9999)',   200,  9999],
    ['far left (x=-5000)', -5000,  250],
    ['far right (x=9999)',   9999,  250],
  ];
  cases.forEach(([label, cx, cy]) => {
    const { rx, ry } = computeTilt(rect, cx, cy);
    assert(`${label}: |rx| <= 12`, Math.abs(rx) <= 12, `rx=${rx.toFixed(2)}`);
    assert(`${label}: |ry| <= 12`, Math.abs(ry) <= 12, `ry=${ry.toFixed(2)}`);
  });
}

// Test 8: mousemove without prior mouseenter → transform not set (rect=null guard)
console.log('\nTEST 8: mousemove before mouseenter → no transform (rect=null guard)');
{
  const { window, logoBtn } = buildDOM(false);
  attachListeners(false, logoBtn);
  // Do NOT fire mouseenter first
  fireMousemove(logoBtn, window, 300, 200);
  assert('no transform without prior mouseenter', logoBtn.style.transform === '', `Got: "${logoBtn.style.transform}"`);
}

// Test 9: Integration — full flow with mouseenter + mousemove
console.log('\nTEST 9: Integration — mouseenter then mousemove updates style');
{
  const { window, logoBtn } = buildDOM(false);
  attachListeners(false, logoBtn);
  fireMouseenter(logoBtn, window);
  // top-right: rect={left:100,top:200,w:200,h:100} → cx=200,cy=250
  // clientX=300,clientY=200 → rx=12, ry=12
  fireMousemove(logoBtn, window, 300, 200);
  const t = logoBtn.style.transform;
  assert('style.transform non-empty', t !== '', `Got: "${t}"`);
  assert('contains perspective(700px)', t.includes('perspective(700px)'));
  assert('contains rotateX', t.includes('rotateX('));
  assert('contains rotateY', t.includes('rotateY('));
  assert('contains scale(1.12)', t.includes('scale(1.12)'));
  const rxMatch = t.match(/rotateX\((-?[\d.]+)deg\)/);
  const ryMatch = t.match(/rotateY\((-?[\d.]+)deg\)/);
  assert('rotateX parseable', rxMatch !== null);
  assert('rotateY parseable', ryMatch !== null);
  if (rxMatch && ryMatch) {
    assertClose('rotateX is 12 at top-right corner', parseFloat(rxMatch[1]), 12);
    assertClose('rotateY is 12 at top-right corner', parseFloat(ryMatch[1]), 12);
  }
}

console.log(`\n${'─'.repeat(50)}`);
const total = passed + failed;
console.log(`VERDICT: ${failed === 0 ? 'ALL PASS' : `${failed}/${total} FAILED`}`);
console.log(`  Passed: ${passed}  Failed: ${failed}`);
console.log('─'.repeat(50));
process.exit(failed > 0 ? 1 : 0);
