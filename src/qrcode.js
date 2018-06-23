import VendorQrCode from 'qrcode-generator';
import defaultOptions from './defaultOptions';

function drawBackgroundLabel(qr, context, settings) {
    const {
        size, mSize, fontname, label, mPosX, mPosY, mode, fontcolor
    } = settings;

    const font = `bold ${mSize * size}px ${fontname}`;
    const ctx = context;

    ctx.font = font;

    const w = ctx.measureText(label).width;
    const sh = mSize;
    const sw = w / size;
    const sl = (1 - sw) * mPosX;
    const st = (1 - sh) * mPosY;
    const sr = sl + sw;
    const sb = st + sh;
    const pad = 0.01;

    if (mode === 1) {
        // Strip
        qr.addBlank(0, st - pad, size, sb + pad);
    } else {
        // Box
        qr.addBlank(sl - pad, st - pad, sr + pad, sb + pad);
    }

    context.fillStyle = fontcolor;
    context.font = font;
    context.fillText(label, sl * size, st * size + 0.75 * mSize * size);
}

function drawBackgroundImage(qr, context, settings) {
    const {
        size, image, mSize, mPosX, mPosY, mode
    } = settings;

    const w = image.naturalWidth || 1;
    const h = image.naturalHeight || 1;
    const sh = mSize;
    const sw = sh * w / h;
    const sl = (1 - sw) * mPosX;
    const st = (1 - sh) * mPosY;
    const sr = sl + sw;
    const sb = st + sh;
    const pad = 0.01;

    if (mode === 3) {
        // Strip
        qr.addBlank(0, st - pad, size, sb + pad);
    } else {
        // Box
        qr.addBlank(sl - pad, st - pad, sr + pad, sb + pad);
    }

    context.drawImage(image, sl * size, st * size, sw * size, sh * size);
}

function drawBackground(qr, context, settings) {
    const {
        background, size, mode
    } = settings;

    if (background) {
        context.fillStyle = background;
        context.fillRect(0, 0, size, size);
    }

    if (mode === 1 || mode === 2) {
        drawBackgroundLabel(qr, context, settings);
    } else if (mode === 3 || mode === 4) {
        drawBackgroundImage(qr, context, settings);
    }
}

function drawModuleDefault(qr, context, settings, left, top, width, row, col) {
    if (qr.isDark(row, col)) {
        context.rect(left, top, width, width);
    }
}

function drawModuleRoundedDark(ctx, l, t, r, b, rad, nw, ne, se, sw) {
    if (nw) {
        ctx.moveTo(l + rad, t);
    } else {
        ctx.moveTo(l, t);
    }

    if (ne) {
        ctx.lineTo(r - rad, t);
        ctx.arcTo(r, t, r, b, rad);
    } else {
        ctx.lineTo(r, t);
    }

    if (se) {
        ctx.lineTo(r, b - rad);
        ctx.arcTo(r, b, l, b, rad);
    } else {
        ctx.lineTo(r, b);
    }

    if (sw) {
        ctx.lineTo(l + rad, b);
        ctx.arcTo(l, b, l, t, rad);
    } else {
        ctx.lineTo(l, b);
    }

    if (nw) {
        ctx.lineTo(l, t + rad);
        ctx.arcTo(l, t, r, t, rad);
    } else {
        ctx.lineTo(l, t);
    }
}

function drawModuleRoundendLight(ctx, l, t, r, b, rad, nw, ne, se, sw) {
    if (nw) {
        ctx.moveTo(l + rad, t);
        ctx.lineTo(l, t);
        ctx.lineTo(l, t + rad);
        ctx.arcTo(l, t, l + rad, t, rad);
    }

    if (ne) {
        ctx.moveTo(r - rad, t);
        ctx.lineTo(r, t);
        ctx.lineTo(r, t + rad);
        ctx.arcTo(r, t, r - rad, t, rad);
    }

    if (se) {
        ctx.moveTo(r - rad, b);
        ctx.lineTo(r, b);
        ctx.lineTo(r, b - rad);
        ctx.arcTo(r, b, r - rad, b, rad);
    }

    if (sw) {
        ctx.moveTo(l + rad, b);
        ctx.lineTo(l, b);
        ctx.lineTo(l, b - rad);
        ctx.arcTo(l, b, l + rad, b, rad);
    }
}

function drawModuleRounded(qr, context, settings, left, top, width, row, col) {
    const { isDark } = qr;
    const right = left + width;
    const bottom = top + width;
    const radius = settings.radius * width;
    const rowT = row - 1;
    const rowB = row + 1;
    const colL = col - 1;
    const colR = col + 1;
    const center = isDark(row, col);
    const northwest = isDark(rowT, colL);
    const north = isDark(rowT, col);
    const northeast = isDark(rowT, colR);
    const east = isDark(row, colR);
    const southeast = isDark(rowB, colR);
    const south = isDark(rowB, col);
    const southwest = isDark(rowB, colL);
    const west = isDark(row, colL);

    if (center) {
        drawModuleRoundedDark(context, left, top, right, bottom, radius, !north && !west, !north && !east, !south && !east, !south && !west);
    } else {
        drawModuleRoundendLight(
            context, left, top, right, bottom, radius, north && west && northwest, north && east && northeast,
            south && east && southeast, south && west && southwest
        );
    }
}

function drawModules(qr, context, settings) {
    const { moduleCount } = qr;
    const {
        size, radius, fill
    } = settings;

    const moduleSize = size / moduleCount;
    let fn = drawModuleDefault;
    let row;
    let col;

    if (radius > 0 && radius <= 0.5) {
        fn = drawModuleRounded;
    }

    context.beginPath();
    for (row = 0; row < moduleCount; row += 1) {
        for (col = 0; col < moduleCount; col += 1) {
            const l = col * moduleSize;
            const t = row * moduleSize;
            const w = moduleSize;

            fn(qr, context, settings, l, t, w, row, col);
        }
    }

    context.fillStyle = fill;
    context.fill();
}

function createQRCode(text, level, version, quiet) {
    const qr = {};

    const vqr = new VendorQrCode(version, level);
    vqr.addData(text);
    vqr.make();
    quiet = quiet || 0;

    const qrModuleCount = vqr.getModuleCount();
    const quietModuleCount = vqr.getModuleCount() + 2 * quiet;

    function isDark(row, col) {
        row -= quiet;
        col -= quiet;

        if (row < 0 || row >= qrModuleCount || col < 0 || col >= qrModuleCount) {
            return false;
        }
        return vqr.isDark(row, col);
    }

    function addBlank(l, t, r, b) {
        const prevIsDark = qr.isDark;
        const moduleSize = 1 / quietModuleCount;

        qr.isDark = function qrIsDark(row, col) {
            const ml = col * moduleSize;
            const mt = row * moduleSize;
            const mr = ml + moduleSize;
            const mb = mt + moduleSize;

            return prevIsDark(row, col) && (l > mr || ml > r || t > mb || mt > b);
        };
    }

    qr.text = text;
    qr.level = level;
    qr.version = version;
    qr.moduleCount = quietModuleCount;
    qr.isDark = isDark;
    qr.addBlank = addBlank;

    return qr;
}

function createMinQRCode(text, level, minVersion, maxVersion, quiet) {
    minVersion = Math.max(1, minVersion || 1);
    maxVersion = Math.min(40, maxVersion || 40);
    for (let version = minVersion; version <= maxVersion; version += 1) {
        try {
            return createQRCode(text, level, version, quiet);
        } catch (err) {
            console.log(err);
        }
    }

    throw new Error('Unable to generate QrCode');
}

function drawOnCanvas(element, text, options, imageElement = null) {
    return new Promise((resolve) => {
        const settings = { ...options, image: imageElement };

        element.width = settings.size;
        element.height = settings.size;

        const qr = createMinQRCode(text, settings.ecLevel, settings.minVersion, settings.maxVersion, settings.quiet);

        if (!qr) {
            resolve(null);
        }

        const context = element.getContext('2d');

        drawBackground(qr, context, settings);
        drawModules(qr, context, settings);

        resolve(element);
    });
}

function loadImage(element, text, options) {
    return new Promise((resolve, reject) => {
        const { image } = options;
        const imageElement = new Image();

        imageElement.addEventListener('load', () => {
            drawOnCanvas(element, text, options, imageElement).then(() => resolve());
        });
        imageElement.addEventListener('error', (e) => {
            console.log(e);
            reject(new Error('Please provide a valid image'));
        });

        if (image && typeof image === 'string') {
            imageElement.src = image;
        } else {
            reject(new TypeError('Please provide a url to an image for Mode DRAW_WITH_IMAGE_STRIP and DRAW_WITH_IMAGE_BOX'));
        }
    });
}

class qrcode {
    constructor(element) {
        this.element = null;
        this.canvasElement = null;
        this.image = null;

        if (!(element instanceof HTMLDivElement || element instanceof HTMLCanvasElement)) {
            throw new TypeError('Please provide a div element or canvas element render a qrCode canvas');
        }

        if (element && element instanceof HTMLDivElement) {
            this.element = element;
            this.canvasElement = document.createElement('canvas');
            this.element.appendChild(this.canvasElement);
        } else if (element && element instanceof HTMLCanvasElement) {
            this.canvasElement = element;
        }
    }

    /**
     * Method to generate QrCode
     * @param opts
     * @returns {null|*}
     */
    generate(text, opts) {
        let promise = Promise.resolve();
        const options = Object.assign(defaultOptions, opts);

        if (this.canvasElement && (options.mode === 3 || options.mode === 4)) {
            promise = promise.then(() => loadImage(this.canvasElement, text, options));
        } else if (this.canvasElement) {
            promise = promise.then(() => drawOnCanvas(this.canvasElement, text, options));
        }

        promise = promise.then(() => {
            try {
                this.image = this.canvasElement.toDataURL();
            } catch (err) {
                console.log(err);
            }
        });

        return promise;
    }

    getImage() {
        return this.image;
    }
}

export default qrcode;
