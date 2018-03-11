const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin")

const config = require("./config");
let HTMLPlugins = [];
let Entries = {}

config.HTMLDirs.forEach((page,index) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        //生成的文件名
        filename: `${page}.html`,
        //根据自己的指定的模板文件来生成特定的 html 文件
        template: path.resolve(__dirname, `../app/html/${page}.html`),
        //生成html的title
        title:'hello'+page,
        //生成的favicon.ico
        //给生成的 js 文件一个独特的 hash 值,是文件名后带？的那个hash,output中的[chunkhash]是文件名中带hash
        hash:true,
        //chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
        //chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
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