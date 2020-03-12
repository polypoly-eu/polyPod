const polyOut = {
    httpRequest: function(url, method, body) {
        return new Promise((resolve, reject) => {
            postOffice.postMessage({ command: "httpGetRequest", url }, response => {
                resolve(response);
            });
        });
    }
};

const pod = {
    polyOut: polyOut
};
