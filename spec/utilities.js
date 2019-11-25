var http = require('http');

var httpRequest = {
    get: (url) => {
        return new Promise(function(resolve, reject) {
            http.get(url, (res) => {
                resolve(res);
            });
        });
    }
};

module.exports = {
    httpRequest: httpRequest
};