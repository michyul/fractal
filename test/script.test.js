const assert = require('assert');
const { parseComplex, calculateIterations } = require('../script');

// Test parseComplex with valid input
const c1 = parseComplex('-0.4+0.6i');
assert.strictEqual(c1.re, -0.4);
assert.strictEqual(c1.im, 0.6);

// Test parseComplex with invalid input defaults
const c2 = parseComplex('invalid');
assert.strictEqual(c2.re, -0.8);
assert.strictEqual(c2.im, 0.156);

// Mandelbrot iteration test: points inside set should reach max iterations
const iterCount = 50;
let i = calculateIterations(0, 0, 0, 0, iterCount);
assert.strictEqual(i, iterCount);

// Point outside the set should escape early
i = calculateIterations(2, 2, 2, 2, iterCount);
assert(i < iterCount);

console.log('All tests passed');
