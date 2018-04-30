/*
 * @Author: lle_wang
 * @Date:   2018-04-28 19:41:58
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-28 20:49:27
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/add_category.css';
import MUtil from 'util/index.js';
let _mm = new MUtil();

class AddCategory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryId: 0,
			dataList: [],
			errShow: false
		}
	}

	componentDidMount() {
		_mm.request({
			url: '/manage/category/get_category.do',
			type: 'post',
			data: {
				categoryId: this.state.categoryId
			}
		}).then(res => {
			this.setState({
				dataList: res.data
			})
		}, err => {
			console.log(err.msg);
		})
	}

	// 提交所有数据
	submitHandler = (e) => {
		let categoryId = this.refs.select.value,
			categoryName = this.refs.categoryName.value;
		if (!categoryName) {
			this.setState({
				errShow: true
			})
		} else {
			this.setState({
				errShow: false
			})
			_mm.request({
				url: '/manage/category/add_category.do',
				type: 'post',
				data: {
					parentId: categoryId,
					categoryName: categoryName
				}
			}).then((res) => {
				alert(res.data);
				this.refs.select.value = 0;
				this.refs.categoryName.value = '';
			}, (err) => {
				console.log(err.msg);
			})
		}
	}

	render() {
		let dataList = this.state.dataList,
			options = dataList.map((item, index) => {
				return (<option value={item.id} key={index}>{item.name}</option>)
			}),
			errClassName = this.state.errShow ? 'err show' : 'err';
		return (
			<Content title='添加品类'>
				<div className="add-category">
					<form className="add-form">
  						<div className="form-group row">
    						<label htmlFor="category" className="col-sm-2 col-form-label">所属分类</label>
      						<div className="col-sm-4 ipt">
      							<select className="custom-select" id="category" ref='select'>
        							<option value='0'>/所有</option>
        							{options}
      							</select>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="category-name" className="col-sm-2 col-form-label">品类名称</label>
    						<div className="col-sm-4 ipt">
      							<input type="text" className="form-control" id="category-name" placeholder="请输入品类名称" ref='categoryName' />
    						</div>
    						<span className={errClassName}>此处不能为空</span>
  						</div>
  						<div className="form-group row">
    						<div className="col-sm-6">
      							<button type="button" className="btn btn-primary" onClick={this.submitHandler}>提交</button>
    						</div>
  						</div>
					</form>
				</div>
			</Content>
		);
	}
}

export default AddCategory;