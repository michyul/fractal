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

function hsvToRgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5) * 255, f(3) * 255, f(1) * 255];
}

function randomJuliaConstant() {
    // Random value in a visually interesting range
    const re = (Math.random() - 0.5) * 2;
    const im = (Math.random() - 0.5) * 2;
    return { re, im };
}

function formatComplex(c) {
    return `${c.re.toFixed(3)}${c.im >= 0 ? '+' : ''}${c.im.toFixed(3)}i`;
}

let mandelbrotSeed = { centerX: 0, centerY: 0, zoom: 1 };

function randomizeMandelbrotSeed() {
    // Slightly randomize center and zoom for each render
    mandelbrotSeed.centerX = (Math.random() - 0.5) * 2;
    mandelbrotSeed.centerY = (Math.random() - 0.5) * 2;
    mandelbrotSeed.zoom = 0.5 + Math.random() * 1.5;
}

function draw() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    const type = document.getElementById('fractal-type').value;
    const iterCount = parseInt(document.getElementById('iterations').value, 10);
    let juliaC;

    if (type === 'julia') {
        // Randomize Julia constant and update input
        juliaC = randomJuliaConstant();
        document.getElementById('julia-c').value = formatComplex(juliaC);
    } else {
        // Mandelbrot: randomize seed
        randomizeMandelbrotSeed();
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let zx, zy, cx, cy;
            if (type === 'julia') {
                zx = (x - width / 2) * 4 / width;
                zy = (y - height / 2) * 4 / width;
                cx = juliaC.re;
                cy = juliaC.im;
            } else {
                // Mandelbrot: use randomized center and zoom
                zx = mandelbrotSeed.centerX + (x - width / 2) * (4 / mandelbrotSeed.zoom) / width;
                zy = mandelbrotSeed.centerY + (y - height / 2) * (4 / mandelbrotSeed.zoom) / width;
                cx = zx;
                cy = zy;
            }

            const i = calculateIterations(zx, zy, cx, cy, iterCount);
            const pixelIndex = (y * width + x) * 4;
            if (i === iterCount) {
                // Inside set: black
                imageData.data[pixelIndex] = 0;
                imageData.data[pixelIndex + 1] = 0;
                imageData.data[pixelIndex + 2] = 0;
            } else {
                // Colorful gradient
                const hue = 360 * i / iterCount;
                const rgb = hsvToRgb(hue, 1, 1);
                imageData.data[pixelIndex] = rgb[0];
                imageData.data[pixelIndex + 1] = rgb[1];
                imageData.data[pixelIndex + 2] = rgb[2];
            }
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
