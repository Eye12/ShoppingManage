/*
 * @Author: lle_wang
 * @Date:   2018-04-21 15:13:20
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 18:19:25
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/order.css';
import Pagination from 'components/pagination/index.js';
import SearchForm from 'components/search/index.js';
import MUtil from 'util/index.js';
import Pubsub from 'pubsub-js';
import {
	Link
} from 'react-router-dom';
let _mm = new MUtil();
class Order extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			pageNum: 1,
			total: ''
		};
	}

	componentDidMount() {
		Pubsub.subscribe('PAGECHANGE', (msg, data) => {
			this.setState({
				pageNum: data
			}, (e) => {
				this.loadList();
			});
		});
		this.loadList();

		Pubsub.subscribe('ORDERSEARCH', (msg, data) => {
			this.orderSearch(data.searchValue);
		})
	}

	orderSearch = (param) => {
		_mm.request({
			url: '/manage/order/search.do',
			type: 'post',
			data: {
				orderNo: param
			}
		}).then(res => {
			if (Number(res.status) === 0) {
				this.setState({
					dataList: res.data.list,
					pageNum: res.data.pageNum,
					total: 1
				})
			} else {
				this.setState({
					dataList: [],
					pageNum: 0,
					total: 0
				});
				alert(res.msg);
			}
		})
	}

	loadList = (e) => {
		_mm.request({
			url: '/manage/order/list.do',
			type: 'post',
			data: {
				pageNum: this.state.pageNum
			}
		}).then((res) => {
			this.setState({
				dataList: res.data.list,
				total: res.data.total
			});
		});
	}

	render() {
		let dataList = this.state.dataList,
			centerStyle = {
				textAlign: 'center'
			},
			colorStyle = {
				color: '#fff'
			},
			listContent = dataList.length ? dataList.map((item, index) => {
				return (<tr key={index}>
      							<td>{item.orderNo}</td>
      							<td>{item.receiverName}</td>
      							<td>{item.statusDesc}</td>
      							<td>{`${'¥ ' + item.orderItemVoList[0].totalPrice}`}</td>
      							<td>{item.createTime}</td>
      							<td>
      								<Link to={`${'/order-detail/' + item.orderNo}`} style={colorStyle}>查看</Link>
      							</td>
    						</tr>);
			}) : (<tr><td colSpan='5' style={centerStyle}>没有加载到任何数据...</td></tr>);
		return (
			<Content title='订单管理'>
				<div className="order-list">
					<SearchForm hid='hid-add'></SearchForm>
					<table className="table table-dark">
  						<thead>
    						<tr>
      							<th scope="col">订单号</th>
      							<th scope="col">收件人</th>
      							<th scope="col">订单状态</th>
      							<th scope="col">总价</th>
      							<th scope="col">创建订单时间</th>
      							<th scope="col">操作</th>
    						</tr>
  						</thead>
  						<tbody>
    						{listContent}
  						</tbody>
					</table>
					<Pagination total={ this.state.total } current={ this.state.pageNum }></Pagination>
				</div>
			</Content>
		);
	}
}

export default Order;