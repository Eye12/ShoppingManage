const path = require('path');
const webpack = require('webpack');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
	plugins: [
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, '../src/*.html'))
		}),
		new UglifyJsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		}),
	]
}