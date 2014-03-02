describe("./part/resource", function() {
    var resourcePart = JTStream.require('./part/resource.js');
    var noop = function() {};
    var stream;
    var util;

    beforeEach(function() {
        util = {
            requireScript: function(url, callback) {
                callback && callback();
            },
            requireStyle: function(url, callback) {
                callback && callback();
            }
        };

        spyOn(util, 'requireScript').andCallThrough();
        spyOn(util, 'requireStyle').andCallThrough();

        stream = { util: util };
    });

    it("should call requireScript with given url", function() {
        resourcePart(stream, {
            resourceUrl: '/path/to/some/js/resource.js',
            resourceType: 'js'
        }, noop);

        expect(util.requireScript).toHaveBeenCalled();
        expect(util.requireScript.mostRecentCall.args[0]).toEqual('/path/to/some/js/resource.js');
    });

    it("should not call requireScript, when url was loaded before", function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');

        resourcePart(stream, {
            resourceUrl: '/path/to/some/js/resourceBefore.js',
            resourceType: 'js'
        }, callback1);

        resourcePart(stream, {
            resourceUrl: '/path/to/some/js/resourceBefore.js',
            resourceType: 'js'
        }, callback2);

        expect(util.requireScript.calls.length).toBe(1);
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
    });

    it("should not call requireScript, when url is loading", function() {
        var callback1 = jasmine.createSpy('callback1');
        var callback2 = jasmine.createSpy('callback2');

        stream.util.requireScript = function(url, callack) {
            setTimeout(function() {
                callack();
            }, 128);
        };

        spyOn( stream.util, 'requireScript').andCallThrough();

        var util2 = jasmine.createSpyObj('util', ['requireScript']);
        var stream2 = { util: util2 };

        runs(function() {
            resourcePart(stream, {
                resourceUrl: '/path/to/some/js/resource2.js',
                resourceType: 'js'
            }, callback1);

            expect(callback1).not.toHaveBeenCalled();
            expect(util.requireScript).toHaveBeenCalled();

            resourcePart(stream2, {
                resourceUrl: '/path/to/some/js/resource2.js',
                resourceType: 'js'
            }, callback2);

            expect(callback2).not.toHaveBeenCalled();
            expect(util2.requireScript).not.toHaveBeenCalled();
        });

        waitsFor(function() {
            return callback1.calls.length > 0
        }, 'should have called the callback1', 256);

        runs(function() {
            expect(callback2).toHaveBeenCalled();
        });
    });

    it("should call requireStyle with given url", function() {
        resourcePart(stream, {
            resourceUrl: '/path/to/some/css/resource.css',
            resourceType: 'css'
        }, noop);

        expect(util.requireStyle).toHaveBeenCalled();
        expect(util.requireStyle.mostRecentCall.args[0]).toEqual('/path/to/some/css/resource.css');
    });

    it("should throw when invalid type is given", function() {
        var thrower = function() {
            resourcePart(stream, {
                resourceType: 'invalidType'
            });
        };

        expect(thrower).toThrow();
    });
});
