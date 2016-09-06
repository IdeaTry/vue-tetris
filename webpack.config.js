var fs = require('fs');
var argv = require('yargs').argv;
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var pkg = require('./package.json');

// 根据 src/page 目录生成html插件配置
var plugins = [],
    entry = {},
    basePath = './src/page';

// 遍历api目录，读取每一个文件
// 遍历文件中定义的每一个路由，以 /api/文件名/路由名 为路径加载路由
fs.readdirSync(basePath).forEach(function(name) {
    
    var dirPath = basePath + '/' + name,
        templatePath = dirPath + '/index.html',
        opts,
        tplName;

    if(!fs.statSync(dirPath).isDirectory()) return;

    opts = {
        chunks: [name],
        filename: name + '.html'
    };

    // 检查模板文件是否存在
    if(fs.existsSync(templatePath)) {
        opts.template = templatePath;
    };
    
    plugins.push(new HtmlWebpackPlugin(opts));
    entry[name] = dirPath;
});

// 是否压缩代码
if(argv.u || pkg.uglify){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    }))
};

// 导出 webpack 配置
module.exports = {

    // 插件
    plugins: [
        new ExtractTextPlugin("[name].css")
    ].concat(plugins),

    // 入口文件
    entry: Object.assign({}, entry),

    // 输出文件
    output: {
        path: __dirname + '/build/',
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    module: {
        //加载器配置
        loaders: [
            { 
                test: /\.js$/, 
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015'],
                    plugins: ["transform-object-assign"]
                }
            },
            { 
                test: /\.css$/, 
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.woff(2)?(\?|\=|\#|\&|\w|\d)*$/,
                loader: "url-loader?limit=1024&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?|\=|\#|\&|\w|\d)*$/,
                loader: "file-loader"
            },
            {   
                test: /\.styl$/, 
                loader: 'style-loader!css-loader!stylus-loader' 
            },
            { 
                test: /\.json$/, 
                loader: 'json-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            //
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    }
};