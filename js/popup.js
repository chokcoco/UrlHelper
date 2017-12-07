$(function() {
    var paramList = (function() {
        var key = localStorage.getItem("key");

        /**
         * 根据参数个数创建 DOM 结构
         * @param {JSON String} obj
         * @param {Array} sortKeys
         */
        function createTpl(obj, sortKeys) {
            var paramsObj = JSON.parse(obj);
            var dom = "";
            var argLength = arguments.length;

            if (argLength === 1) {
                for (var key in paramsObj) {
                    var value = paramsObj[key];

                    dom += tpl(key, value);
                }
            } else if (argLength === 2) {
                for (var j = 0; j < sortKeys.length; j++) {
                    var sortkey = sortKeys[j];

                    dom += tpl(sortkey, paramsObj[sortkey]);
                }
            }

            $(".g-list")
                .html("")
                .append(dom);
        }

        /**
         * 单个参数 li 模板
         * @param {String} key
         * @param {String} value
         */
        function tpl(key, value) {
            return `<li>
                        <div class="field is-horizontal">
                            <div class="field-label ">
                                <label class="label g-param-name">${key}</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <input id="${key}" class="input is-small paramValue" type="text" placeholder="empty" value="${value}">
                                        <a class="button is-outlined is-small j-copy" data-clipboard-action="copy" data-clipboard-target="#${key}">复制</a>
                                        <a class="button is-outlined is-small j-decode" data-isDecode="0">解码</a>
                                        <a class="button is-outlined is-small j-delete">删除</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>`;
        }

        /**
         * 对参数排序
         * @param {JSON String} obj
         */
        function sort(obj) {
            var paramsObj = JSON.parse(obj);

            keysSorted = Object.keys(paramsObj).sort(function(a, b) {
                if (a[0].toLowerCase() > b[0].toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });

            return keysSorted;
        }

        /**
         * 查找过滤
         * @param {String} val
         */
        function searchFilter(val) {
            var $li = $(".g-list li");

            if (!val.length) {
                $li.show();
                return;
            }

            for (var i = 0; i < $li.length; i++) {
                var elem = $li.eq(i);
                var isExist =
                    elem
                        .find(".label")
                        .text()
                        .indexOf(val) > -1
                        ? true
                        : false;

                if (!isExist) {
                    elem.hide();
                } else {
                    elem.show();
                }
            }
        }

        /**
         * 复制功能
         */
        function copy() {
            var clipboard = new Clipboard(".j-copy");
        }

        function sendMessage(obj) {

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, obj, function(response) {
                    console.log("Send Success");
                    console.log(response.farewell);
                });
            });
        }

        /**
         * 事件绑定
         */
        function evnetBind() {
            $(document).on("click", ".j-decode", function(e) {
                var params = $(".paramValue");
                var length = params.length;
                var elem = $(this)
                    .parent(".control")
                    .find("input");

                if ($(this).attr("data-isDecode") == "0") {
                    elem.val(decodeURIComponent(elem.val()));
                    $(this)
                        .attr("data-isDecode", 1)
                        .text("编码");
                } else {
                    elem.val(encodeURIComponent(elem.val()));
                    $(this)
                        .attr("data-isDecode", 0)
                        .text("解码");
                }
            });

            $(document).on("click", ".j-sort", function(e) {
                var sortKey = sort(key);

                createTpl(key, sortKey);
            });

            $(document).on("input", ".j-search", function(e) {
                var val = $(this).val();
                console.log("val", val);
                searchFilter(val);
            });

            $(document).on("click", ".j-delete", function(e) {
                $(this)
                    .parents("li")
                    .remove();
            });

            $(document).on("click", ".j-refresh", function(e) {
                var list = $(".g-list li");
                var length = list.length;
                var params = "";
                var i = 0;

                for (; i < length; i++) {
                    var li = list.eq(i);

                    params += li.find(".g-param-name").text() + "=" + li.find(".paramValue").val() + "&";
                }

                sendMessage({
                    result: 0,
                    type: 1,
                    msg: params
                });
            });
        }
        return {
            init: function() {
                createTpl(key);
                evnetBind();
                copy();
            }
        };
    })();

    paramList.init();
});
