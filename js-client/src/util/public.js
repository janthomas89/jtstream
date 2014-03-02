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