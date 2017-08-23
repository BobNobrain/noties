const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	entry: {
		index: './app/pages/index.js',
		'profile/index': './app/pages/profile/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public')
	},

	module: {
		rules: [
			{ test: /\.handlebars$/, loader: "handlebars-loader" }
		]
	},

	plugins: [
		new CleanWebpackPlugin(['public']),
		new HtmlWebpackPlugin({
			inject: 'head',
			template: './app/pages/index.handlebars',
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			inject: 'head',
			template: './app/pages/profile/index.handlebars',
			filename: 'profile/index.html',
			chunks: ['profile/index']
		})
	]
};

module.exports = config;
