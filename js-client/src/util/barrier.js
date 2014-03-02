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