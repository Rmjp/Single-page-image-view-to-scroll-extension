
async function httpGet (url) {

    let res = await fetch(url, {
    "headers": {
        "accept": "*/*",
        "accept-language": "th,en-US;q=0.9,en;q=0.8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "access-control-request-headers": "access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,access-control-expose-headers",
        "access-control-request-method": "OPTIONS"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
    });
    return res;
}

var main = "";
var activeTab = "";
async function getimg(url){
    let count = 0;
    let cut = 0;
    for(let i=0; i<url.length; i++){
        if(url[i] == '/') count++;
        if(count == 3) {
            cut = i;
            break;
        }
    }
    activeTab = url.substring(0, cut);
    url = url.replace('file:///C:', '');
    url = url.replace(activeTab, '');
    if(url[0] == '/'){
        url = main+url;
    }

    let res = await httpGet(url);
    let text = await res.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, 'text/html');
    return doc;
}

async function funt(){
    var web_url = "";
    var here = document.getElementById('here');
    web_url = (document.getElementsByClassName('web_scc')[0].value);

    let count = 0;
    let cut = 0;
    for(let i=0; i<web_url.length; i++){
        if(web_url[i] == '/') count++;
        if(count == 3) {
            cut = i;
            break;
        }
    }
    main = web_url.substring(0, cut);

    var id_img = 'img';
    var div_id = document.getElementsByClassName('div_scc')[0].value;
    if(div_id != '') id_img = div_id;
    
    let doc = getimg(web_url);
    let i = (await doc).getElementById(id_img);
    if(i == null) i = (await doc).getElementsByClassName(id_img)[0];
    let next = i.getElementsByTagName('a')[0].href;
    let img = i.getElementsByTagName('img')[0];
    img.style = "";
    here.appendChild(img);
    let prev = web_url;
    while(next != prev){
        doc = getimg(next);
        i = (await doc).getElementById(id_img);
        if(i == null) i = (await doc).getElementsByClassName(id_img)[0];
        prev = next;
        next = i.getElementsByTagName('a')[0].href;
        img = i.getElementsByTagName('img')[0];
        img.style = "";
        here.appendChild(img);
    }
}

var thisTab = "";

window.onload = async function () {
    thisTab = window.location.origin;
    cors.install();
    document.getElementById("button1").onclick = funt;

    const params = new URLSearchParams(window.location.search);
    document.getElementsByClassName('web_scc')[0].value = params.get('url');
    document.getElementsByClassName('div_scc')[0].value = params.get('name');
    funt();
}