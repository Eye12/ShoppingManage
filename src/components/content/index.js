/*
 * @Author: lle_wang
 * @Date:   2018-04-22 21:33:26
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 13:24:57
 */
import React from 'react';
import 'styles/css/content.css';

class Content extends React.Component {
	componentWillMount() {
		document.title = this.props.title + '-M.Manage';
	}
	render() {
		return (
			<div className="content">
				<h1 className="title">{this.props.title}</h1>
				{ this.props.children }
			</div>
		);
	}
}

export default Content;