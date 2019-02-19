/**
 * Created by miracle on 2017/12/18.
 */
const path = require('path');
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '/dist')
    },
    plugins: [new VueLoaderPlugin()],
    devtool: 'source-map',
    module: {
        rules: [
            /*{
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },*/
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            }
        ]
    },
    mode: "development",
    resolve: {
        extensions: [
            '.js',
            '.vue'
        ],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "/dist"),
        compress: true,
        port: 9000,
        proxy: {
            '/api': 'http://localhost:60702',
            '/es': {
                target: "http://localhost:9200",
                pathRewrite: {"^/es": ""}
            }
        }
    },
}
