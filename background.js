function setUpMessaging() {
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            // TODO: Handle messages
        }
    );
}

function setUpActionListener() {
    chrome.action.onClicked.addListener((tab) => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['content.js']
        }).then().catch(console.error);
    });
}

function main() {
    setUpActionListener();
    setUpMessaging();
}

main();