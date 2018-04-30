/*
 * @Author: lle_wang
 * @Date:   2018-04-25 20:44:37
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 21:22:39
 */
import React from 'react';
import Content from 'components/content/index.js';
import 'styles/css/add_commodity.css';
import PubSub from 'pubsub-js';
import ImgUploader from 'components/img-uploader/index.js';
import RichEditor from 'components/rich-editor/index.js';
import MUtil from 'util/index.js';
let _mm = new MUtil();
class AddCommodity extends React.Component {
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
		// 图片上传成功事件订阅
		PubSub.subscribe('UPLOADSUCCESS', (msg, res) => {
			alert('图片上传成功！');
			let uploadedImgsList = this.state.uploadedImgsList,
				uploadedImgsURIList = this.state.uploadedImgsURIList;
			uploadedImgsList.push(res.data.url);
			uploadedImgsURIList.push(res.data.uri);
			this.setState({
				uploadedImgsList: uploadedImgsList,
				uploadedImgsURIList: uploadedImgsURIList
			})
		});
		// 图片上传失败事件订阅
		PubSub.subscribe('UPLOADERROR', (msg, res) => {
			alert(res.msg);
		});

		// 富文本编辑数据回收事件订阅
		PubSub.subscribe('EDITORDATA', (msg, res) => {
			this.setState({
				richEditorContent: res
			})
		})
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

	// 一级分类选中触发事件
	firstChangeHandler = (e) => {
		this.setState({
			secondCategoryShow: true,
			firstSelectedId: e.target.value
		}, (e) => {
			this.getCategoryList(this.state.firstSelectedId);
		})
	}

	// 二级分类选中触发事件
	secondChangeHandler = (e) => {
		this.setState({
			secondSelectedId: e.target.value
		})
	}

	// 删除上传图片事件
	delectImgsHandler = (e) => {
		let delIndex = e.target.getAttribute('index'),
			uploadedImgsList = this.state.uploadedImgsList,
			uploadedImgsURIList = this.state.uploadedImgsURIList;
		uploadedImgsList.splice(delIndex, 1);
		uploadedImgsURIList.splice(delIndex, 1);
		this.setState({
			uploadedImgsList: uploadedImgsList,
			uploadedImgsURIList: uploadedImgsURIList
		})
	}

	// 所有数据提交服务器事件
	submitHandler = (e) => {
		let name = this.refs.name.value,
			describe = this.refs.describe.value,
			price = this.refs.price.value,
			inventory = this.refs.inventory.value,
			firstSelectedId = this.state.firstSelectedId,
			secondSelectedId = this.state.secondSelectedId,
			uploadedImgsURIList = this.state.uploadedImgsURIList,
			richEditorContent = this.state.richEditorContent,
			isErr = this.state.isErr,
			checkDataList = [name, describe, [firstSelectedId, secondSelectedId], price, inventory];
		// 验证输入域是否为空并决定是否显示提示
		isErr = isErr.map((item, index) => {
			if (index === 2) {
				if (checkDataList[2][0].toString().length || checkDataList[2][1].toString().length) {
					return false;
				} else {
					return true;
				}
			} else {
				if (checkDataList[index].length) {
					return false;
				} else {
					return true;
				}
			}
		});
		this.setState({
			isErr: isErr
		}, (e) => {
			if (this.state.isErr.join(',').indexOf('true') === Number('-1')) {
				// 提交产品数据给服务器
				_mm.request({
					url: '/manage/product/save.do',
					type: 'post',
					data: {
						categoryId: secondSelectedId,
						parentCategoryId: firstSelectedId,
						name: name,
						subtitle: describe,
						subImages: uploadedImgsURIList.join(','),
						detail: richEditorContent,
						price: price,
						stock: inventory,
						status: 1
					}
				}).then((res) => {
					if (!res.status) {
						if (this.state.pid) {
							alert('修改商品成功！');
						} else {
							alert('新增商品成功！');
						}
						window.location = 'http://localhost:8000/commodity#/commodity';
					} else {
						alert(res.msg);
					}
				}, (err) => {
					alert(err.msg);
				})
			}
		});
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
						<span className="close" onClick={this.delectImgsHandler}><i className="fa fa-close" index={index}></i></span>
					</div>);
			}) : '未上传任何图片',
			// 根据输入域是否有误显示相关内容
			errClassGroup = this.state.isErr.map((item, index) => {
				if (!item) {
					return 'err-txt hid'
				} else {
					return 'err-txt show'
				}
			});
		return (
			<Content title={this.state.pid ? '编辑商品' : '添加商品'}>
				<form className="add-commodity">
					<div className='add-form'>
  						<div className="form-group row">
    						<label htmlFor="name" className="col-sm-2 col-form-label">商品名称</label>
    						<div className="col-sm-6 ipt">
      							<input type="text" className="form-control" min={1} id="name" placeholder="请输入商品名" ref='name'/>
    						</div>
    						<span className={errClassGroup[0]}>必填项</span>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="describe" className="col-sm-2 col-form-label">商品描述</label>
    						<div className="col-sm-6 ipt">
      						<input type="text" className="form-control" id="describe" placeholder="请输入商品描述" ref='describe' />
    						</div>
    						<span className={errClassGroup[1]}>必填项</span>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="first-category" className="col-sm-2 col-form-label">所属分类</label>
      						<div className="col-sm-3 ipt">
      							<select className="custom-select" id="first-category" onChange={this.firstChangeHandler} value={this.state.firstSelectedId}>
        							<option>一级分类</option>
        							{firstCategoryListContent}
      							</select>
    						</div>
    						<div className={secondCategoryClassName}>
      							<select className='custom-select' id="second-category" onChange = { this.secondChangeHandler } value={this.state.secondSelectedId}>
        							<option>二级分类</option>
        							{secondCategoryListContent}
      							</select>
    						</div>
    						<span className={errClassGroup[2]}>必选项</span>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="price" className="col-sm-2 col-form-label">商品价格</label>
    						<div className="col-sm-3 ipt">
      							<input type="number" className="form-control" id="price" placeholder="请输入商品价格" ref='price' />
    						</div>
    						<span className={errClassGroup[3]}>必填项</span>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="inventory" className="col-sm-2 col-form-label">商品库存</label>
    						<div className="col-sm-3 ipt">
      							<input type="number" className="form-control" id="inventory" placeholder="请输入商品库存" ref='inventory' />
    						</div>
    						<span className={errClassGroup[4]}>必填项</span>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="img" className="col-sm-2 col-form-label">商品图片</label>
    						<div className="col-sm-10 ipt">
    							<div className="img-group">
    								{uploadedImgsContent}
    							</div>
    							<ImgUploader></ImgUploader>
    						</div>
  						</div>
  						<div className="form-group row">
    						<label htmlFor="detail" className="col-sm-2 col-form-label">商品详情</label>
    						<div className="col-sm-9 ipt">
    							<RichEditor defData={this.state.defRichEditorContent}></RichEditor>
    						</div>
  						</div>

  						<div className="form-group row">
    						<div className="col-sm-12 ipt" style={centerStyle}>
      							<button type="button" className="btn btn-primary" onClick={this.submitHandler}>提交</button>
    						</div>
  						</div>
					</div>
				</form>
			</Content>
		);
	}
}

export default AddCommodity;