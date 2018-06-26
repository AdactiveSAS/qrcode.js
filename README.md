# qrcode.es
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
import { qrcode, modes, ecLevel } from 'qrcode.es';
    
const qrCodeSetting = {
    size: 400,
    ecLevel: ecLevel.QUARTILE,
    minVersion: 8,
    background: '#fff',
    mode: modes.DRAW_WITH_IMAGE_BOX,
    radius: 0.5,
    image: 'https://raw.githubusercontent.com/AdactiveSAS/qrcode.js/master/adactiveLogo.jpg',
    mSize: 0.15,
};

const element = document.getElementById("qrCode"); //Element must be an instance of HTMLCanvasElement or HTMLDivElement
const qrCode = new qrcode(element); //Initializing the QrCode
await qrCode.generate('https://adactive.com', qrCodeSetting); // Function that generates the QrCode
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
            const element = document.getElementById("qrCode"); //Element must be an instance of HTMLCanvasElement or HTMLDivElement
            const qrCode = new QrCode.qrcode(element);

            const qrCodeSetting = {
                size: 400,
                ecLevel: QrCode.ecLevel.QUARTILE,
                minVersion: 8,
                background: '#fff',
                mode: QrCode.MODES.DRAW_WITH_IMAGE_BOX,
                radius: 0.5,
                image: image,
                mSize: 0.15,
            };

            let qrCodeImageUrl = null;

            qrCode.generate('https://adactive.com', qrCodeSetting)
                .then(() => {
                    qrCodeImageUrl = qrCode.getImage();
                    console.log("[IMAGE URL] : ", qrCodeImageUrl);
                });

        </script>
    </body>
</html>

```

## API

```javascript
constructor (element: instance of HTMLDivElement | instance of HTMLCanvasElement): qrcode
fucntion generate(text: string, options: Object): Promise
function getImage(): string
```

## Options

| Name       | Type   | Default    | Description                                                     |
| ---------- | ------ | ---------- | --------------------------------------------------------------- |
| minVersion | number | 1          | Version Range: Minimum 1*                                       |
| maxVersion | number | 40         | Version Range: Maximum 40*                                      |
| ecLevel    | string | 'H'        | Error Correction Level*                                         |
| size       | number | 500        | Size of QrCode in pixel                                         |
| fill       | string | '#000'     | Color of Module in Color Code                                   |
| background | string | null       | Background color or `null` for transparent background           |
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

**Modules**

QrCode Modules refers to the black and white dots that make up the QrCode.

**Version**

[QrCode version](http://www.qrcode.com/en/about/version.html) ranges from 1 - 40 where which version has a different number of modules. Each higher version consists of a higher number of modules which allows the QrCode to contain more data.

**Error Correction Level (ecLevel)**

QR Code has [error correction](http://www.qrcode.com/en/about/error_correction.html) capability to restore data if the code is dirty or damaged. Four error correction levels are available for users to choose according to the operating environment.


##Enums
### ecLevel

| Name     | Level | Error Correction Capability |
| -------- | ---   | --------------------------- |
| LOW      | 'L'   | ~7%                         |
| MEDIUM   | 'M'   | ~15%                        |
| QUARTILE | 'Q'   | ~25%                        |
| HIGH     | 'H'   | ~30%                        |

### Modes

| Name                  | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| NORMAL                | To generate a default QrCode                                      |
| DRAW_WITH_LABEL_STRIP | To add a label with a white strip taking the width of the QrCode  |
| DRAW_WITH_LABEL_BOX   | To add a label base on the length of text on the QrCode           |
| DRAW_WITH_IMAGE_STRIP | To add an image with a white strip taking the width of the QrCode |
| DRAW_WITH_IMAGE_BOX   | To add an image base on the image width on the QrCode             |


## License
MIT License (MIT)

The word "QR Code" is registered trademark of DENSO WAVE INCORPORATED 

http://www.denso-wave.com/qrcode/faqpatent-e.html

## Special Thanks
This library is greatly inspired by [Lars Jung, Author of jquery-qrcode](https://github.com/lrsjng/jquery-qrcode).

Thanks to [Kazuhiko Arase](https://github.com/kazuhikoarase/qrcode-generator) for original QrCode generation.
