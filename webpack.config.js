const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const sitemap = [
	{ name: '/', entry: 'index.js' },
	{ name: 'profile' }
];


const slashes = (s, start, end) =>
{
	const atStart = s.startsWith('/');
	if (atStart && !start) s = s.substr(1);
	if (!atStart && start) s = '/' + s;

	const atEnd = s.endsWith('/');
	if (atEnd && !end) s = s.substring(0, s.length - 1);
	if (!atEnd && end) s += '/';
	return s;
};
const createEntry = page => 
{
	if (page.entry)
		return './app/pages/' + page.entry;
	return `./app/pages/${slashes(page.name)}/index.js`;
}
const createHtmlPlugin = page =>
{
	let filename = slashes(page.name, false, true);
	if (page.name === '/') filename = '';
	const template = page.template || `./app/pages/${filename}index.handlebars`;
	filename = page.filename || filename + 'index.html';
	return new HtmlWebpackPlugin({
		inject: false,
		filename,
		template
	});
};
const createEntries = pages =>
{
	return pages.reduce((acc, item) =>
	{
		acc[slashes(item.name, false, true)] = createEntry(item);
		return acc;
	}, {});
}

const extractLess = new ExtractTextPlugin({
    filename: "[name]style.css",
    // disable: process.env.NODE_ENV === "development"
});

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
			},
			{
				test: /\.less$/,
				use: extractLess.extract({
					use: [{
						loader: "css-loader"
					}, {
						loader: "less-loader"
					}],
					// use style-loader in development
					fallback: "style-loader"
				})
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(['public']),
		extractLess,
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

function mapObj(obj, f, fKey = (k => k))
{
	const result = {};
	for (let key in obj)
	{
		if (!obj.hasOwnProperty(key)) continue;
		result[fKey(key)] = f(obj[key]);
	}
	return result;
}
