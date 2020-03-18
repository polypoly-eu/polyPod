class PostOffice {
    constructor() {
        this.messageId = 1;
        this.registry = new Map();
    }

    log(text) {
        let data = { text }
        
        webkit.messageHandlers.log.postMessage(data);
    }
    
    getValue(key, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, key }
        
        webkit.messageHandlers.getValue.postMessage(data);
    }
    
    setValue(key, value, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
         let data = { id, key, value }
        
        webkit.messageHandlers.setValue.postMessage(data);
    }
    
    httpRequest(request, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, ...request }
        
        webkit.messageHandlers.httpRequest.postMessage(data);
    }
    
    addQuads(object, cb) {
        let id = this.messageId++;
        this.registry.set(id, cb);
        
        let data = { id, ...object }
        
        webkit.messageHandlers.addQuads.postMessage(data);
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
