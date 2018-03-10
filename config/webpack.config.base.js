const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin")

const config = require("./config");
let HTMLPlugins = [];
let Entries = {}

config.HTMLDirs.forEach((page,index) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `../app/html/${page}.html`),
        chunks: [page, 'commons'],
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `../app/js/${page}.js`);
})

module.exports = {
    entry: Entries,
    devtool: 'cheap-module-source-map',
    output:{
        filename:"js/[name].bundle.[chunkhash].js",
        path:path.resolve(__dirname,"../dist")
    },
    module: {
        rules: [
            { // 对 css 后缀名进行处理
                test: /\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /node_modules/,
                // 抽取 css 文件到单独的文件夹
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    publicPath: config.cssPublicPath,
                    // options:{
                    //
                    //     outputPath:config.cssOutputPath
                    // },

                    use: [
                        {loader: "css-loader", options: {minimize: true,}},
                        {loader: "postcss-loader",}]
                })

            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {loader: "file-loader", options: {name: "[name].[ext]", outputPath: config.imgOutputPath}}
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use:["file-loader"]
            }


        ]
    },
    plugins: [
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(["dist"]),
        // 将 css 抽取到某个文件夹
        new ExtractTextPlugin(config.cssOutputPath),
        // 自动生成 HTML 插件
        ...HTMLPlugins


    ]
}