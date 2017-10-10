/**
 * Created by Kaiser on 2017/9/16.
 * basic ajax
 */
function ajax (data, success, fail) {
	let xmlhttp
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest()
	} else {
		xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP')
	}
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 0) {
			console.log('请求未初始化')
		} else if (xmlhttp.readyState === 1) {
			console.log('服务器连接已建立')
		} else if (xmlhttp.readyState === 2) {
			console.log('请求已接收')
		} else if (xmlhttp.readyState === 3) {
			console.log('请求处理中')
		} else if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			success && success(JSON.parse(xmlhttp.response))
		} else {
			console.log('error:')
			console.log(xmlhttp)
			fail && fail(xmlhttp)
		}
	}
	xmlhttp.open(data.type, data.url, true)
	xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*')
	xmlhttp.setRequestHeader('Content-type', 'application/json' || data['content-type'])
	xmlhttp.send()
}

module.exports = ajax
