'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry : [
		'./public/main.js'
	],
	output:{
		path: path.resolve(__dirname, 'dist'),
		filename: path.join('assets', 'js', 'bundle.js'),
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query:{
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
				test: /\.(s)?css&/,
				loader: 'style-loader!css-loader!sass-loader'
			}
		]
	},
	resolve:{
		alias : {}
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
