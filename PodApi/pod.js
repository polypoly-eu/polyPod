const preferences = {
    get: function(key) {
        return new Promise((resolve, reject) => {
            postOffice.postMessage({ command: "getValue", key }, response => {
                resolve(response);
            });
        });
    },
    set: function(key, value) {
        return new Promise((resolve, reject) => {
            postOffice.postMessage({ command: "setValue", key, value }, response => {
                resolve(response);
            });
        });
    }
};

const polyOut = {
    httpRequest: function(url, method, body, headers) {
        return new Promise((resolve, reject) => {
            const requestHeaders = headers ? JSON.stringify(headers) : "";
            postOffice.postMessage({ command: "httpRequest", request: {url: url, method: method, body: body, headers: requestHeaders } }, response => {
                resolve(response);
            });
        });
    }
};

const polyIn = {
    add: function(...quads) {
        return new Promise((resolve, reject) => {
            postOffice.postMessage({ command: "addQuads", quads }, response => {
                resolve(response);
            });
        });
    },
    select: function(matcher) {
        return new Promise((resolve, reject) => {
            postOffice.postMessage({ command: "selectQuads", matcher }, response => {
                resolve(response);
            });
        });
    }
}

const pod = {
    preferences: preferences,
    polyOut: polyOut,
    polyIn: polyIn
};
