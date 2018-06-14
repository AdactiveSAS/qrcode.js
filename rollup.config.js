import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
    {
        entry: 'src/qrcode.js',
        dest: pkg.browser,
        format: 'umd',
        moduleName: 'qrcode',
        plugins: [
            babel({
                exclude: ['node_modules/**']
            })
        ]
    },
    {
        entry: 'src/qrcode.js',
        external: ['qrcode-generator'],
        targets: [
            { dest: pkg.main, format: 'cjs' },
            { dest: pkg.module, format: 'es' }
        ],
        plugins: [
            babel({
                exclude: ['node_modules/**']
            })
        ]
    }
];
