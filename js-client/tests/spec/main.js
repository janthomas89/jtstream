describe("./main", function() {
    var JTStreamOrig = JTStream;

    beforeEach(function() {
        var Stream = function() {};
        Stream.prototype = JTStreamOrig;
        JTStream = new Stream();
        JTStream.registerDefaultCallbacks();
        JTStream.init();
    });

    afterEach(function() {
        JTStream = JTStreamOrig;
    });

    it("registerCallback and getCallback should work properly", function() {
        var callback = function() {};
        JTStream.registerCallback('testtype', callback);

        expect(JTStream.getCallback('testtype')).toBe(callback);
        expect(JTStream.getCallback('invlaidtesttype')).toBe(undefined);
    });

    it("should have installed the built in parts", function() {
        expect(JTStream.getCallback('css')).not.toBe(undefined);
        expect(JTStream.getCallback('html')).not.toBe(undefined);
        expect(JTStream.getCallback('js')).not.toBe(undefined);
        expect(JTStream.getCallback('resource')).not.toBe(undefined);
        expect(JTStream.getCallback('pagelet')).not.toBe(undefined);
    });

    it("should initialize the stream correct", function() {
        var appendOrig = JTStream.util.append;
        var appendNew = function() {
            appendOrig.apply(this, arguments);
        };
        var onStreamStart = function() {};
        var onProcess = function() {};
        var onProcessed = function() {};
        var onStreamEnd = function() {};

        expect(function() {
            JTStream.init();
        }).not.toThrow();

        JTStream.init({
            util: {
                foo: function() {},
                append: appendNew
            },
            onStreamStart: onStreamStart,
            onProcess: onProcess,
            onProcessed: onProcessed,
            onStreamEnd: onStreamEnd
        });

        expect(JTStream.util.foo).not.toBe(undefined);
        expect(JTStream.util.append).toBe(appendNew);
        expect(JTStream.onStreamStart).toBe(onStreamStart);
        expect(JTStream.onProcess).toBe(onProcess);
        expect(JTStream.onProcessed).toBe(onProcessed);
        expect(JTStream.onStreamEnd).toBe(onStreamEnd);
    });

    it("should call sos correct", function() {
        var onStreamStartSpy = jasmine.createSpy('onStreamStartSpy');
        var dummyPayload = {};

        JTStream.init({onStreamStart: onStreamStartSpy});
        expect(JTStream._started).toBe(false);
        expect(JTStream._ended).toBe(false);

        JTStream.sos(dummyPayload);
        expect(onStreamStartSpy.calls.length).toBe(1);
        expect(onStreamStartSpy.calls[0].args[0]).toBe(dummyPayload);
        expect(onStreamStartSpy.calls[0].args[1]).toBe(JTStream);
        expect(JTStream._started).toBe(true);
        expect(JTStream._ended).toBe(false);

        JTStream.sos(dummyPayload);
        expect(onStreamStartSpy.calls.length).toBe(1);

        JTStream.eos(dummyPayload);
        JTStream.sos(dummyPayload);
        expect(onStreamStartSpy.calls.length).toBe(2);
    });

    it("should call eos correct", function() {
        var onStreamEndSpy = jasmine.createSpy('onStreamEndSpy');
        var dummyPayload = {};

        JTStream.init({onStreamEnd: onStreamEndSpy});

        JTStream.eos(dummyPayload);
        expect(onStreamEndSpy.calls.length).toBe(1);
        expect(onStreamEndSpy.calls[0].args[0]).toBe(dummyPayload);
        expect(onStreamEndSpy.calls[0].args[1]).toBe(JTStream);
        expect(JTStream._started).toBe(false);
        expect(JTStream._ended).toBe(true);

        JTStream.eos(dummyPayload);
        expect(onStreamEndSpy.calls.length).toBe(1);

        JTStream.sos(dummyPayload);
        JTStream.eos(dummyPayload);
        expect(onStreamEndSpy.calls.length).toBe(2);
    });

    it("should throw, when processing with invalid or missing type", function() {
        expect(function() {
            JTStream.process({});
        }).toThrow();

        expect(function() {
            JTStream.process({
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

        JTStream.registerCallback('customPart', customPartCallback);
        JTStream.init({
            onStreamStart: onStreamStart,
            onProcess: onProcess,
            onProcessed: onProcessed,
            onStreamEnd: onStreamEnd
        });

        /* trigger stream via script tag to be as close as possible to a
         * real use case.
         */
        $('<script>JTStream.process({"type":"customPart","foo":"bar"});</script>').appendTo('body');

        expect(calls.length).toBe(4);

        expect(calls[0].method).toBe('onStreamStart');
        expect(calls[0].arguments[0].type).toBe('customPart');
        expect(calls[0].arguments[0].foo).toBe('bar');

        expect(calls[1].method).toBe('onProcess');
        expect(calls[1].arguments[0]).toBe('customPart');
        expect(calls[1].arguments[1].type).toBe('customPart');
        expect(calls[1].arguments[1].foo).toBe('bar');

        expect(calls[2].method).toBe('customPartCallback');
        expect(calls[2].arguments[0]).toBe(JTStream);
        expect(calls[2].arguments[1].type).toBe('customPart');
        expect(calls[2].arguments[1].foo).toBe('bar');

        expect(calls[3].method).toBe('onProcessed');
        expect(calls[3].arguments[0]).toBe('customPart');
        expect(calls[3].arguments[1].type).toBe('customPart');
        expect(calls[3].arguments[1].foo).toBe('bar');

        $('<script>JTStream.eos({"foo":"bar"});</script>').appendTo('body');

        expect(calls.length).toBe(5);
        expect(calls[4].method).toBe('onStreamEnd');
        expect(calls[4].arguments[0].foo).toBe('bar');
    });

    it("should install urlStreams correct", function() {
        var url = 'main/dummyUrlStream.html';
        var urlStream = JTStream.createURLStream(url, {});

        expect(urlStream.url).toBe(url);
        expect(JTStream[urlStream._id]).toBe(urlStream);
    });

    it("should throw, when no url is given", function() {
        var urlStream = JTStream.createURLStream('', {});
        expect(urlStream.open).toThrow();
    });

    it("should load urlStreams correct", function() {
        var url = 'spec/main/dummyUrlStream.html';
        var urlStream = JTStream.createURLStream(url, {});
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
        var urlStream = JTStream.createURLStream(url, {});
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
