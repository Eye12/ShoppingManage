/*
 * @Author: lle_wang
 * @Date:   2018-04-22 21:17:49
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-22 21:28:15
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/error.css';
import {
	Link
} from 'react-router-dom';

class ErrorPage extends React.Component {
	render() {
		return (
			<Content title='错误啦！'>
				<p className="error-content">找到不到路径，<Link to='/home'>点我返回首页</Link></p>
			</Content>
		);
	}
}

export default ErrorPage;