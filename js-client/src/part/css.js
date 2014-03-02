'use strict';

/*
 * CSSPart for inline CSS
 */
module.exports = function(stream, payload) {
    stream.util.evalStyle(payload.text || '');
};