/*
 * @Author: lle_wang
 * @Date:   2018-04-24 11:21:49
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 17:07:51
 */
import React from 'react';
import 'styles/css/searchform.css';
import PubSub from 'pubsub-js';
import {
	Link
} from 'react-router-dom';
class SearchForm extends React.Component {
	// 查询事件
	clickHandler = (e) => {
		let searchType = this.refs.searchType.value,
			searchValue = this.refs.searchData.value,
			transmitData = {
				searchType: searchType,
				searchValue: searchValue
			};
		if (this.props.hid) {
			PubSub.publish('ORDERSEARCH', transmitData);
		} else {
			PubSub.publish('SEARCH', transmitData);
		}
	}

	render() {
		let hidStyle = this.props.hid === 'hid-add' ? {
				display: 'none'
			} : {},
			optionContent = this.props.hid === 'hid-add' ? '订单编号' : '按商品名称查询',
			optionValue = this.props.hid === 'hid-add' ? 'orderNo' : 'productName';
		return (
			<form className='search-form'>
  				<div className="form-row align-items-center">
    				<div className="col-auto my-1">
      					<select className="custom-select mr-sm-2" ref='searchType'>
        					<option defaultValue value={optionValue}>{optionContent}</option>
        					<option value="1" value='productId' style={hidStyle}>按商品ID查询</option>
      					</select>
    				</div>
    				<div className="col-auto my-1">
      					<input type="text" className="form-control" placeholder="输入商品名称/商品ID" ref='searchData' />
    				</div>
    				<div className="col-auto my-1">
      					<button type="button" className="btn btn-primary" onClick={this.clickHandler}>查询</button>
    				</div>
  				</div>
  				<Link to='/add-commodity' style={hidStyle}>
  					<button className='btn btn-primary add-new'><i className='fa fa-plus'></i>新增商品</button>
  				</Link>
			</form>
		);
	}
}

export default SearchForm;