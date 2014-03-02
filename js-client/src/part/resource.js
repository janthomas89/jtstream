'use strict';

/*
 * ResourcePart
 */
var loadedResources = {};

module.exports = function(stream, payload, callback) {
    var url = payload.resourceUrl;
    var type = payload.resourceType;

    if (type != 'js' && type != 'css') {
        throw new Error('invalid resource type: ' + type);
    }

    if (loadedResources.hasOwnProperty(url)) {
        if (loadedResources[url] === true) {
            callback && callback();
        } else if(callback) {
            loadedResources[url].push(callback);
        }

        return;
    }

    loadedResources[url] = [callback];

    var tmpCallback = function() {
        var urls = loadedResources[url];
        urls.forEach(function(callback) {
            callback && callback();
        });

        loadedResources[url] = true;
    };

    if (type == 'js') {
        stream.util.requireScript(url, tmpCallback);
    } else if (type == 'css') {
        stream.util.requireStyle(url, tmpCallback);
    }
};