const path = require('path');

module.exports = {
    entry: {
        'skale': './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        library: 'skale'
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
                // loader: 'ts-loader'
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: {
                    loader: 'source-map-loader'
                }
            }
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader'
            //     }
            // }
        ]
    },
    performance: {hints: false}
};
