/*
 * This file is part of the jtstream package.
 *
 * (c) 2014 Jan Thomas <jan.thomas@rwth-aachen.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code (licensed MIT).
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jtstream=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./part/css.js":2,"./part/html.js":3,"./part/js.js":4,"./part/pagelet.js":5,"./part/resource.js":6,"./util/barrier.js":7,"./util/private.js":8,"./util/public.js":9}],2:[function(require,module,exports){
'use strict';

/*
 * CSSPart for inline CSS
 */
module.exports = function(stream, payload) {
    stream.util.evalStyle(payload.text || '');
};
},{}],3:[function(require,module,exports){
'use strict';

/*
 * HTMLPart
 */
module.exports = function(stream, payload) {
   stream.util[payload.mode || 'replace'](payload.id, payload.html);
};
},{}],4:[function(require,module,exports){
'use strict';

/*
 * JSPart for inline JS
 */
module.exports = function(stream, payload) {
    stream.util.evalScript(payload.text || '');
};
},{}],5:[function(require,module,exports){
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

},{"../util/barrier.js":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
'use strict';

/**
 * Own simple implementation of a barrier / promise kind of thing. Not as
 * flexible as jQuery.deffered but fits here!
 *
 * @constructor
 * @this {Barrier}
 * @param {number} callback Callback to be executed after all tasks are done.
 * @private
 */
var Barrier = function(callback) {
    var that = this;
    that.callback = callback;
    that.called = false;
    that.count = 0;

    that._release = function() {
        if (that.called) {
            return;
        }

        if ((--that.count) < 1) {
            that.callback();
            that.called = true;
        }
    };
};

/**
 * Registers a task and returns the release function.
 *
 * @return {function} The release function
 */
Barrier.prototype.getRelease = function() {
    ++this.count;
    return this._release;
};

module.exports = Barrier;
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
'use strict';

module.exports = {

    /**
     * Replaces the content of a DOM element.
     *
     * @param {string} domID The elements DOM-ID whose content to replace.
     * @param {string} html HTML string to replace
     */
    replace: function(domID, html) {
        var elm = document.getElementById(domID);
        elm.innerHTML = html;
    },

    /**
     * Appends the content of a DOM element.
     *
     * @param {string} domID The elements DOM-ID whose content to append.
     * @param {string} html HTML string to append
     */
    append: function(domID, html) {
        var elm = document.getElementById(domID);
        elm.innerHTML += html;
    },

    /**
     * Prepends the content of a DOM element.
     *
     * @param {string} domID The elements DOM-ID whose content to prepend.
     * @param {string} html HTML string to prepend
     */
    prepend: function(domID, html) {
        var elm = document.getElementById(domID);
        elm.innerHTML = html + elm.innerHTML;
    },

    /**
     * Requires a script in a asynchronous fashion by its URL.
     *
     * @param {string} url The scripts URL
     * @param {string} callback Function to be executed, when the scrip is loaded
     */
    requireScript: function(url, callback) {
        var script = document.createElement('script');
        var done = false;

        script.src = url;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;
                callback && callback();
                script.onload = script.onreadystatechange = null;
            }
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    },

    /**
     * Evals the given text as ascript.
     *
     * @param {string} text The scripts text representation
     */
    evalScript: function(text) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.text = text;

        document.getElementsByTagName('head')[0].appendChild(script);
    },

    /**
     * Requires a style by its URL.
     *
     * @param {string} url The styles URL
     * @param {string} callback Function to be executed, when the style is loaded
     */
    requireStyle: function(url, callback) {
        var style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');
        style.setAttribute('href', url);

        document.getElementsByTagName('head')[0].appendChild(style);

        callback && callback();
    },

    /**
     * Evals the given text as css style.
     *
     * @param {string} text The styles text representation
     */
    evalStyle: function(text) {
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = text;
        } else {
            style.innerHTML = text;
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    },

    /**
     * Logs the given message on the console
     *
     * @param {string} msg The Message to be logged
     */
    log: function(msg) {
        window && window.__DEV__ && window.console && window.console.log(msg);
    }
};
},{}]},{},[1])
(1)
});