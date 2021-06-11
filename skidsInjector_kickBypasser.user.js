// ==UserScript==
// @name         ArktosSploit Loader and Kick Bypass
// @supportURL   http://paypal.me/sn8ow
// @homepage     https://blocksploit.github.io/
// @iconURL      https://i.imgur.com/y4xvKAH.png
// @version      0.2
// @description  try to take over the world!
// @author       Sn8ow
// @require      https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js
// @match        *://venge.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

let isType = function(item, type) {
    return typeof item === type;
}

let isDefined = function(item) {
    return !isType(item, "undefined") && item !== null;
}

let downloadScript = function(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false /*async bool*/);
    xhr.send();
    if (xhr.status != 200) {
        alert("Error Downloading Blocksploit");
        return null;
    }
    return xhr.responseText;
}

let injectScript = function(doc, text) {
    if (!doc) { return; }
    let script;
    try {
        script = doc.createElement("script");
        script.appendChild(doc.createTextNode(text));
        (doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement).appendChild(script);
    } catch (ex) {}
    if (script) {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        script.textContent = "";
    }
};

let waitFor = async function(test, timeout_ms = 20000, doWhile = null) {
    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    return new Promise(async (resolve, reject) => {
        if (typeof timeout_ms != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
        let result, freq = 100;
        while (result === undefined || result === false || result === null || result.length === 0) {
            if (doWhile && doWhile instanceof Function) doWhile();
            if (timeout_ms % 1000 < freq) console.log("waiting for: ", test);
            if ((timeout_ms -= freq) < 0) {
                console.log( "Timeout : ", test );
                resolve(false);
                return;
            }
            await sleep(freq);
            result = typeof test === "string" ? Function(test)() : test();
        }
        console.log("Passed : ", test);
        resolve(result);
    });
}

window.WebSocket = new Proxy(window.WebSocket, {
    construct: function(target, args) {
        const ws = new target(...args);

        const openHandler = (event) => {
            console.log("Open", event);
            window.wsSend = ws.send.bind(ws);
        };

        const messageHandler = (event) => {
            let typedArray = new Uint8Array(event.data);
            let [id, ...data] = window.msgpack.decode(typedArray);
            switch(id) {
                default: break;
            }
            Object.defineProperty(event, "data", {configurable: true, value: window.msgpack.encode([id, ...data]).buffer});
        };

        const closeHandler = (event) => {
            console.log("Close", event);
            ws.removeEventListener("open", openHandler);
            ws.removeEventListener("message", messageHandler);
            ws.removeEventListener("close", closeHandler);
        };

        ws.addEventListener("open", openHandler);
        ws.addEventListener("message", messageHandler);
        ws.addEventListener("close", closeHandler);

        ws.send = new Proxy(ws.send, {
            apply(target, that, [data]) {
                let typedArray = new Uint8Array(data);
                let [id, ...msg] = window.msgpack.decode(typedArray);
                //if (id !== "p") console.log(id, msg)
                switch(id) {
                    case "guard":msg=[true];break;
                    case "discard_object":return;
                    default: break;
                }
                return target.apply(that, [new Uint8Array([...window.msgpack.encode([id, ...msg]), ...data.slice(data.length - 2)])]);
            }
        })

        return ws;
    }
});

let script = downloadScript("https://raw.githubusercontent.com/blocksploit/blocksploit/main/custominject.js");

window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    injectScript(document, script);
    waitFor(_=>isDefined(window.NetworkManager)).then(_=>{

        window.NetworkManager.prototype.kick = new Proxy(window.NetworkManager.prototype.kick, {
            apply(target, that, [type]) {
                console.log("Blocked Kick ",type[0])
                //var t = type[0];
                //this.app.fire("Overlay:Info", "You have been kicked. Reason : " + t),
                //this.app.mouse.disablePointerLock(),
                //this.app.fire("Player:Lock", !1),
                //this.app.fire("Overlay:Pause", !1)
                //return target.apply(that, [type]);
            }
        })
    })
});
