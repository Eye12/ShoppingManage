/*
 * @Author: lle_wang
 * @Date:   2018-04-21 15:13:20
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 20:20:11
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/userList.css';
import Pagination from 'components/pagination/index.js';
import MUtil from 'util/index.js';
import Pubsub from 'pubsub-js';
let _mm = new MUtil();
class User extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			pageNum: 1,
			total: '1730'
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
			url: '/manage/user/list.do',
			type: 'post',
			data: {
				pageNum: this.state.pageNum
			}
		}).then((res) => {
			this.setState({
				dataList: res.data.list
			});
		});
	}

	render() {
		let dataList = this.state.dataList,
			centerStyle = {
				textAlign: 'center'
			},
			listContent = dataList.length ? dataList.map((item, index) => {
				return (<tr key={index}>
      							<td>{item.id}</td>
      							<td>{item.username}</td>
      							<td>{item.email}</td>
      							<td>{item.phone}</td>
      							<td>{new Date(item.createTime).toLocaleString()}</td>
    						</tr>);
			}) : (<tr><td colSpan='5' style={centerStyle}>没有加载到任何数据...</td></tr>);
		return (
			<Content title='用户列表'>
				<div className="user-list">
					<table className="table table-dark">
  						<thead>
    						<tr>
      							<th scope="col">ID</th>
      							<th scope="col">用户名</th>
      							<th scope="col">邮箱</th>
      							<th scope="col">电话</th>
      							<th scope="col">注册时间</th>
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

export default User;