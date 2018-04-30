/*
 * @Author: lle_wang
 * @Date:   2018-04-26 20:53:57
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-27 16:30:33
 */
import React from 'react';
import Simditor from 'simditor';
import PubSub from 'pubsub-js';
import 'simditor/styles/simditor.css';
class RichEditor extends React.Component {
	componentDidMount() {
		this.editor = new Simditor({
			textarea: $('#editor'),
			placeholder: '这里输入文字...'
		});

		this.editor.on('valuechanged', (e, src) => {
			let editorContent = this.editor.getValue();
			PubSub.publish('EDITORDATA', editorContent);
		})
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.defData !== nextProps.defData) {
			this.editor.setValue(nextProps.defData);
		}
	}

	render() {
		return (
			<textarea id="editor" placeholder="这里输入文字..." autoFocus ></textarea>
		)
	}
}

export default RichEditor;