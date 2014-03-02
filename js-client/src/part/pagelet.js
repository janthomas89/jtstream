'use strict';

/*
 * PageletPart
 */

var Barrier = require('../util/barrier.js');

var processJS = function(stream, payload) {
    var jsCallback = stream.getCallback('js');
    var resourceCallback = stream.getCallback('resource');

    /* Optional inline JS */
    var barrier = new Barrier(function() {
        var scripts = payload.js || [];
        scripts.forEach(function(text) {
            jsCallback(stream, {
                text: text
            });
        });
    });

    /* Optional JS resources */
    var resources = payload.jsResources || [];
    resources.forEach(function(url) {
        var payload = {
            resourceType: 'js',
            resourceUrl: url
        };
        resourceCallback(stream, payload, barrier.getRelease());
    });

    /* Release the Barrier if there are no js resources */
    (barrier.getRelease())();
};

var processCSS = function(stream, payload) {
    var cssCallback = stream.getCallback('css');
    var resourceCallback = stream.getCallback('resource');

    /* Optional CSS resources */
    var resources = payload.cssResources || [];
    resources.forEach(function(url) {
        resourceCallback(stream, {
            resourceType: 'css',
            resourceUrl: url
        });
    });

    /* Optional inline CSS */
    var styles = payload.css || [];
    styles.forEach(function(text) {
        cssCallback(stream, {
            text: text
        });
    });
};

module.exports = function(stream, payload) {
    var htmlCallback = stream.getCallback('html');

    processCSS(stream, payload);
    htmlCallback(stream, payload);
    processJS(stream, payload);
};
