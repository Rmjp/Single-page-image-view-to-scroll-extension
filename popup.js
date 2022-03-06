var activeTab;

function buttonid(){
    namediv = document.getElementById("input-name").value;
    url = 'WFF.html?name=' + namediv + '&ad=id' + '&url=' + activeTab;
    window.open(url)
};

function buttonclass(){
    namediv = document.getElementById("input-name").value;
    url = 'WFF.html?name=' + namediv + '&ad=class' + '&url=' + activeTab;
    window.open(url)
};

window.onload = function () {
    document.getElementById("button-id").onclick = buttonid;
    document.getElementById("button-class").onclick = buttonclass;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        activeTab = tabs[0].url;
    });
}