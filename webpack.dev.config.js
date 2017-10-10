/**
 * Created by Kaiser on 2017/9/8
 */
const path = require('path')
const webpack = require('webpack')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const argv = require('yargs').argv;

const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const localhost = require('./webpack.public.config')
const publicPath = `${localhost.localhost}8081/`;
const outputPublicPath = './client'
let entryFilter = (str) => {
    if (argv.env === 'production') {
        return str
    }
    return [str, hotMiddlewareScript]
}
module.exports = {
    devtool: '#source-map',
    entry: {
        pagename1: entryFilter(`${outputPublicPath}/pages/page1/index.js`),
        pagename2: entryFilter(`${outputPublicPath}/pages/page2/index.js`)
    },
    output: {
        // __dirname，就是当前webpack.config.js文件所在的绝对路径
        path: path.resolve(__dirname, `./dist`), //nm输出路径，要用绝对路径
        filename: `js/[name].bundle.js`, //打包之后输出的文件名
        publicPath: `${publicPath}`
    },
    devServer: {
        contentBase: './',
        publicPath: '/js/',
        host: '0.0.0.0',
        port: 8080,
        inline: true, //可以监控js变化
        hot: true, //热启动
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                include: ["client"],
                enforce: 'pre',
                options: {
                    formatter: eslintFriendlyFormatter
                }
            }, {
                test: /\.js$/,
                // loader 用于对模块的源代码进行转换
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-2']
                }
            }, {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "postcss-loader" }
                ]
            }, {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" },
                    { loader: "postcss-loader" }
                ]
            }, {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        options: {
                            minimize: true,
                            removeComments: false,
                            collapseWhitespace: false
                        }
                    }
                }
            }, {
                test: /\.art$/,
                loader: "art-template-loader",
                options: {
                    // art-template options (if necessary)
                    // @see https://github.com/aui/art-template
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: {
                    emitError: true,
                    emitWarning: true,
                    failOnError: true,
                    failOnWarning: true
                }
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackInlineSourcePlugin(),
        // 编译输出html
        process.env.NODE_ENV === 'production' ? new HtmlWebpackPlugin({
            template: './client/pages/page1/index.html',
            filename: 'index.html',
            inject: 'head',
            chunks: ['pagename1'], // 按需打包
            excludeChunks: ['pagename2'], //不需要的JS文件
            inlineSource: '.(js|css)$', //全部内嵌
            minify: {
                removeComments: true, //去掉注释
                collapseWhitespace: true, //去掉空行
            }
        }) : () => {
            console.log('dev')
        }
    ],
    resolve: {
        extensions: ['.js', '.json', '.coffee']
    }
};
