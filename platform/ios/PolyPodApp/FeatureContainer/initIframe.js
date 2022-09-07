const { port1 } = new MessageChannel();

function initIframe(el) {
    port1.start();
    port1.onmessage = (event) => {
        // incoming msgpack-encoded events:
        webkit.messageHandlers.event.postMessage(event.data);
    };
}
