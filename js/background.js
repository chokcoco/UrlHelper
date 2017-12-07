console.log("start");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.result) {
        sendResponse({
            farewell: "ok"
        });
    }

    localStorage.setItem("key", request.msg);
});

// 扩展向内容脚本发送消息
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(
        tab.id,
        {
            greeting: "hello to content script!"
        },
        function(response) {
            console.log(response.farewell);
        }
    );
});

console.log("end");
