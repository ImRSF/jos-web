const path = require('path');

const fileName = "job-order";

module.exports = {
    mode: "production",
    entry: [
        '@babel/polyfill', 
        `./src/custom/jobs/${fileName}.js`
        // your app scripts should be here
    ],
    output: {  
        path: path.resolve(__dirname, 'dist/jobs'),
        filename: `${fileName}.bundle.js`
    }, 
    module: {
        rules: [{
            // Babel loader compiles ES2015 into ES5 for
            // complete cross-browser support

            loader: 'babel-loader',
            test: /\.js$/,
            // only include files present in the `src` subdirectory
            // include: [path.resolve(__dirname, "disc")],
            // exclude node_modules, equivalent to the above line 
            exclude: /node_modules/,
            options: {
                // Use the default ES2015 preset
                // to include all ES2015 features
                presets: [
                    ["@babel/env", {
                        "targets": {
                            "browsers": ["Firefox > 20", "Chrome > 40", "last 2 versions", "safari >= 7", "IE > 7"]
                        }
                    }]
                ],
                plugins: ['@babel/plugin-transform-arrow-functions', "@babel/transform-modules-commonjs"]
            }
        }]
    }
}