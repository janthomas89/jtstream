'use strict';

/*
 * JSPart for inline JS
 */
module.exports = function(stream, payload) {
    stream.util.evalScript(payload.text || '');
};