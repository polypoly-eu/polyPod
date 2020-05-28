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
    fetch: function(url, init) {
        return new Promise((resolve, reject) => {
            postOffice.postMessage({ command: "httpRequest", request: {url: url, init: init } }, response => {
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
