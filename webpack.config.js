const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

const sitemap = require('./app/sitemap');
const config = require('./app/config');


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
const createEntries = pages => pages.reduce((acc, item) =>
{
	acc[slashes(item.name, false, true)] = createEntry(item);
	return acc;
}, {});
const createPlugins = pages => pages.reduce((acc, item) =>
{
	if (!item.isGenerated)
		acc.push(createHtmlPlugin(item));
	return acc;
}, []);

const extractLess = new ExtractTextPlugin({
    filename: "[name]style.css",
});

/**********************************
 * AND HERE GOES THE CONFIG ITSELF*
 **********************************/
const webpackConfig = {
	// create webpack entrypoints for each static page
	entry: createEntries(sitemap),
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
		new CleanWebpackPlugin(['public']), // clean 'public' directory before build
		extractLess, // required for .less compilation
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(config.NODE_ENV),
			PRODUCTION: JSON.stringify(config.NODE_ENV === 'prod')
		})
	].concat(
		// automatically create a new HTMLWebpackPlugin for each static page in sitemap
		createPlugins(sitemap)
	)
};

module.exports = webpackConfig;

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
