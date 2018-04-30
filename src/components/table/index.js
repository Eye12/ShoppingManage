/*
 * @Author: lle_wang
 * @Date:   2018-04-24 17:35:29
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 19:58:50
 */
import React from 'react';
import PubSub from 'pubsub-js';
import {
	Link
} from 'react-router-dom';
import MUtil from 'util/index.js';
let _mm = new MUtil();
class Tabel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: ''
		};
	}

	// 所有组件渲染完成挂载订阅
	componentDidMount() {
		PubSub.subscribe('TABLEDATACHANGE', (msg, data) => {
			this.setState({
				dataList: data
			})
		})
	}

	// 上下架事件
	clickHandler = (e) => {
		if (window.confirm(Number(e.target.getAttribute('status')) === 1 ? '您确定要下架该商品吗？' : '您确定要上架该商品吗？')) {
			let status = e.target.getAttribute('status'),
				productId = e.target.getAttribute('dataid');
			status = Number(status) === 1 ? 2 : 1;
			_mm.request({
				url: '/manage/product/set_sale_status.do',
				type: 'post',
				data: {
					productId: productId,
					status: status
				}
			}).then(res => {
				alert('修改成功！');
				PubSub.publish('TABLEUPDATE', '');
			}, err => {
				alert(err.msg);
			})
		}
	}

	// 渲染组件
	render() {
		let styleArr = [{
			width: '8%'
		}, {
			width: '54%'
		}, {
			width: '10%'
		}, {
			width: '15%'
		}, {
			width: '13%'
		}];

		let centerStyle = {
				textAlign: 'center'
			},
			dataList = this.state.dataList,
			items = dataList ? dataList.map((item, index) => {
				let statusContent = Number(item.status) === 1 ? (
					<td className='left-right'>
						<span className="on-sale">在售</span>
						<button className="btn btn-primary" onClick={ this.clickHandler } status = { item.status } dataid = { item.id } >下架</button>
					</td>) : (
					<td className='left-right'>
						<span className="down">已下架</span>
						<button className="btn btn-primary" onClick={ this.clickHandler } status = { item.status } dataid = { item.id } >上架</button>
					</td>);
				return (
					<tr key={index}>
						<td>{item.id}</td>
						<td>
							<span className="name">{item.name}</span>
							<span className="sub-title">{item.subtitle}</span>
						</td>
						<td>{`${'¥ ' + item.price}`}</td>
						{ statusContent }
						<td>
							<Link to={`${'/details/' + item.id}`}><span className="see">查看</span></Link>
							<Link to={`${'/add-commodity/' + item.id}`}><span className="edit">编辑</span></Link>
						</td>
					</tr>
				);
			}) : (<tr><td colSpan={5} style={centerStyle}>没有可用数据...</td></tr>);
		return (
			<table className="table table-dark">
  				<thead>
    				<tr>
      					<th scope="col" style={styleArr[0]}>商品ID</th>
      					<th scope="col" style={styleArr[1]}>商品信息</th>
      					<th scope="col" style={styleArr[2]}>价格</th>
      					<th scope="col" style={styleArr[3]}>状态</th>
      					<th scope="col" style={styleArr[4]}>操作</th>
    				</tr>
  				</thead>
  				<tbody>
    				{items}
  				</tbody>
			</table>
		);
	}
}

export default Tabel;