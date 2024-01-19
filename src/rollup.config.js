const typescript = require("@rollup/plugin-typescript");
const progress = require("rollup-plugin-progress");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const copy = require('rollup-plugin-copy');
const path = require('path');
const terser = require("@rollup/plugin-terser");

const config_d = {
    folder: "WolfGirl",
    input: "WolfGirl.ts",
    output: "main.js",
    loader: "loader.user.js",
}

const relative_dir = path.relative(".", __dirname).replace(/\\/g, "/");

const plugins_debug = deploy => [
    copy({
        targets: [
            { 
                src: `${relative_dir}/${config_d.loader}`, 
                dest: `public/${config_d.folder}`,
                transform: (contents, filename) =>
                    contents.toString().replace("__DEPLOY_SITE__", `${deploy}/${config_d.folder}/${config_d.output}` )
            }, {
                src: `${relative_dir}/assets/*`,
                dest: `public/${config_d.folder}/assets`
            }
        ]
    }),
    progress({ clearLine: true }),
    resolve({ browser: true }),
    typescript({ tsconfig: `${relative_dir}/tsconfig.json`, inlineSources: true }),
    commonjs(),
]

const plugins =  deploy => plugins_debug(deploy).concat([terser()]);

const config_default = {
    input: `${relative_dir}/${config_d.input}`,
    output: {
        file: `public/${config_d.folder}/${config_d.output}`,
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true
}

module.exports = cliArgs => {
    if (cliArgs.configDebug === true) {
        return { ...config_default, plugins: plugins_debug(cliArgs.configDeploy) };
    }
    return { ...config_default, plugins: plugins(cliArgs.configDeploy) };
};