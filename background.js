// get extension url
let url = this.serviceWorker.scriptURL;
url = url.replace("background.js", '');

// ingected funtion on current tab when click icon
function injected(urlinit){
    var container;
    var activeTab;

    // current url
    activeTab = document.location.href;

    // disable default click command
    function disableclick(e){
        e.preventDefault();
    };

    // when click
    function getidorclass(e){

        document.body.style.cursor = "";

        var t = e.target;

        // loop until found img and link
        let chk_img = 0, chk_a = 0;
        while(chk_img == 0 || chk_a == 0){
            let x = t.getElementsByTagName('img');
            if(x.length > 0) chk_img = 1;
            let y = t.getElementsByTagName('a');
            if(y.length > 0) chk_a = 1;
            if(chk_img == 0 || chk_a == 0) t = t.parentElement;
        }

        // until has id
        container = t.id;
        while(container == null){
            t = t.parentElement;
            container = t.id;
        }

        document.removeEventListener('mousedown', getidorclass, false);
        document.removeEventListener('click', disableclick, false);
        url = urlinit + 'WFF.html?name=' + container + '&ad=id' + '&url=' + activeTab;
        window.open(url);
    };

    document.body.style.cursor = "crosshair";
    document.addEventListener('mousedown', getidorclass, false);
    document.addEventListener('click', disableclick, false);
}

// add action when click icon
chrome.action.onClicked.addListener((tab) => {
    if(!tab.url.includes("extension://")) {
        chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injected,
        args: [url],
    });
}
});