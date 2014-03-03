describe("./part/css", function() {
    var cssPart = jtstream.require('./part/css.js');
    var stream;
    var util;

    beforeEach(function() {
        util = jasmine.createSpyObj('util', [
            'evalStyle'
        ]);
        stream = { util: util };
    });

    it("should call evalStyle with given text", function() {
        cssPart(stream, {
            text: '.some-css { color:red; }'
        });

        expect(util.evalStyle).toHaveBeenCalledWith('.some-css { color:red; }');
    });

    it("should call evalStyle with empty string", function() {
        cssPart(stream, {});

        expect(util.evalStyle).toHaveBeenCalledWith('');
    });
});
