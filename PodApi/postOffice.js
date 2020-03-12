class PostOffice {
    constructor() {
        this.messageId = 1;
        this.registry = new Map();
    }

    postMessage(message, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, ...message }
        
        if (data.command === "log") {
            webkit.messageHandlers.log.postMessage(data);
        } else if (data.command === "httpGetRequest") {
            webkit.messageHandlers.httpGetRequest.postMessage(data);
        } else {
            respond({ id: data.id, error: `Unknown command: ${data.command}` });
        }
    }

    receiveMessage(data) {
        if (data.id) {
            let cb = this.registry.get(data.id);
            this.registry.delete(data.id);
            cb(data.result);
        }
    }
}

const postOffice = new PostOffice();
