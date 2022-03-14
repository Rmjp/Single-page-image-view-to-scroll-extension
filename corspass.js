"use strict";
const prefs = {
  "overwrite-origin": true,
  methods: [
    "GET",
    "PUT",
    "POST",
    "DELETE",
    "HEAD",
    "OPTIONS",
    "PATCH",
    "PROPFIND",
    "PROPPATCH",
    "MKCOL",
    "COPY",
    "MOVE",
    "LOCK",
  ],
  "remove-x-frame": true,
  "allow-credentials": true,
  "allow-headers-value": "*",
  "allow-origin-value": "*",
  "expose-headers-value": "*",
  "allow-headers": false,
  "unblock-initiator": true,
};
const cors = {};
const redirects = {};
chrome.tabs.onRemoved.addListener((tabId) => delete redirects[tabId]);
cors.onBeforeRedirect = (d) => {
  if (d.type === "main_frame") {
    return;
  }
  redirects[d.tabId] = redirects[d.tabId] || {};
  redirects[d.tabId][d.requestId] = true;
};

cors.onHeadersReceived = (d) => {
  if (d.type === "main_frame") {
    return;
  }
  const { initiator, originUrl, responseHeaders, requestId, tabId } = d;
  let origin = "*";
  const redirect = redirects[tabId] ? redirects[tabId][requestId] : false;
  if (prefs["unblock-initiator"] && redirect !== true) {
    try {
      const o = new URL(initiator || originUrl);
      origin = o.origin;
    } catch (e) {
      console.warn("cannot extract origin for initiator", initiator);
    }
  } else {
    origin = "*";
  }
  if (redirects[tabId]) {
    delete redirects[tabId][requestId];
  }

  var o = responseHeaders.find(
    ({ name }) => name.toLowerCase() === "access-control-allow-origin"
  );

  if (o) {
    if (o.value !== "*") {
      o.value = "*";
    }
  } else {
    responseHeaders.push({
      name: "Access-Control-Allow-Origin",
      value: "*",
    });
  }

  o = responseHeaders.find(
    ({ name }) => name.toLowerCase() === "access-control-allow-headers"
  );
  if (o) {
    o.value = "*";
  } else {
    responseHeaders.push({
      name: "Access-Control-Allow-Headers",
      value: "*",
    });
  }

  const i = responseHeaders.findIndex(
    ({ name }) => name.toLowerCase() === "x-frame-options"
  );
  if (i !== -1) {
    responseHeaders.splice(i, 1);
  }

  o = responseHeaders.find(
    ({ name }) => name.toLowerCase() === "access-control-expose-headers"
  );
  if (o) {
    o.value = "*";
  } else {
    responseHeaders.push({
      name: "Access-Control-Expose-Headers",
      value: "*",
    });
  }

  o = responseHeaders.find(
    ({ name }) => name.toLowerCase() === "access-control-allow-headers"
  );
  if (o) {
    o.value = "*";
  } else {
    responseHeaders.push({
      name: "Access-Control-Allow-Headers",
      value: "*",
    });
  }

  o = responseHeaders.find(
    ({ name }) => name.toLowerCase() === "access-control-allow-origin"
  );
  if (!o || o.value !== "*") {
    const o = responseHeaders.find(
      ({ name }) => name.toLowerCase() === "access-control-allow-credentials"
    );
    if (o) {
      o.value = "true";
    } else {
      responseHeaders.push({
        name: "Access-Control-Allow-Credentials",
        value: "true",
      });
    }
  }

  o = responseHeaders.find(
    ({ name }) => name.toLowerCase() === "access-control-allow-methods"
  );
  if (o) {
    o.value = [
      ...new Set([...prefs.methods, ...o.value.split(/\s*,\s*/)]),
    ].join(", ");
  } else {
    responseHeaders.push({
      name: "Access-Control-Allow-Methods",
      value: prefs.methods.join(", "),
    });
  }

  return { responseHeaders };
};

cors.install = () => {
  console.log("install");
  cors.remove();
  const extra = ["blocking", "responseHeaders"];
  if (/Firefox/.test(navigator.userAgent) === false) {
    extra.push("extraHeaders");
  }
  chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
    urls: ["chrome-extension://*/WFF.html"],
  });
  chrome.webRequest.onBeforeRedirect.addListener(cors.onBeforeRedirect, {
    urls: ["chrome-extension://*/WFF.html"],
  });
};
cors.remove = () => {
  chrome.webRequest.onHeadersReceived.removeListener(cors.onHeadersReceived);
  chrome.webRequest.onBeforeRedirect.removeListener(cors.onBeforeRedirect);
};
