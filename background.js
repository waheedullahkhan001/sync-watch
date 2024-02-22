let storage = {};

function sendMsg(tabId, msg) {
    chrome.tabs.sendMessage(tabId, msg)
        .catch(console.error);
}

function sendMsgToNHM(port, msg) {
    port.postMessage({message: msg});
}

function setUpNMH(tabId, serverAddress) {
    let port = chrome.runtime.connectNative(
        'com.interlinked.nc' // TODO: Change this!
    );

    storage[tabId] = port;

    port.onMessage.addListener((message) => {
        sendMsg(tabId, message);
    });

    port.onDisconnect.addListener(() => {
        delete storage[tabId];
        sendMsg(tabId, {message: 'disconnected'});
    });

    sendMsgToNHM(port, 'connect ' + serverAddress);
}

function setUpMessaging() {
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.message.startsWith("connect")) {
                let serverAddress = request.message.split(" ", 2)[1];
                setUpNMH(sender.tab.id, serverAddress);
                return;
            }

            let port = storage[sender.tab.id];
            sendMsgToNHM(port, request.message);
        }
    );
}

function setUpActionListener() {
    chrome.action.onClicked.addListener((tab) => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['content.js']
        }).catch(console.error);
    });
}

function main() {
    setUpActionListener();
    setUpMessaging();
}

main();