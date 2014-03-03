describe("./main", function() {
    var jtstreamOrig = jtstream;

    beforeEach(function() {
        var Stream = function() {};
        Stream.prototype = jtstreamOrig;
        jtstream = new Stream();
        jtstream.registerDefaultCallbacks();
        jtstream.init();
    });

    afterEach(function() {
        jtstream = jtstreamOrig;
    });

    it("registerCallback and getCallback should work properly", function() {
        var callback = function() {};
        jtstream.registerCallback('testtype', callback);

        expect(jtstream.getCallback('testtype')).toBe(callback);
        expect(jtstream.getCallback('invlaidtesttype')).toBe(undefined);
    });

    it("should have installed the built in parts", function() {
        expect(jtstream.getCallback('css')).not.toBe(undefined);
        expect(jtstream.getCallback('html')).not.toBe(undefined);
        expect(jtstream.getCallback('js')).not.toBe(undefined);
        expect(jtstream.getCallback('resource')).not.toBe(undefined);
        expect(jtstream.getCallback('pagelet')).not.toBe(undefined);
    });

    it("should initialize the stream correct", function() {
        var appendOrig = jtstream.util.append;
        var appendNew = function() {
            appendOrig.apply(this, arguments);
        };
        var onStreamStart = function() {};
        var onProcess = function() {};
        var onProcessed = function() {};
        var onStreamEnd = function() {};

        expect(function() {
            jtstream.init();
        }).not.toThrow();

        jtstream.init({
            util: {
                foo: function() {},
                append: appendNew
            },
            onStreamStart: onStreamStart,
            onProcess: onProcess,
            onProcessed: onProcessed,
            onStreamEnd: onStreamEnd
        });

        expect(jtstream.util.foo).not.toBe(undefined);
        expect(jtstream.util.append).toBe(appendNew);
        expect(jtstream.onStreamStart).toBe(onStreamStart);
        expect(jtstream.onProcess).toBe(onProcess);
        expect(jtstream.onProcessed).toBe(onProcessed);
        expect(jtstream.onStreamEnd).toBe(onStreamEnd);
    });

    it("should call sos correct", function() {
        var onStreamStartSpy = jasmine.createSpy('onStreamStartSpy');
        var dummyPayload = {};

        jtstream.init({onStreamStart: onStreamStartSpy});
        expect(jtstream._started).toBe(false);
        expect(jtstream._ended).toBe(false);

        jtstream.sos(dummyPayload);
        expect(onStreamStartSpy.calls.length).toBe(1);
        expect(onStreamStartSpy.calls[0].args[0]).toBe(dummyPayload);
        expect(onStreamStartSpy.calls[0].args[1]).toBe(jtstream);
        expect(jtstream._started).toBe(true);
        expect(jtstream._ended).toBe(false);

        jtstream.sos(dummyPayload);
        expect(onStreamStartSpy.calls.length).toBe(1);

        jtstream.eos(dummyPayload);
        jtstream.sos(dummyPayload);
        expect(onStreamStartSpy.calls.length).toBe(2);
    });

    it("should call eos correct", function() {
        var onStreamEndSpy = jasmine.createSpy('onStreamEndSpy');
        var dummyPayload = {};

        jtstream.init({onStreamEnd: onStreamEndSpy});

        jtstream.eos(dummyPayload);
        expect(onStreamEndSpy.calls.length).toBe(1);
        expect(onStreamEndSpy.calls[0].args[0]).toBe(dummyPayload);
        expect(onStreamEndSpy.calls[0].args[1]).toBe(jtstream);
        expect(jtstream._started).toBe(false);
        expect(jtstream._ended).toBe(true);

        jtstream.eos(dummyPayload);
        expect(onStreamEndSpy.calls.length).toBe(1);

        jtstream.sos(dummyPayload);
        jtstream.eos(dummyPayload);
        expect(onStreamEndSpy.calls.length).toBe(2);
    });

    it("should throw, when processing with invalid or missing type", function() {
        expect(function() {
            jtstream.process({});
        }).toThrow();

        expect(function() {
            jtstream.process({
                type: 'invalidtype'
            });
        }).toThrow();
    });

    it("should call all callbacks in right order, when processing", function() {
        var calls = [];
        var callbackFactory = function(method) {
            return function() {
                calls.push({
                    method: method,
                    arguments: arguments
                });
            };
        };
        var customPartCallback = callbackFactory('customPartCallback');
        var onStreamStart = callbackFactory('onStreamStart');
        var onProcess = callbackFactory('onProcess');
        var onProcessed = callbackFactory('onProcessed');
        var onStreamEnd = callbackFactory('onStreamEnd');

        jtstream.registerCallback('customPart', customPartCallback);
        jtstream.init({
            onStreamStart: onStreamStart,
            onProcess: onProcess,
            onProcessed: onProcessed,
            onStreamEnd: onStreamEnd
        });

        /* trigger stream via script tag to be as close as possible to a
         * real use case.
         */
        $('<script>jtstream.process({"type":"customPart","foo":"bar"});</script>').appendTo('body');

        expect(calls.length).toBe(4);

        expect(calls[0].method).toBe('onStreamStart');
        expect(calls[0].arguments[0].type).toBe('customPart');
        expect(calls[0].arguments[0].foo).toBe('bar');

        expect(calls[1].method).toBe('onProcess');
        expect(calls[1].arguments[0]).toBe('customPart');
        expect(calls[1].arguments[1].type).toBe('customPart');
        expect(calls[1].arguments[1].foo).toBe('bar');

        expect(calls[2].method).toBe('customPartCallback');
        expect(calls[2].arguments[0]).toBe(jtstream);
        expect(calls[2].arguments[1].type).toBe('customPart');
        expect(calls[2].arguments[1].foo).toBe('bar');

        expect(calls[3].method).toBe('onProcessed');
        expect(calls[3].arguments[0]).toBe('customPart');
        expect(calls[3].arguments[1].type).toBe('customPart');
        expect(calls[3].arguments[1].foo).toBe('bar');

        $('<script>jtstream.eos({"foo":"bar"});</script>').appendTo('body');

        expect(calls.length).toBe(5);
        expect(calls[4].method).toBe('onStreamEnd');
        expect(calls[4].arguments[0].foo).toBe('bar');
    });

    it("should install urlStreams correct", function() {
        var url = 'main/dummyUrlStream.html';
        var urlStream = jtstream.createURLStream(url, {});

        expect(urlStream.url).toBe(url);
        expect(jtstream[urlStream._id]).toBe(urlStream);
    });

    it("should throw, when no url is given", function() {
        var urlStream = jtstream.createURLStream('', {});
        expect(urlStream.open).toThrow();
    });

    it("should load urlStreams correct", function() {
        var url = 'spec/main/dummyUrlStream.html';
        var urlStream = jtstream.createURLStream(url, {});
        var customPartSpy = jasmine.createSpy('customPartSpy');
        urlStream.registerCallback('customPart', customPartSpy);

        runs(function() {
            urlStream.open();
        });

        waitsFor(function() {
            return customPartSpy.calls.length > 0;
        }, 'customPartSpy should have been called ', 500);

        runs(function() {
            expect(customPartSpy.calls.length).toBe(1);
            expect(customPartSpy).toHaveBeenCalledWith(urlStream, {
                type: 'customPart',
                foo: 'bar'
            });
        });
    });

    it("should call eos, when url results in 404", function() {
        var url = 'spec/main/invalidUrlStream.html';
        var urlStream = jtstream.createURLStream(url, {});
        var onStreamEndSpy = jasmine.createSpy('onStreamEndSpy');
        urlStream.init({
            onStreamEnd: onStreamEndSpy
        });

        runs(function() {
            urlStream.open();
        });

        waitsFor(function() {
            return onStreamEndSpy.calls.length > 0;
        }, 'customPartSpy should have been called ', 500);

        runs(function() {
            expect(onStreamEndSpy.calls.length).toBe(1);
        });
    });
});
