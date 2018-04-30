/*
 * @Author: lle_wang
 * @Date:   2018-04-26 15:30:37
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 14:40:46
 */
import React from 'react';
import FileUpload from './fileUpload.js';
import PubSub from 'pubsub-js';
class ImgUploader extends React.Component {
	render() {
		const options = {
			baseUrl: '/manage/product/upload.do',
			fileFieldName: 'upload_file',
			dataType: 'json',
			uploadSuccess: (res) => {
				PubSub.publish('UPLOADSUCCESS', res);
				console.log(res);
			},
			uploadError: (err) => {
				PubSub.publish('UPLOADERROR', err);
			},
			chooseAndUpload: true
			// multiple: true
		}
		return (
			<FileUpload options={options}>
				<FileUpload options={options}>
    				<button ref="chooseAndUpload">上传图片</button>
				</FileUpload>
			</FileUpload>
		);
	}
}

export default ImgUploader;