const preferences = {
    get: function(key) {
        return new Promise((resolve, reject) => {
            postOffice.getValue(key, response => {
                resolve(response);
            });
        });
    },
    set: function(key, value) {
        return new Promise((resolve, reject) => {
            postOffice.setValue(key, JSON.stringify(value), response => {
                resolve(response);
            });
        });
    }
};

const polyOut = {
    httpRequest: function(url, method, body, headers) {
        return new Promise((resolve, reject) => {
            const requestHeaders = headers ? JSON.stringify(headers) : "";
            postOffice.httpRequest({ url: url, method: method, body: body, headers: requestHeaders }, response => {
                resolve(response);
            });
        });
    }
};

const pod = {
    preferences: preferences,
    polyOut: polyOut
};
