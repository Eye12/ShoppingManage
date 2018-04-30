/*
 * @Author: lle_wang
 * @Date:   2018-04-19 17:45:01
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 18:18:54
 */
import React from 'react';
import NavTop from 'components/navTop/index.js';
import SideBar from 'components/sidebar/index.js';
import HomePage from 'pages/home.js';
import CategoryManage from 'pages/category_manage.js';
import Commodity from 'pages/commodity.js';
import Order from 'pages/order.js';
import User from 'pages/user.js';
import Login from 'pages/login.js';
import AddCommodity from 'pages/add_commodity.js';
import ErrorPage from 'pages/error.js';
import Details from 'pages/details.js';
import AddCategory from 'pages/add_category.js';
import OrderDetail from 'pages/order_detail.js';
import PubSub from 'pubsub-js';
import {
	HashRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasLoged: false
		};
	}

	componentWillMount() {
		if (localStorage.getItem('username')) {
			this.setState({
				hasLoged: true
			});
		}
	}

	componentDidMount() {
		PubSub.subscribe('LOGIN', (msg, data) => {
			this.setState({
				hasLoged: true
			});
		});
	}

	render() {
		let pathname = this.state.hasLoged ? '/' : '/wrong';
		return (
			<Router>
				<Switch>
					<Route exact path='/' component={Login}></Route>
					<Route path={pathname} render={props => (<div className="wrapper">
							<NavTop></NavTop>
							<SideBar></SideBar>
							<Switch>
								<Route exact path='/home' component={ HomePage }></Route>
								<Route path='/category' component={ CategoryManage }></Route>
								<Route path='/commodity' component={ Commodity }></Route>
								<Route path='/order' component={ Order }></Route>
								<Route path='/user' component={ User }></Route>
								<Route path='/add-commodity/:pid?' component={ AddCommodity }></Route>
								<Route path='/details/:pid' component={ Details }></Route>
								<Route path='/add-category' component={ AddCategory }></Route>
								<Route path='/order-detail/:orderNo' component={ OrderDetail }></Route>
								<Route component={ ErrorPage }></Route>
							</Switch>
						</div>)}>
					</Route>
				</Switch>
			</Router>
		);
	}
}

export default Layout;