'use strict';

var uniqueSequence = 0;

module.exports = {
    /**
     * Noop function for default callbacks.
     *
     * @private
     */
    noop: function() { },

    /**
     * Factory for generating unique Stream Ids.
     *
     * @return {string} A unique ID
     * @private
     */
    uniqueId: function() {
        var rand = function() {
            return ((1 + Math.random() * 0x10000) | 0).toString(16).substring(1);
        }
        return rand() + rand() + '-' +  (++uniqueSequence);
    },

    /**
     * Own implementation of the extend function.
     *
     * @param {object} obj the object to be extended
     * @return {object} the extended object
     * @private
     */
    extend: function(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });

        return obj;
    },

    /**
     * Url encodes the given Parameters.
     *
     *  @param {object} params Parameters to be serialized
     *  @return {string} The serialized representation of the parameters
     */
    serializeQueryString: function(params) {
        var s = [];
        Object.keys(params).forEach(function(key) {
            s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        });
        return s.join('&').replace(/%20/g, '+');
    },

    /**
     * Sets die given query parameters to the url.
     *
     * @param {string} url The url to be extended
     * @param {object} params The query parameters
     * @return {string} The extended URL
     */
    setQueryParams: function (url, params) {
        var anchor = document.createElement('a');
        anchor.href = url;

        var parameters = {};
        var tmpParameters = anchor.search.substr(1).split('&');
        tmpParameters.forEach(function(value) {
            var param = value.split('=');
            param[0] != '' && (parameters[param[0]] = param[1]);
        });

        for (var key in params) {
            parameters[key] = params[key];
        }

        anchor.search = '?' + module.exports.serializeQueryString(parameters);
        return anchor.href;
    }
};