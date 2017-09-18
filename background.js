console.log('start');

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.result)
            sendResponse({
                farewell: "ok"
            });

        localStorage.setItem('key', request.msg);
    });

console.log('end');