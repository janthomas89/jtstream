'use strict';

/**
 * Private utilities
 */
var utilPrivate = require('./util/private.js'),
    barrier = require('./util/barrier.js'),
    noop = utilPrivate.noop,
    uniqueId = utilPrivate.uniqueId,
    extend = utilPrivate.extend,
    setQueryParams = utilPrivate.setQueryParams;

/**
 * Utilities (Can be overwritten by the init call).
 */
var util = require('./util/public.js');

/**
 * The prototype for all streams.
 *
 * @constructor
 * @this {Stream}
 */
var Stream = function() {
    this.registerDefaultCallbacks();
    this.init();
};

/**
 * Registers a callback / part
 *
 * @param {string} type The parts identifier
 * @param {function} callback Callback to be executed whenever this kind of part gets streamed.
 */
Stream.prototype.registerCallback = function(type, callback) {
    this.partCallbacks[type] = callback;
};

/**
 * Returns the parts callback if it exists.
 *
 * @param {string} type The parts identifier
 * @return {function} The parts callback
 */
Stream.prototype.getCallback = function(type) {
    return this.partCallbacks[type];
};

/**
 * Registe rbuilt in parts.
 */
Stream.prototype.registerDefaultCallbacks = function() {
    this.partCallbacks = {};
    this.registerCallback('html', require('./part/html.js'));
    this.registerCallback('resource', require('./part/resource.js'));
    this.registerCallback('css', require('./part/css.js'));
    this.registerCallback('js', require('./part/js.js'));
    this.registerCallback('pagelet', require('./part/pagelet.js'));
};

/**
 * Initializes the global stream object.
 *
 * @param {object} options
 */
Stream.prototype.init = function(options) {
    options = options || {};

    this.util = extend({}, util, options.util);

    this.onStreamStart = options.onStreamStart || noop;
    this.onProcess = options.onProcess || noop;
    this.onProcessed = options.onProcessed || noop;
    this.onStreamEnd = options.onStreamEnd || noop;

    this._started = false;
    this._ended = false;
};

/**
 * Callback for processing a stream part.
 *
 * @param {object} payload
 */
Stream.prototype.process = function(payload) {
    var partCallbacks = this.partCallbacks;
    var type = payload.type;

    if (!partCallbacks[type]) {
        throw new Error('invalid type: ' + type + ', valid types are: ' + Object.keys(partCallbacks).join(','));
    }

    this.sos(payload);

    if (this.onProcess(type, payload, this) === false) {
        return;
    }

    this.util.log('process part for stream: ' + (this._id ? this._id : 'main'));
    this.util.log(payload);

    partCallbacks[type](this, payload);

    this.onProcessed(type, payload, this);
};

/**
 * Callback for marking the start of the steam.
 *
 * @param {object} payload
 */
Stream.prototype.sos = function(payload) {
    if (this._started === true) {
        return;
    }

    this.util.log('stream started: ' + (this._id ? this._id : 'main'));
    this.util.log(payload);

    this.onStreamStart(payload, this);

    this._started = true;
    this._ended = false;
};

/**
 * Callback for marking the end of the steam.
 *
 * @param {object} payload
 */
Stream.prototype.eos = function(payload) {
    if (this._ended === true) {
        return;
    }

    this.util.log('stream ended: ' + (this._id ? this._id : 'main'));
    this.util.log(payload);

    this.onStreamEnd(payload, this);

    this._started = false;
    this._ended = true;
};

/* This registers the global stream instance. */
var stream = new Stream();

/**
 * Prototype for URL streams.
 *
 * @constructor
 * @this {URLStream}
 * @private
 */
var URLStream = function(url) {
    this.url = url;
    this.registerDefaultCallbacks();
    this.init();
};
URLStream.prototype = stream;

/**
 * Opens the url stream.
 */
URLStream.prototype.open = function() {
    if (!this.url) {
        throw new Error('Can not open url stream for empty url');
    }

    var that = this;
    var body = document.body;
    var frame = document.createElement('iframe');
    var url = setQueryParams(this.url, {
        '_jtstreamid': this._id
    });
    var onload = function() {
        body.removeChild(frame);
        that.eos && that.eos(that);
    };

    frame.style.display = 'none';
    frame.setAttribute('src', url);
    if (frame.attachEvent) {
        frame.attachEvent('onload', onload);
    } else {
        frame.addEventListener('load', onload, false);
    }

    body.appendChild(frame);
};

/**
 * Factory for creating streams at runtime.
 *
 * @param {string} url The streams URL
 * @param {object} options Options for customizing the stream
 */
stream.createURLStream = function(url, options) {
    var urlStream = new URLStream(url);
    this.install(urlStream, options || {});
    return urlStream;
};

/**
 * Method for installing a stream in the global jtstream namepsace.
 *
 * @param {string} stream The stream to be placed in the global stream instance
 * @param {object} options Options for customizing the stream
 * @private
 */
stream.install = function(stream, options) {
    var id = options.id || uniqueId();
    this[(stream._id = id)] = stream;
    stream.init(options);
};

/**
 * Expose require() for testing purpose only.
 */
if (window && window.__DEV__) {
    stream.require = require;
}

/**
 * Expose the modules exports.
 */
module.exports = stream;