'use strict';

/*
 * HTMLPart
 */
module.exports = function(stream, payload) {
   stream.util[payload.mode || 'replace'](payload.id, payload.html);
};