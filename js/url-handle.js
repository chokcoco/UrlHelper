//注入页面的脚本文件
;$(function() {
	var url = window.location.href;
	var result = parseURL(url);
	var params = result.params;
	
	var dom = sendMsg(JSON.stringify(params));

	function parseURL(url) {
		var a =  document.createElement('a');
		a.href = url;
		return {
			source: url,
			protocol: a.protocol.replace(':',''),
			host: a.hostname,
			port: a.port,
			query: a.search,
			params: (function(){
				var ret = {},
					seg = a.search.replace(/^\?/,'').split('&'),
					len = seg.length, i = 0, s;
				for (;i<len;i++) {
					if (!seg[i]) { continue; }
					s = seg[i].split('=');
					ret[s[0]] = s[1];
				}
				return ret;
			})(),
			file: (a.pathname.match(/([^/?#]+)$/i) || [,''])[1],
			hash: a.hash.replace('#',''),
			path: a.pathname.replace(/^([^/])/,'/$1'),
			relative: (a.href.match(/tps?:\/[^/]+(.+)/) || [,''])[1],
			segments: a.pathname.replace(/^\//,'').split('/')
		};
	}

	// 脚本通信
	function sendMsg(obj) {
		console.log('sendMsg');
		
		chrome.runtime.sendMessage({
			msg: obj,
			result: 1
		}, function(response) {

			if(response && response.msg) {
				console.log(response.msg);
			}
		});
	}
})