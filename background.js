// var container;
// var activeTab;

// function disableclick(e){
//     e.preventDefault();
// }

// function getidorclass(e){
//     var t = e.target;
//     container = (e.id != null)? e.id : e.classname;
//     document.removeEventListener('click', disableclick, false);

//     url = 'WFF.html?name=' + container + '&ad=id' + '&url=' + activeTab;
//     window.open(url)
// };
let url = this.serviceWorker.scriptURL;
url = url.replace("background.js", '');

function injected(urlinit){
    var container;
    var activeTab;

    activeTab = document.location.href;

    function disableclick(e){
        e.preventDefault();
    };

    function getidorclass(e){
        var t = e.target;

        let chk_img = 0, chk_a = 0;
        while(chk_img == 0 || chk_a == 0){
            let x = t.getElementsByTagName('img');
            if(x.length > 0) chk_img = 1;
            let y = t.getElementsByTagName('a');
            if(y.length > 0) chk_a = 1;
            if(chk_img == 0 || chk_a == 0) t = t.parentElement;
        }

        container = (t.id != null)? t.id : t.className;
        while(container == null){
            t = t.parentElement;
            container = (t.id != null)? t.id : t.className;
        }

        document.removeEventListener('mousedown', getidorclass, false);
        document.removeEventListener('click', disableclick, false);
        url = urlinit + 'WFF.html?name=' + container + '&ad=id' + '&url=' + activeTab;
        window.open(url)
    };
    document.addEventListener('mousedown', getidorclass, false);
    document.addEventListener('click', disableclick, false);
}

chrome.action.onClicked.addListener((tab) => {
    if(!tab.url.includes("extension://")) {
        chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injected,
        args: [url],
    });
}
});