/*
 * @Author: lle_wang
 * @Date:   2018-04-21 15:07:58
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-24 20:28:12
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/commodity.css';
import Pagination from 'components/pagination/index.js';
import SearchForm from 'components/search/index.js';
import Table from 'components/table/index.js';
import PubSub from 'pubsub-js';
import MUtil from 'util/index.js';
let _mm = new MUtil();
class Commodity extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			total: '',
			fetchData: '',
			list: '',
			pageNum: '1',
			searchType: '',
			searchValue: '',
			line: 1
		}
	}

	// 组件完成第一渲染后获取所有商品数据并挂载相关订阅事件
	componentDidMount() {
		let urlPath = '/manage/product/list.do',
			dataObj = {
				pageNum: this.state.pageNum
			};
		this.getData(urlPath, dataObj);

		// 翻页事件订阅
		PubSub.subscribe('PAGECHANGE', (msg, data) => {
			this.setState({
				pageNum: data
			}, function() {
				if (Number(this.state.line) === 1) {
					dataObj = {
						pageNum: this.state.pageNum
					};
					this.getData(urlPath, dataObj);
				} else {
					this.searchUpdate();
				}
			}.bind(this))
		});

		// 上下架更改状态订阅
		PubSub.subscribe('TABLEUPDATE', (msg, data) => {
			if (Number(this.state.line === 1)) {
				this.getData(urlPath, dataObj);
			} else {
				this.searchUpdate();
			}
		});

		// 查询事件订阅
		PubSub.subscribe('SEARCH', (msg, data) => {
			this.setState({
				line: 2,
				pageNum: 1,
				searchType: data.searchType,
				searchValue: data.searchValue
			}, (e) => {
				this.searchUpdate();
			})
		});
	}

	// 查询刷新事件
	searchUpdate = (e) => {
		let urlPath = '/manage/product/search.do',
			dataObj = this.state.searchType === 'productName' ? {
				type: 'post',
				productName: this.state.searchValue,
				pageNum: this.state.pageNum
			} : {
				type: 'post',
				productId: this.state.searchValue,
				pageNum: this.state.pageNum
			};
		this.getData(urlPath, dataObj);
	}

	// 获取数据函数
	getData = (urlPath, dataObj) => {
		_mm.request({
			url: urlPath,
			type: 'post',
			data: dataObj
		}).then(res => {
			this.setState({
				fetchData: res.data,
				list: res.data.list,
				total: res.data.total
			}, (e) => {
				PubSub.publish('TABLEDATACHANGE', this.state.list);
			})
		})
	}
	render() {
		return (
			<Content title='商品管理'>
				<div className="commodity">
					<SearchForm></SearchForm>
					<Table></Table>
					<Pagination total={ this.state.total } current={ this.state.pageNum }></Pagination>
				</div>
			</Content>
		);
	}
}

export default Commodity;