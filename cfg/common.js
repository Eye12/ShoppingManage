const path = require('path');
const webpack = require('webpack');
module.exports = {
	entry: {
		index: path.resolve(__dirname, '../src/index.js')
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'js/[name].[hash:5].js',
		chunkFilename: 'js/[name].[chunkhash:5].js',
		publicPath: ''
	},
	resolve: {
		alias: {
			styles: path.resolve(__dirname, '../src/styles'),
			pages: path.resolve(__dirname, '../src/pages/'),
			components: path.resolve(__dirname, '../src/components/'),
			util: path.resolve(__dirname, '../src/util')
		}
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [
						['babel-preset-env', {
							targets: {
								browsers: ['>1%', 'last 2 versions']
							}
						}], 'react', "es2015", "stage-0"
					]
				}
			}, {
				loader: 'eslint-loader',
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			}]
		}, {
			test: /\.(svg|eot|woff2?|ttf)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'file-loader',
				options: {
					name: '[name].[hash:5].[ext]',
					outputPath: 'fonts',
					publicPath: 'fonts'
				}
			}]
		}]
	},
	plugins: [
		new webpack.NamedChunksPlugin(),
		new webpack.NamedModulesPlugin(),
	]
}