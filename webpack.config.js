const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

// 引入其他内部配置文件
const commonConfig = require('./cfg/common.js');
const devConfig = require('./cfg/dev.js');
const proConfig = require('./cfg/pro.js');

const changeConfig = env => {
	let cleanFilename = env === 'product' ? ['dist'] : '';
	let cssLoaders = env === 'product' ? ExtractTextPlugin.extract({
		fallback: 'style-loader',
		use: [{
			loader: 'css-loader',
			options: {
				importLoaders: 1,
				minimize: true
			}
		}, {
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: [
					require('postcss-sprites')({
						spritePath: 'dist/images',
						retina: true
					})
				]
			}
		}]
	}) : [{
		loader: 'style-loader',
		options: {
			sourceMap: true
		}
	}, {
		loader: 'css-loader',
		options: {
			sourceMap: true
		}
	}]

	let imgLoaders = env === 'product' ? [{
		loader: 'url-loader',
		options: {
			limit: 1000,
			name: '[name].[hash:5].[ext]',
			outputPath: 'images',
			publicPath: '../images'
		}
	}, {
		loader: 'img-loader',
		options: {
			pngquant: {
				quality: 50
			}
		}
	}] : {
		loader: 'file-loader',
		options: {
			name: '[name].[hash:5].[ext]',
			outputPath: 'images',
			publicPath: '../images'
		}
	}

	return ({
		module: {
			rules: [{
				test: /\.css$/,
				use: cssLoaders
			}, {
				test: /\.(svg|jpe?g|png|gif)$/,
				exclude: /node_modules/,
				use: imgLoaders
			}]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: './src/index.html',
				favicon: './src/images/favicon.ico',
				minify: {
					caseSensitive: false, // 是否大小写敏感
					removeComments: true, // 去除注释
					removeEmptyAtrributes: true, // 去除空属性
					collapseWhitespace: true //是否去除空格
				}
			}),
			new ExtractTextPlugin({
				filename: 'css/[name].[hash:5].css'
			}),
			new CleanPlugin(cleanFilename, {
				root: __dirname
			})
		]
	})
}

module.exports = env => {
	let resConfig = env === 'product' ? proConfig : devConfig;
	return merge(commonConfig, resConfig, changeConfig(env));
}