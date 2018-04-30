/*
 * @Author: lle_wang
 * @Date:   2018-04-22 14:52:55
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 13:24:41
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/category.css';
import Pagination from 'components/pagination/index.js';
import MUtil from 'util/index.js';
import Pubsub from 'pubsub-js';
import {
	Link
} from 'react-router-dom';
let _mm = new MUtil();
class CategoryManage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			pageNum: 1,
			total: '',
			categoryId: 0
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
	}

	loadList = (e) => {
		_mm.request({
			url: '/manage/category/get_category.do',
			type: 'post',
			data: {
				categoryId: this.state.categoryId
			}
		}).then((res) => {
			this.setState({
				dataList: res.data,
				total: res.data.length
			});
		});
	}

	// 查看子品类
	checkClick = (e) => {
		let dataid = e.target.getAttribute('dataid');
		this.setState({
			categoryId: dataid
		}, (e) => {
			this.loadList();
		})
	}

	// 修改品类名称
	reviseClick = (e) => {
		let categoryId = e.target.getAttribute('dataid'),
			categoryName = e.target.getAttribute('dataname'),
			newName = prompt('修改商品名称', categoryName);
		_mm.request({
			url: '/manage/category/set_category_name.do',
			type: 'post',
			data: {
				categoryName: newName,
				categoryId: categoryId
			}
		}).then(res => {
			alert(res.data);
			this.loadList();
		}, err => {
			alert(err);
		})
	}

	render() {
		const totalPages = Math.ceil(this.state.dataList.length / 10);
		let dataList = this.state.dataList,
			newList = [],
			pageNum = this.state.pageNum - 1;
		for (var i = 1; i < (totalPages + 1); i++) {
			newList.push(dataList.slice(10 * (i - 1), 10 * i));
		}
		let styleArr = [{
				width: '10%'
			}, {
				width: '68%'
			}, {
				width: '22%'
			}],
			centerStyle = {
				textAlign: 'center'
			},
			checkChildClassName = this.state.categoryId ? 'hid' : 'check-child',
			listContent = dataList.length ? newList[pageNum].map((item, index) => {
				return (<tr key={index}>
      							<td>{item.id}</td>
      							<td>{item.name}</td>
      							<td>
      								<span className="revise-name" onClick={this.reviseClick} dataid = {item.id} dataname={item.name}>修改名称</span>
      								<span className={checkChildClassName} onClick={this.checkClick} dataid = {item.id}>查看其子品类</span>
      							</td>
    						</tr>);
			}) : (<tr><td colSpan='5' style={centerStyle}>没有加载到任何数据...</td></tr>);
		return (
			<Content title='品类管理'>
				<div className="category-manage">
					<p className='header'>
						当前商品ID: {this.state.categoryId}
						<Link to='/add-category'>
  							<button className='btn btn-primary add-new'><i className='fa fa-plus'></i>新增品类</button>
  						</Link>
					</p>
					<table className="table table-dark">
  						<thead>
    						<tr>
      							<th scope="col" style={styleArr[0]}>品类ID</th>
      							<th scope="col" style={styleArr[1]}>品类名称</th>
      							<th scope="col" style={styleArr[2]}>操作</th>
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

export default CategoryManage;