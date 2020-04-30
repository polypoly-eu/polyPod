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
    
    getValue(key, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, key }
        
        window.parent.postMessage({ command: "getValue", ...data }, "*");
    }
    
    setValue(key, value, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, key, value }
        
        window.parent.postMessage({ command: "setValue", ...data }, "*");
    }
    
    addQuads(quads, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, quads }
        
        window.parent.postMessage({ command: "addQuads", ...data }, "*");
    }
    
    selectQuads(matcher, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, matcher }
        
        window.parent.postMessage({ command: "selectQuads", ...data }, "*");
    }

    receiveMessage(event) {
        let data = event.data;
        if (data.id) {
            let cb = this.registry.get(data.id);
            this.registry.delete(data.id);
            cb(data.result);
        }
    }
}

const postOffice = new PostOffice();
