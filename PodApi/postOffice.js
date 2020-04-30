class PostOffice {
    constructor() {
        this.messageId = 1;
        this.registry = new Map();
        window.addEventListener("message", this.receiveMessage.bind(this), false);
    }
    
    postMessage(messageData, callback) {
        if (typeof callback !== 'undefined') {
            let id = this.messageId++;
            this.registry.set(id, callback);
            
            window.parent.postMessage({ id, ...messageData }, "*");
        } else {
            window.parent.postMessage(messageData, "*");
        }
    }

    receiveMessage(event) {
        let data = event.data;
        if (data.id) {
            let callback = this.registry.get(data.id);
            this.registry.delete(data.id);
            callback(data.result);
        }
    }
}

const postOffice = new PostOffice();
