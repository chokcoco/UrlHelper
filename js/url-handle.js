//注入页面的脚本文件
$(function() {
    var url = window.location.href;
    var result = parseURL(url);
    var params = result.params;

    var dom = sendMsg(JSON.stringify(params));

    var resOK = {
        farewell: "content script send response back..."
    };

    var resError = {
        farewell: "content script hasError!"
    };

    function parseURL(url) {
        var a = document.createElement("a");
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(":", ""),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                    seg = a.search.replace(/^\?/, "").split("&"),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split("=");
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/([^/?#]+)$/i) || [, ""])[1],
            hash: a.hash.replace("#", ""),
            path: a.pathname.replace(/^([^/])/, "/$1"),
            relative: (a.href.match(/tps?:\/[^/]+(.+)/) || [, ""])[1],
            segments: a.pathname.replace(/^\//, "").split("/")
        };
    }

    /**
     * 事件派发
     * @param [Object] data
     */
    function receiveSet(data) {
        var type = data.type;

        switch (type) {
            // 刷新页面
            case 1:
                refreshPage(data.msg);
                break;
        }
    }

    /**
     * 刷新页面
     * @param {String} msg 参数信息
     */
    function refreshPage(msg) {
        var location = document.location.href.split("?")[0];
        var gotoUrl = location + "?" + msg;

        document.location.href = gotoUrl;
    }

    // 脚本通信
    function sendMsg(obj) {
        // 发送消息
        chrome.runtime.sendMessage(
            {
                msg: obj,
                result: 1
            },
            function(response) {
                if (response && response.msg) {
                    console.log(response.msg);
                }
            }
        );

        // 接收消息
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log(sender.tab ? "来自内容脚本：" + sender.tab.url : "来自扩展程序");

            if (request && !request.result) {
				console.log(result.msg);
                receiveSet(request);
            }
        });
    }
});
