$(function () {

    var paramList = (function(){
        var key = localStorage.getItem('key');
        console.log('key', key);


        function createTpl(obj) {
            var paramsObj = JSON.parse(obj);
            var dom = "";

            for (var key in paramsObj) {
                var value = paramsObj[key];

                dom += `<li>
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

            $('.g-list').append(dom);
        }

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
