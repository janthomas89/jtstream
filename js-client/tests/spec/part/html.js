describe("./part/html", function() {
    var htmlPart = JTStream.require('./part/html.js');
    var stream;
    var util;

    beforeEach(function() {
        util = jasmine.createSpyObj('util', [
            'replace',
            'append',
            'prepend'
        ]);
        stream = { util: util };
    });

    it("should call replace, when no mode is given", function() {
        htmlPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...'
        });

        expect(util.replace).toHaveBeenCalledWith('sampleId', 'Lorem ipsum ...');
        expect(util.append).not.toHaveBeenCalled();
        expect(util.prepend).not.toHaveBeenCalled();
    });

    it("should call replace, when replace is given", function() {
        htmlPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...',
            mode: 'replace'
        });

        expect(util.replace).toHaveBeenCalledWith('sampleId', 'Lorem ipsum ...');
        expect(util.append).not.toHaveBeenCalled();
        expect(util.prepend).not.toHaveBeenCalled();
    });

    it("should call replace, when append is given", function() {
        htmlPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...',
            mode: 'append'
        });

        expect(util.append).toHaveBeenCalledWith('sampleId', 'Lorem ipsum ...');
        expect(util.replace).not.toHaveBeenCalled();
        expect(util.prepend).not.toHaveBeenCalled();
    });

    it("should call replace, when prepend is given", function() {
        htmlPart(stream, {
            id: 'sampleId',
            html: 'Lorem ipsum ...',
            mode: 'prepend'
        });

        expect(util.prepend).toHaveBeenCalledWith('sampleId', 'Lorem ipsum ...');
        expect(util.append).not.toHaveBeenCalled();
        expect(util.replace).not.toHaveBeenCalled();
    });

    it("should throw, when a invalid mode is given", function() {
        var thrower = function() {
            htmlPart(stream, {
                id: 'sampleId',
                html: 'Lorem ipsum ...',
                mode: 'invalid'
            });
        };

        expect(thrower).toThrow();
    });
});
