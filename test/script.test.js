const assert = require('assert');
const { parseComplex, calculateIterations, drawRandom } = require('../script');

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

// Fake canvas implementation for drawRandom test
class FakeContext {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.imageData = null;
    }
    createImageData(width, height) {
        return { data: new Uint8ClampedArray(width * height * 4) };
    }
    putImageData(imageData) {
        this.imageData = imageData;
    }
}

class FakeCanvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ctx = new FakeContext(width, height);
    }
    getContext(type) {
        return this.ctx;
    }
}

const canvas = new FakeCanvas(2, 2);
drawRandom(canvas);
const pixelData = canvas.ctx.imageData.data;
assert(Array.from(pixelData).some(v => v !== 0), 'drawRandom should populate pixel data');

console.log('All tests passed');
