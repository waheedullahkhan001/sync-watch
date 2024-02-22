
let hostExists = false;
let videoElement = null;
let serverAddress = null;

function collectInputs() {
    let videoXPath = prompt("Paste the video element XPath here: ");

    if (videoXPath === null) {
        return false;
    }

    videoElement = getElementByXpath(videoXPath);

    if (videoElement === null) {
        alert("Could not find the video element, please double check the XPath.");
        return false;
    }

    if (videoElement.tagName.toLowerCase() !== "video") {
        alert("The element is not a video element.");
        videoElement = null;
        return false;
    }

    serverAddress = prompt("Enter the server address: ", "localhost:8888");

    if (serverAddress === null) {
        alert("Server address cannot be empty.");
        return false;
    }

    return true;
}

function setUpMessaging() {
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request.message === "hey") {
                if (!hostExists) {
                    sendResponse({message: "iamhost"});
                }
                return;
            }
            if (request.message === "iamhost") {
                hostExists = true;
                return;
            }
            // TODO: Handle more messages
        }
    );
}

function onInject() {

    if (!collectInputs()) {
        return;
    }

    setUpMessaging();
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

onInject();