const { port1, port2 } = new MessageChannel();

function initIframe(el) {
    port1.start();
    port1.onmessage = (event) => {
        // incoming msgpack-encoded events:
        webkit.messageHandlers.event.postMessage(event.data);
    };
    // This is transferring ownership of port2 to the content window
    el.contentWindow.postMessage("", "*", [port2]);
}
