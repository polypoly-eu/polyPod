const {port1, port2} = new MessageChannel();

function initIframe(el) {
  port1.start();
  port1.onmessage = event => {
    // incoming msgpack-encoded events:
    webkit.messageHandlers.event.postMessage(event.data);
  };
  el.contentWindow.postMessage("", "*", [port2]);

  // outgoing msgpack-encoded events:
  //port1.postMessage(...)
}
