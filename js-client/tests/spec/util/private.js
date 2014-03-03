describe("./util/private/uniqueId", function() {
    var uniqueId = jtstream.require('./util/private.js').uniqueId;

    var arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };

    it("is unique when called multiple times", function() {
        var ids = [];
        for (var i = 0; i < 64; i++) {
            ids[i] = uniqueId();
        }

        var uniqueIds = arrayUnique(ids);

        expect(ids.length).toBe(uniqueIds.length);
    });
});

describe("./util/private/extend", function() {
    var extend = jtstream.require('./util/private.js').extend;
    var obj;

    beforeEach(function() {
        obj = {
            foo: true,
            bar: false
        };
    });

    it("should alter the original object correctly", function() {
        extend(obj, {
            foo: false,
            bar: true
        });

        expect(obj.foo).toBe(false);
        expect(obj.bar).toBe(true);
        expect(obj.foobar).toBeUndefined();
    });

    it("should return the extended object", function() {
        var extended = extend(obj, {
            foo: false,
            bar: true
        });

        expect(extended.foo).toBe(false);
        expect(extended.bar).toBe(true);
        expect(extended.foobar).toBeUndefined();
    });

    it("should take multiple arguments", function() {
        var extended = extend(obj, {
            foo: false
        },{
            bar: true
        });

        expect(extended.foo).toBe(false);
        expect(extended.bar).toBe(true);
        expect(extended.foobar).toBeUndefined();
    });

    it("should apply multiple arguments in the right order", function() {
        var extended = extend(obj, {
            foo: 1
        },{
            foo: 2
        });

        expect(extended.foo).toBe(2);
        expect(extended.bar).toBe(false);
        expect(extended.foobar).toBeUndefined();
    });
});

describe("./util/private/serializeQueryString", function() {
    var serializeQueryString = jtstream.require('./util/private.js').serializeQueryString;

    it("should return an empty string when called with no params", function() {
        var queryString = serializeQueryString({});

        expect(queryString).toBe('');
    });

    it("should serialize a parameter correctly", function() {
        var queryString = serializeQueryString({
            foo: 'bar'
        });

        expect(queryString).toBe('foo=bar');
    });

    it("should serialize multiple parameters correctly", function() {
        var queryString = serializeQueryString({
            foo: 'bar',
            bar: 'foo'
        });

        expect(queryString).toBe('foo=bar&bar=foo');
    });

    it("should uri encode parameters correctly", function() {
        var queryString = serializeQueryString({
            foo: 'bar foo &?'
        });

        expect(queryString).toBe('foo=bar+foo+%26%3F');
    });
});

describe("./util/private/setQueryParams", function() {
    var setQueryParams = jtstream.require('./util/private.js').setQueryParams;

    it("should append a query param correctly", function() {
        var url = setQueryParams('http://www.jtstream.de', {
            foo: 'bar'
        });

        expect(url).toBe('http://www.jtstream.de/?foo=bar');
    });

    it("should append multiple query params correctly", function() {
        var url = setQueryParams('http://www.jtstream.de', {
            foo: 'bar',
            bar: 'foo'
        });

        expect(url).toBe('http://www.jtstream.de/?foo=bar&bar=foo');
    });

    it("should replace query params correctly", function() {
        var url = setQueryParams('http://www.jtstream.de/?foo=foo&test=123', {
            foo: 'bar',
            bar: 'foo'
        });

        expect(url).toBe('http://www.jtstream.de/?foo=bar&test=123&bar=foo');
    });
});
