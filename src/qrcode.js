import VendorQrCode from 'qrcode-generator';
import defaultOptions from './defaultOptions';

export const MODES = {
    NORMAL: 0,
    DRAW_WITH_LABEL_STRIP: 1,
    DRAW_WITH_LABEL_BOX: 2,
    DRAW_WITH_IMAGE_STRIP: 3,
    DRAW_WITH_IMAGE_BOX: 4,
};

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
        background, left, top, size, mode
    } = settings;

    if (background) {
        context.fillStyle = background;
        context.fillRect(left, top, size, size);
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
        drawModuleRoundendLight(context, left, top, right, bottom, radius, north && west && northwest, north && east && northeast, south && east && southeast, south && west && southwest);
    }
}

function drawModules(qr, context, settings) {
    const { moduleCount } = qr;
    const {
        size, radius, left, top, fill
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
            const l = left + col * moduleSize;
            const t = top + row * moduleSize;
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

        qr.isDark = function (row, col) {
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
        } catch (err) { /* empty */ }
    }
    return undefined;
}

function drawOnCanvas(element, options, imageElement = null) {
    const settings = { ...options, image: imageElement };
    console.log('[CHECKING ELEMENT IN DRAW CANVAS] : ', element, options, imageElement);

    element.width = settings.size;
    element.height = settings.size;

    const qr = createMinQRCode(settings.text, settings.ecLevel, settings.minVersion, settings.maxVersion, settings.quiet);

    if (!qr) {
        return null;
    }

    const context = element.getContext('2d');

    drawBackground(qr, context, settings);
    drawModules(qr, context, settings);

    return element;
}

function loadImage(element, options) {
    const { image } = options;
    const imageElement = new Image();

    imageElement.addEventListener('load', () => drawOnCanvas(element, options, imageElement));
    imageElement.addEventListener('error', () => {
        throw new Error('Please provide a valid image');
    });

    if (image && typeof image === 'string') {
        imageElement.src = image;
    } else {
        throw new Error('An Image is required for Mode 3 and Mode 4');
    }
}

function createCanvas(element, options) {
    const { mode } = options;

    if (mode === 3 || mode === 4) {
        return loadImage(element, options);
    }
    return drawOnCanvas(element, options);
}

class qrcode {
    constructor(ele) {
        this.element = ele;
    }

    /**
     * Returns a Promise resolved when done with the canvas element
     * @returns {*}
     */
    generate(opts) {
        if (!(this.element.tagName === 'DIV' || this.element.tagName === 'CANVAS')) {
            console.log(`[You provided an ${this.element.tagName} element]`);
            throw new Error('Please provide a div element or canvas element render a qrCode canvas');
        }

        const options = Object.assign(defaultOptions, opts);

        if (this.element && this.element.tagName === 'DIV') {
            const newCanvasElement = document.createElement('canvas');
            createCanvas(newCanvasElement, options);
            this.element.appendChild(newCanvasElement);
        } else if (this.element && this.element.tagName === 'CANVAS') {
            this.element = createCanvas(this.element, options);
        }
        return this.element;
    }
}

export default qrcode;
