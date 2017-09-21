'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pkg = require("./package.json")


module.exports = {
	entry: {
		// './public/main.js',
		// './node_modules/antd/dist/antd.less'
		vendor: Object.keys(pkg.dependencies),
		app: './public/main.js'

},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: path.join('assets', 'js', '[name].bundle.[chunkhash].js'),
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					// presets: [
					// 	['es2015', {
					// 		'modules': false,
					// 		'targets': {}
					// 	}],
					// 	['react', {}]
					// ]
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader',
			}
		]
	},
	resolve: {
		alias: {}
	},
	plugins: [
		new CleanWebpackPlugin('dist'),
		new webpack.LoaderOptionsPlugin({
			debug: true
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, 'public/index.html')
		})
	]
};
