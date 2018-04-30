/*
 * @Author: lle_wang
 * @Date:   2018-04-25 20:44:37
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 20:09:12
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/add_commodity.css';
import MUtil from 'util/index.js';
let _mm = new MUtil();
class Details extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pid: '',
			categoryListOne: [],
			firstSelectedId: '',
			categoryListTwo: [],
			secondCategoryShow: false,
			secondSelectedId: '',
			uploadedImgsList: [],
			uploadedImgsURIList: [],
			richEditorContent: '',
			defRichEditorContent: '',
			isErr: [false, false, false, false, false]
		}
	}

	// 第一次组件渲染完成后获取一级品类列表
	componentDidMount() {
		this.getCategoryList();
		let productId = this.props.match.params.pid;
		if (productId) {
			this.loadProductItem(productId);
			this.setState({
				pid: productId
			})
		}
	}

	// 加载单个产品数据进行二次编辑
	loadProductItem = (param) => {
		_mm.request({
			url: '/manage/product/detail.do',
			type: 'post',
			data: {
				productId: param
			}
		}).then((res) => {
			let uploadedImgsURIList = res.data.subImages.split(','),
				uploadedImgsList = uploadedImgsURIList.map((item, index) => {
					return (res.data.imageHost + item);
				});
			this.setState({
				firstSelectedId: res.data.parentCategoryId,
				uploadedImgsURIList: uploadedImgsURIList,
				uploadedImgsList: uploadedImgsList,
				richEditorContent: res.data.detail,
				defRichEditorContent: res.data.detail,
				secondCategoryShow: true
			}, (e) => {
				this.getCategoryList(res.data.parentCategoryId);
				this.refs.name.value = res.data.name;
				this.refs.describe.value = res.data.subtitle;
				this.refs.price.value = res.data.price;
				this.refs.inventory.value = res.data.stock;
				this.setState({
					secondSelectedId: res.data.categoryId
				});
			})
		}, (err) => {
			console.log(err.msg);
		})
	}

	// 获取品类列表函数
	getCategoryList = (param) => {
		let categoryId = param || 0;
		_mm.request({
			type: 'post',
			url: 'manage/category/get_category.do',
			data: {
				categoryId: categoryId
			}
		}).then((res) => {
			if (categoryId) {
				this.setState({
					categoryListTwo: res.data
				})
			} else {
				this.setState({
					categoryListOne: res.data
				})
			}
		})
	}

	render() {
		let centerStyle = {
				textAlign: 'center'
			},
			// 是否显示二级分类
			secondCategoryClassName = this.state.secondCategoryShow ? 'col-sm-3 ipt show' : 'col-sm-3 ipt hid',
			categoryListOne = this.state.categoryListOne,
			categoryListTwo = this.state.categoryListTwo,
			// 一级分类内容渲染
			firstCategoryListContent = categoryListOne.length ? categoryListOne.map((item, index) => {
				return (<option value={item.id} key={item.id}>{item.name}</option>)
			}) : '没有加载到可用数据...',
			// 二级分类内容渲染
			secondCategoryListContent = categoryListTwo.length ? categoryListTwo.map((item, index) => {
				return (<option value={item.id} key={item.id}>{item.name}</option>)
			}) : '没有加载到可用数据...',
			// 根据用户是否上传图片决定显示信息
			uploadedImgsList = this.state.uploadedImgsList,
			uploadedImgsContent = uploadedImgsList.length ? uploadedImgsList.map((item, index) => {
				return (<div className="img-item" key={index} >
						<img src={item} alt="imgs" className='upload-imgs' />
					</div>);
			}) : '暂时没有图片';

		return (
			<Content title='商品详情'>
				<form className="add-commodity">
					<div className='add-form'>
  						<div className="form-group row">
    						<label htmlFor="name" className="col-sm-2 col-form-label">商品名称</label>
    						<div className="col-sm-6 ipt">
      							<input type="text" className="form-control" min={1} id="name" placeholder="请输入商品名" ref='name' readOnly/>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="describe" className="col-sm-2 col-form-label">商品描述</label>
    						<div className="col-sm-6 ipt">
      						<input type="text" className="form-control" id="describe" placeholder="请输入商品描述" ref='describe' readOnly/>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="first-category" className="col-sm-2 col-form-label">所属分类</label>
      						<div className="col-sm-3 ipt">
      							<select className="custom-select" id="first-category" value={this.state.firstSelectedId} readOnly disabled>
        							<option>一级分类</option>
        							{firstCategoryListContent}
      							</select>
    						</div>
    						<div className={secondCategoryClassName}>
      							<select className='custom-select' id="second-category" value={this.state.secondSelectedId} readOnly disabled>
        							<option>二级分类</option>
        							{secondCategoryListContent}
      							</select>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="price" className="col-sm-2 col-form-label">商品价格</label>
    						<div className="col-sm-3 ipt">
      							<input type="number" className="form-control" id="price" placeholder="请输入商品价格" ref='price' readOnly/>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="inventory" className="col-sm-2 col-form-label">商品库存</label>
    						<div className="col-sm-3 ipt">
      							<input type="number" className="form-control" id="inventory" placeholder="请输入商品库存" ref='inventory' readOnly/>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="img" className="col-sm-2 col-form-label">商品图片</label>
    						<div className="col-sm-10 ipt">
    							<div className="img-group">
    								{uploadedImgsContent}
    							</div>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="detail" className="col-sm-2 col-form-label">商品详情</label>
    						<div className="col-sm-9 ipt">
    							<div dangerouslySetInnerHTML = {{
        __html: this.state.defRichEditorContent
      }}></div>
    						</div>
  						</div>
					</div>
				</form>
			</Content>
		);
	}
}

export default Details;