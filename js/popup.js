$(function () {

    var paramList = (function(){
        var key = localStorage.getItem('key');
        console.log('key', key);

        /**
         * 根据参数个数创建 DOM 结构
         * @param {JSON String} obj 
         * @param {Array} sortKeys 
         */
        function createTpl(obj, sortKeys) {
            var paramsObj = JSON.parse(obj);
            var dom = "";
            var argLength = arguments.length;

            if(argLength === 1) {
                for (var key in paramsObj) {
                    var value = paramsObj[key];

                    dom += tpl(key, value);
                }
            } else if(argLength === 2) {
                for (var j=0; j<sortKeys.length; j++) {
                    var sortkey = sortKeys[j];

                    dom += tpl(sortkey, paramsObj[sortkey]);
                }
            }

            $('.g-list').html('').append(dom);
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
                                <label class="label">${key}</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <input class="input is-small paramValue" type="text" placeholder="empty" value="${value}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>`;
        }

        /**
         * 事件绑定
         */
        function evnetBind() {
            $(document).on('click', '.j-decode', function(e) {
                var params = $('.paramValue');
                var length = params.length;

                for(var i=0; i<length; i++) {
                    var elem = params.eq(i);

                    elem.val(decodeURIComponent(elem.val()));
                }
            });

            $(document).on('click', '.j-encode', function(e) {
                var params = $('.paramValue');
                var length = params.length;

                for(var i=0; i<length; i++) {
                    var elem = params.eq(i);

                    elem.val(encodeURIComponent(elem.val()));
                }
            });

            $(document).on('click', '.j-sort', function(e) {     
                var sortKey = sort(key);

                createTpl(key, sortKey);
            });
        }

        /**
         * 对参数排序
         * @param {JSON String} obj 
         */
        function sort(obj) {
            var paramsObj = JSON.parse(obj);

            keysSorted = Object.keys(paramsObj).sort(function(a, b){
                if (a[0].toLowerCase() > b[0].toLowerCase()) {
                    return 1;
                } else {
                    return -1;
                }
            });

            return keysSorted;
        }

        return {
            init: function() {
                createTpl(key);
                evnetBind();
            }
        }
    })();

    paramList.init();

});
