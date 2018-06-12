const path = require('path');
const webpack = require('webpack');
const NodeExternals = require('webpack-node-externals');


module.exports = {
        entry: {
            app: './index.js'
        },

        target: 'node',

        node: {
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false,
        },

        externals: [NodeExternals()],


        output: {
            path: path.resolve(__dirname, "bin"), // string
            filename: './[name].js'
        },
    };