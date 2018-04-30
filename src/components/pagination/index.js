/*
 * @Author: lle_wang
 * @Date:   2018-04-23 16:14:46
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 20:15:44
 */
import React from 'react';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import 'styles/css/pagination.css';
import PubSub from 'pubsub-js';
class PaginationComponent extends React.Component {
	// 翻页
	onChange = (current, pageSize) => {
		PubSub.publish('PAGECHANGE', current);
	}
	render() {
		return (
			<div className="pagination">
				<Pagination
      showQuickJumper={{
        goButton: <button>确定</button>
      }}
      defaultPageSize={10}
      current = {Number(this.props.current)}
      onChange={this.onChange}
      total={Number(this.props.total)} />
			</div>
		);
	}
}

export default PaginationComponent;