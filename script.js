function parseComplex(str) {
    const match = str.match(/([+-]?\d*\.?\d+)([+-]\d*\.?\d+)i/);
    if (!match) {
        return { re: -0.8, im: 0.156 };
    }
    return { re: parseFloat(match[1]), im: parseFloat(match[2]) };
}

function calculateIterations(zx, zy, cx, cy, iterCount) {
    let i = 0;
    while (zx * zx + zy * zy <= 4 && i < iterCount) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        i++;
    }
    return i;
}

function drawRandom() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = Math.floor(Math.random() * 256);
        imageData.data[i + 1] = Math.floor(Math.random() * 256);
        imageData.data[i + 2] = Math.floor(Math.random() * 256);
        imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
}

function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    const mode = document.getElementById('mode').value;
    if (mode === 'random') {
        drawRandom();
        return;
    }

    const type = document.getElementById('fractal-type').value;
    const iterCount = parseInt(document.getElementById('iterations').value, 10);
    const juliaC = parseComplex(document.getElementById('julia-c').value);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let zx = (x - width / 2) * 4 / width;
            let zy = (y - height / 2) * 4 / width;
            let cx = zx;
            let cy = zy;
            if (type === 'julia') {
                cx = juliaC.re;
                cy = juliaC.im;
            }

            const i = calculateIterations(zx, zy, cx, cy, iterCount);

            const pixelIndex = (y * width + x) * 4;
            const color = i === iterCount ? 0 : 255 - Math.floor(255 * i / iterCount);
            imageData.data[pixelIndex] = color;
            imageData.data[pixelIndex + 1] = color;
            imageData.data[pixelIndex + 2] = color;
            imageData.data[pixelIndex + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

if (typeof document !== 'undefined') {
    document.getElementById('render').addEventListener('click', draw);
    window.addEventListener('load', draw);
}

if (typeof module !== 'undefined') {
    module.exports = { parseComplex, calculateIterations };
}
