/*
 * @Author: lle_wang
 * @Date:   2018-04-19 16:13:22
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-19 21:28:26
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from 'components/layout/index.js';

class App extends React.Component {
	render() {
		return (
			<Layout></Layout>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));

if (module.hot) {
	module.hot.accept();
}