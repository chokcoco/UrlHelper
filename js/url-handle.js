//注入页面的脚本文件
;$(function() {
	var $container = $('.g-list');
	var url = window.location.href;
	var result = parseURL(url);
	var params = result.params;
	
	var dom = createTemplate(params);


	function createTemplate(params) {
		var dom = "";

		for(key in params) {
			dom += `
					<li>
						${key}：
						<input type="text" value="${params[key]}">
					</li>		
					`
		}

		$container.append(dom);
		console.log('dom', dom);
	}

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
})