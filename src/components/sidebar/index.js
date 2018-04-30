/*
 * @Author: lle_wang
 * @Date:   2018-04-22 17:45:08
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 13:25:28
 */
import React from 'react';
import 'styles/css/sidebar.css';
import {
  Link
} from 'react-router-dom';
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentkey: localStorage.getItem('currentkey') || 'home'
    };
  }

  clickHandler = (e) => {
    let datakey = e.target.getAttribute('datakey');
    this.setState({
      currentkey: datakey
    });
    localStorage.setItem('currentkey', datakey);
  }

  render() {
    return (
      <ul className="list-group side-bar">
          <li className="list-group-item"><b><span className='span-txt'>M.</span>SYSTEM</b></li>
          <li className={`${this.state.currentkey === 'home' ? 'list-group-item active' : 'list-group-item'}`}>
            <Link to='/home' onClick={this.clickHandler} datakey='home'>
              <i className="fa fa-home" datakey='home'><span className="txt" datakey='home'>首页</span></i>
            </Link>
          </li>
          <li className={`${this.state.currentkey === 'category' ? 'list-group-item active' : 'list-group-item'}`}>
            <Link to='/category' onClick={this.clickHandler} datakey='category'>
              <i className="fa fa-th-large" datakey='category'><span className="txt" datakey='category'>品类管理</span></i>
            </Link>
          </li>
          <li className={`${this.state.currentkey === 'commodity' ? 'list-group-item active' : 'list-group-item'}`}>
            <Link to='/commodity' onClick={this.clickHandler} datakey='commodity'>
                <i className="fa fa-shopping-bag" datakey='commodity'><span className="txt" datakey='commodity'>商品管理</span></i>
            </Link>
          </li>
          <li className={`${this.state.currentkey === 'order' ? 'list-group-item active' : 'list-group-item'}`}>
            <Link to='/order' onClick={this.clickHandler} datakey='order'>
              <i className="fa fa-check-square-o" datakey='order'><span className="txt" datakey='order'>订单管理</span></i>
            </Link>
          </li>
          <li className={`${this.state.currentkey === 'user' ? 'list-group-item active' : 'list-group-item'}`}>
            <Link to='/user' onClick={this.clickHandler} datakey='user'>
              <i className="fa fa-user-o" datakey='user'><span className="txt" datakey='user'>用户列表</span></i>
            </Link>
          </li>
      </ul>
    );
  }
}

export default SideBar;