/*
 * @Author: lle_wang
 * @Date:   2018-04-21 17:09:42
 * @Last Modified by:   lle_wang
 * @Last Modified time: 2018-04-22 14:24:30
 */
class MUtil {
	request(param) {
		return new Promise(function(resolve, reject) {
			$.ajax({
				url: param.url,
				dataType: 'json',
				type: param.type || 'get',
				data: param.data || '',
				success(res) {
					resolve(res);
				},
				error(err) {
					reject(err);
				}
			});
		});
	}
}

export default MUtil;