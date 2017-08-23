const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	entry: {
		// only static pages should go here
		'/': './app/pages/index.js',
		'profile/': './app/pages/profile/index.js'
	},
	output: {
		filename: '[name]bundle.js',
		path: path.resolve(__dirname, 'public')
	},

	module: {
		rules: [
			{
				test: /\.handlebars$/,
				loader: "handlebars-loader",
				query: {
					partialDirs: [
						path.join(__dirname, 'app', 'templates')
					]
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(['public']),
		new HtmlWebpackPlugin({
			inject: false,
			template: './app/pages/index.handlebars',
			filename: 'index.html',
			chunks: ['/']
		}),
		new HtmlWebpackPlugin({
			inject: false,
			template: './app/pages/profile/index.handlebars',
			filename: 'profile/index.html',
			chunks: ['profile/index']
		})
	]
};

module.exports = config;
