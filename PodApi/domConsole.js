const console = {
    log(msg) {
        postOffice.log(JSON.stringify(msg));
    },
    error(msg) {
        postOffice.log(JSON.stringify(msg));
    },
    dir(object) {
        postOffice.log(JSON.stringify(object));
    }
};
