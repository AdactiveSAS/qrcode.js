import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import uglifyEs from 'rollup-plugin-uglify-es';
import pkg from './package.json';

const configBrowser = {
    input: 'src/qrcode.js',
    output: {
        name: 'qrcode',
        file: pkg.browser,
        format: 'umd',
        globals: {
            'qrcode-generator': 'VendorQrCode'
        },
        sourcemap: true
    },
    external: ['qrcode-generator'],
    plugins: [
        babel({ exclude: ['node_modules/**'] }),
        resolve(),
        uglify(),
        commonjs()
    ]
};

const configNode = {
    input: 'src/qrcode.js',
    output: {
        name: 'qrcode',
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
    },

    external: ['qrcode-generator'],
    plugins: [
        babel({ exclude: ['node_modules/**'] }),
        resolve(),
        uglify(),
        commonjs()
    ]
};

const configModule = {
    input: 'src/qrcode.js',
    output: {
        name: 'qrcode',
        file: pkg.module,
        format: 'es',
        globals: {
            'qrcode-generator': 'VendorQrCode'
        },
        sourcemap: true
    },
    external: ['qrcode-generator'],
    plugins: [
        babel({ exclude: ['node_modules/**'] }),
        resolve(),
        uglifyEs(),
        commonjs()
    ]
};

export default [
    configBrowser,
    configModule,
    configNode
];
