describe("./part/pagelet", function() {
    var pageletPart = JTStream.require('./part/pagelet.js');
    var stream;
    var calls;

    beforeEach(function() {
        var Stream = function() {};
        Stream.prototype = JTStream;
        stream = new Stream();

        calls = [];

        spyOn(stream.util, 'append');
        spyOn(stream.util, 'replace').andCallFake(function() {
            calls.push({
                method: 'replace',
                arguments: arguments
            });
        });
        spyOn(stream.util, 'requireScript').andCallFake(function(src, callback) {
            calls.push({
                method: 'requireScript',
                arguments: arguments
            });
            callback();
        });
        spyOn(stream.util, 'evalScript').andCallFake(function() {
            calls.push({
                method: 'evalScript',
                arguments: arguments
            });
        });
        spyOn(stream.util, 'requireStyle').andCallFake(function() {
            calls.push({
                method: 'requireStyle',
                arguments: arguments
            });
        });
        spyOn(stream.util, 'evalStyle').andCallFake(function() {
            calls.push({
                method: 'evalStyle',
                arguments: arguments
            });
        });
    });

    it("should call parts in order: css, html, js", function() {
        pageletPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...',
            cssResources: ['/css/style.css'],
            css: ['body { color: red; }'],
            jsResources: ['/js/style.js'],
            js: ['alert("test");']
        });

        expect(calls.length).toBe(5);
        expect(calls[0].method).toBe('requireStyle');
        expect(calls[1].method).toBe('evalStyle');
        expect(calls[2].method).toBe('replace');
        expect(calls[3].method).toBe('requireScript');
        expect(calls[4].method).toBe('evalScript');
    });

    it("should call append on htmlPart", function() {
        pageletPart(stream, {
            id: 'sampleId',
            mode: 'append',
            html: 'Lorem ipsum ...',
            cssResources: [],
            css: [],
            jsResources: [],
            js: []
        });

        expect(stream.util.append).toHaveBeenCalledWith('sampleId', 'Lorem ipsum ...');
    });

    it("should load css parts in right order", function() {
        pageletPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...',
            cssResources: ['/css/style1.css', '/css/style2.css']
        });

        expect(calls.length).toBe(3);
        expect(calls[0].method).toBe('requireStyle');
        expect(calls[0].arguments[0]).toBe('/css/style1.css');
        expect(calls[1].method).toBe('requireStyle');
        expect(calls[1].arguments[0]).toBe('/css/style2.css');
        expect(calls[2].method).toBe('replace');
    });

    it("should load js parts in right order", function() {
        pageletPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...',
            jsResources: ['/js/script1.js', '/js/script2.js']
        });

        expect(calls.length).toBe(3);
        expect(calls[0].method).toBe('replace');
        expect(calls[1].method).toBe('requireScript');
        expect(calls[1].arguments[0]).toBe('/js/script1.js');
        expect(calls[2].method).toBe('requireScript');
        expect(calls[2].arguments[0]).toBe('/js/script2.js');
    });
});
