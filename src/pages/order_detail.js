/*
 * @Author: lle_wang
 * @Date:   2018-04-29 17:22:21
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 19:16:33
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/order_detail.css';
import MUtil from 'util/index.js';
let _mm = new MUtil();

class OrderDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataItem: '',
			dataList: []
		}
	}
	componentDidMount() {
		let orderNo = this.props.match.params.orderNo;
		this.loadOrder(orderNo);
	}

	loadOrder = (orderNo) => {
		_mm.request({
			url: '/manage/order/search.do',
			type: 'post',
			data: {
				orderNo: orderNo
			}
		}).then(res => {
			this.setState({
				dataItem: res.data.list[0],
				dataList: res.data.list[0].orderItemVoList
			})
		}, err => {
			alert(err.msg);
		})
	}

	render() {
		let dataItem = this.state.dataItem,
			dataList = this.state.dataList,
			styleArr = [{
				width: '6%'
			}, {
				width: '60%'
			}, {
				width: '10%'
			}, {
				width: '14%'
			}, {
				width: '10%'
			}],

			tableItem = dataList.map((item, index) => {
				return (<tr key={index}>
					<td className='item-img'><img src={`${'http://img.happymmall.com/' + item.productImage}`} alt="img"/></td>
					<td>{item.productName}</td>
					<td>{item.currentUnitPrice}</td>
					<td>{item.quantity}</td>
					<td>{item.totalPrice}</td>
					</tr>);
			});

		return (
			<Content title='订单详情'>
				<div className="order-detail">
					<p className="item">
						<span className="item-title">订单号:</span>
						<span className="txt">{dataItem.orderNo}</span>
					</p>
					<p className="item">
						<span className="item-title">创建时间:</span>
						<span className="txt">{dataItem.createTime}</span>
					</p>
					<p className="item">
						<span className="item-title">收件人:</span>
						<span className="txt">{dataItem.receiverName}</span>
					</p>
					<p className="item">
						<span className="item-title">订单状态:</span>
						<span className="txt">{dataItem.statusDesc}</span>
					</p>
					<p className="item">
						<span className="item-title">支付方式:</span>
						<span className="txt">{dataItem.paymentTypeDesc}</span>
					</p>
					<p className="item">
						<span className="item-title">订单金额:</span>
						<span className="txt">{`${'¥' + dataItem.payment}`}</span>
					</p>
					<table className="table table-dark">
  						<thead>
    						<tr>
      							<th scope="col" style={styleArr[0]}>商品图片</th>
      							<th scope="col" style={styleArr[1]}>商品信息</th>
      							<th scope="col" style={styleArr[2]}>单价</th>
      							<th scope="col" style={styleArr[3]}>数量</th>
      							<th scope="col" style={styleArr[4]}>合计</th>
    						</tr>
  						</thead>
  						<tbody>
  							{tableItem}
  						</tbody>
					</table>
				</div>
			</Content>
		);
	}
}

export default OrderDetail;