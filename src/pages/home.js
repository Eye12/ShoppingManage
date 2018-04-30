/*
 * @Author: lle_wang
 * @Date:   2018-04-20 14:47:09
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 13:27:02
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/home.css';
import {
	Link
} from 'react-router-dom';
import MUtil from 'util/index.js';
const _mm = new MUtil();

class HomeContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blockData: []
		};
	}

	componentDidMount() {
		_mm.request({
			type: 'post',
			url: '/manage/statistic/base_count.do'
		}).then((res) => {
			let data = res.data;
			this.setState({
				blockData: [{
					title: '用户总数',
					count: data.userCount,
					icon: 'user-o',
					colorClass: 'orange'
				}, {
					title: '商品总数',
					count: data.productCount,
					icon: 'shopping-bag',
					colorClass: 'blue'
				}, {
					title: '订单总数',
					count: data.orderCount,
					icon: 'check-square-o',
					colorClass: 'green'
				}]
			});
		});
	}

	render() {
		let blockData = this.state.blockData;

		let homeContents = blockData.map((item, index) => {
			return (<div key={index} className={`${'m-block ' + item.colorClass}`}>
						<Link to='/home'>
							<div className="container">
								<h1 className='count'>{item.count}</h1>
								<p className='txt'><i className={`${'fa fa-' + item.icon}`}></i>{item.title}</p>
							</div>
						</Link>
					</div>);
		});
		return (
			<Content title='首页'>
				<div className="home-content">
					{ homeContents }
				</div>
			</Content>
		);
	}
}

export default HomeContent;