// Build plugins
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// Serve plugins
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import html from 'rollup-plugin-html';
import json from '@rollup/plugin-json';

import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

const banner = `/**
 * Copyright (C) ${new Date().getFullYear()} by ${pkg.author} - All Rights Reserved
 * @name ${pkg.name}
 * @author Videsk
 * @license ${pkg.license}
 * Written by ${pkg.author}
 * Date ${Date.now()}
 *
 * ${pkg.description}
 * 
 * Do not copy this code.
*/`;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                shell: true
            });
            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

const defaultPlugins = [
    html({ include: './src/**/*.html' }),
    json(),
    postcss({ inject: false }),
    resolve({ browser: true }),
    commonjs(),
]

const configBuild = [
    {
        input: 'src/index.js',
        output: [
            {
                file: 'dist/component.js',
                format: 'iife',
                sourcemap: !production,
                strict: false,
                banner,
            },
        ],
        plugins: defaultPlugins,
    }
];

const configDev = [{
    input: 'src/index.js',
    output: [
        {
            file: 'public/bundle.js',
            format: 'iife',
            sourcemap: true,
            strict: false,
        },
    ],
    plugins: [
        ...defaultPlugins,
        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),
        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),
    ],
    watch: {
        clearScreen: true
    }
}];

export default (process.env.NODE_ENV === 'production') ? configBuild : configDev;
