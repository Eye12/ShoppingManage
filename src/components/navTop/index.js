/*
 * @Author: lle_wang
 * @Date:   2018-04-22 17:44:54
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-29 13:25:17
 */
import React from 'react';
import 'styles/css/navTop.css';
import MUtil from 'util/index.js';
let _mm = new MUtil();
class NavTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: localStorage.getItem('username') || ''
        };
    }

    // 退出登录
    logOutHander = (e) => {
        e.preventDefault();
        e.stopPropagation();
        _mm.request({
            type: 'post',
            url: 'http://admintest.happymmall.com/user/logout.do'
        }).then((res) => {
            if (res.status === 0) {
                localStorage.removeItem('username');
                localStorage.removeItem('currentkey');
                window.location.href = '/';
            } else {
                alert(res.msg);
            }
        }, (err) => {
            alert(err.statusText);
        });
    }

    render() {
        return (
            <ul className="nav justify-content-end nav-top">
                <li className="nav-item">
                    <a className="nav-link active" href="javascript:void(0)">
                        <span className="txt">欢迎您，{this.state.username}</span>
                        <i className='fa fa-caret-down'></i>
                    </a>
                    <span className="dropdown" onClick = { this.logOutHander }>
                        <i className='fa fa-sign-out'></i>
                        退出登录
                    </span>
                </li>
            </ul>
        );
    }
}

export default NavTop;