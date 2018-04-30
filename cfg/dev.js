const path = require('path');
const webpack = require('webpack');
module.exports = {
	devServer: {
		port: 8000,
		hot: true,
		hotOnly: true,
		overlay: true,
		historyApiFallback: {
			from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
			to: function(context) {
				return '/' + context.match[1] + context.match[2] + '.html';
			}
		},
		proxy: {
			'/manage': {
				target: 'http://admintest.happymmall.com',
				changeOrigin: true
			}
		}
	},
	devtool: 'cheap-module-source-map',
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
}