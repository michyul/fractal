const assert = require('assert');
const { drawRandom } = require('../script');

function createStubCanvas(width, height) {
  const ctx = {
    createImageData(w, h) {
      return { data: new Uint8ClampedArray(w * h * 4) };
    },
    putImageData(img) {
      this.imageData = img;
    }
  };
  return {
    width,
    height,
    getContext() {
      return ctx;
    },
    ctx
  };
}

const canvas = createStubCanvas(2, 2);
drawRandom(canvas);
assert(canvas.ctx.imageData, 'imageData should be set');
const data = canvas.ctx.imageData.data;
const allZero = data.every(v => v === 0);
assert(!allZero, 'pixels should be randomized');
console.log('Random draw test passed');
