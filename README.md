# qrcode.js
![license](https://img.shields.io/github/license/mashape/apistatus.svg)
![circleCi](https://circleci.com/gh/AdactiveSAS/qrcode.js.svg?style=shield&circle-token=:circle-token)

<p align="center">
  <a href="http://adactive.com">
    <img alt="babel" src="https://user-images.githubusercontent.com/8574893/41667613-f9636b62-74df-11e8-9b9a-981f86a2a521.png">
  </a>
</p>

## Introduction
qrCode.js is a web based QrCode generation library in javascript. It extends the functionality of [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator). 

## Getting started

```javascript
    npm i qrcode.es
```
OR
```javascript
    yarn add qrcode.es
```

## Usage

### ES6 Modules
```javascript
import QrCode, {MODES} from 'qrcode.es';
    
const qrCodeSetting = {
    size: 400,
    minVersion: 8,
    text: 'http://adactive.com/',
    background: '#fff',
    mode: MODES.DRAW_WITH_IMAGE_BOX,
    radius: 0.5,
    image: 'https://raw.githubusercontent.com/AdactiveSAS/qrcode.js/master/adactiveLogo.jpg',
    mSize: 0.15,
};

const ele = document.getElementById("qrCode"); //Element must be an instance of HTMLCanvasElement or HTMLDivElement
const qrCode = new QrCode(ele); //Initializing the QrCode
await qrCode.generate(qrCodeSetting); // Function that generates the QrCode
let image = this.qrCode.getImage(); // Function to get the data Url of the QrCode Image

```

### Browser
```html
<!DOCTYPE html>
<html>
    <head>
        <style>
            html, body {
                height: 100%;
                width: 100%;
                position: relative;
                margin: 0;
                overflow: hidden;
            }
        </style>
    </head>
    <body>
        <div id="qrCode"></div>

        <!-- Assuming node_modules is located in parent directory -->
        <script src="../node_modules/qrcode.umd.js"></script>
        <script type="application/javascript">

            const image = './assets/logo.jpg'; // To modify path to the image url
            const ele = document.getElementById("qrCode"); //Element must be an instance of HTMLCanvasElement or HTMLDivElement
            const qrCode = new QrCode.qrcode(ele);

            const qrCodeSetting = {
                size: 400,
                minVersion: 8,
                text: 'http://adactive.com/',
                background: '#fff',
                mode: QrCode.MODES.DRAW_WITH_IMAGE_STRIP,
                radius: 0.5,
                image: image,
                mSize: 0.15,
            };

            let qrCodeImageUrl = null;

            qrCode.generate(qrCodeSetting)
                .then(() => {
                    qrCodeImageUrl = qrCode.getImage();
                    console.log("[IMAGE URL] : ", qrCodeImageUrl);
                });

        </script>
    </body>
</html>

```

## Functions

```javascript
fucntion generate(ele: HTMLCanvasElement | HTMLDivElement): Promise
function getImage(): string
```

## Options

| Name       | Type   | Default    | Description                                                     |
| ---------- | ------ | ---------- | --------------------------------------------------------------- |
| minVersion | number | 1          | Version Range: Minimum 1                                        |
| maxVersion | number | 40         | Version Range: Maximum 40                                       |
| ecLevel    | string | 'H'        | Error Correction Level                                          |
| left       | number | 0          | Offset in pixel on existing Canvas Element                      |
| top        | number | 0          | Offset in pixel on existing Canvas Element                      |
| size       | number | 500        | Size of QrCode in pixel                                         |
| fill       | string | '#000'     | Color of Module in Color Code                                   |
| background | string | null       | Background color or `null` for transparent elements             |
| text       | string | 'no text'  | Content of QrCode                                               |
| radius     | number | 0          | Corner radius relative to module width: Range from 0.0 to 0.5   |
| quiet      | number | 0          | Quiet zone in modules (White border around the QrCode)          |
| mode       | number | 0          | Mode of QrCode - Refer to the end of table for more information |
| mSize      | number | 0.3        | Size of Label or Image                                          |
| mPosX      | number | 0.5        | Position of Label or Image on x-Axis                            |
| mPosY      | number | 0.5        | Position of Label or Image on y-Axis                            |
| fontname   | string | 'sans'     | Font Name to be used                                            |
| fontcolor  | string | '#000'     | Font Colour in Color Code                                       |
| label      | string | 'no label' | Label used for Mode with Label                                  |
| image      | string | null       | Image used for Mode with Image                                  | 

```javascript
//Modes available for drawing of QrCode
const MODES = {
    NORMAL: 0,
    DRAW_WITH_LABEL_STRIP: 1,
    DRAW_WITH_LABEL_BOX: 2,
    DRAW_WITH_IMAGE_STRIP: 3,
    DRAW_WITH_IMAGE_BOX: 4,
};

//Default Options
const options = {
    minVersion: 1,
    maxVersion: 40,
    ecLevel: 'H',
    left: 0,
    top: 0,
    size: 500,
    fill: '#000',
    background: null,
    text: 'no text',
    radius: 0,
    quiet: 0,
    mode: 0,
    mSize: 0.3,
    mPosX: 0.5,
    mPosY: 0.5,
    label: 'no label',
    fontname: 'sans',
    fontcolor: '#000',
    image: null,
};
```

## License
MIT License (MIT)

The word "QR Code" is registered trademark of DENSO WAVE INCORPORATED 

http://www.denso-wave.com/qrcode/faqpatent-e.html

## Special Thanks
This library is greatly inspired by [Lars Jung, Author of jquery-qrcode](https://github.com/lrsjng/jquery-qrcode).

Thanks to [Kazuhiko Arase](https://github.com/kazuhikoarase/qrcode-generator) for original QrCode generation.
