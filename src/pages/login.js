/*
 * @Author: lle_wang
 * @Date:   2018-04-21 15:41:56
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-23 19:22:36
 */
import React from 'react';
import 'styles/css/login.css';
import PubSub from 'pubsub-js';
import MUtil from 'util/index.js';
const _mm = new MUtil();
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false,
			error: false,
			msg: ''
		};
	}

	componentWillMount() {
		document.title = '登陆 - ShoppingManage';
	}

	// 表单提交
	submitHandler = (e) => {
		let username = this.refs.username.value,
			passkey = this.refs.passkey.value;

		_mm.request({
			type: 'post',
			url: '/manage/user/login.do',
			data: {
				username: username,
				password: passkey
			}
		}).then((res) => {
			// 登陆成功！
			if (res.status === 0) {
				this.setState({
					isShow: true,
					error: false,
					msg: '恭喜您，登陆成功！'
				});
				localStorage.setItem('username', res.data.username);
				PubSub.publish('LOGIN', true);
				let _this = this;
				setTimeout(function() {
					// window.location.href = 'http://localhost:8000/#/home';
					_this.props.history.push('/home');
				}, 900);
			} else {
				this.setState({
					isShow: true,
					error: true,
					msg: res.msg
				});
			}
		}, (err) => {
			this.setState({
				error: true,
				isShow: true,
				msg: err.statusText
			});
		});
	}

	// 回车提交
	keyUpHandler = (e) => {
		if (e.keyCode === 13) {
			this.submitHandler();
		}
	}

	render() {
		let proptClassName = this.state.isShow ? 'propt propt-show' : 'propt';
		proptClassName = this.state.error ? (proptClassName + ' error') : proptClassName;
		return (
			<div className="login-container">
				<div className="contents">
					<h2 className="title">欢迎登陆 - M.Manage</h2>
					<form className='login-form'>
  						<div className="form-group">
    						<label htmlFor="username" className='label-for'>用户名:</label>
    						<input type="text" className="form-control" id="username" placeholder="请输入您的用户名" ref='username' />
  						</div>
  						<div className="form-group">
    						<label htmlFor="passkey" className='label-for'>密码:</label>
    						<input type="password" className="form-control" id="passkey" placeholder="请输入您的密码" ref='passkey' onKeyUp = { this.keyUpHandler } />
  						</div>
  						<button type="button" onClick={this.submitHandler} className="btn btn-primary">登陆</button>
  						<p className={proptClassName}>{this.state.msg}</p>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;