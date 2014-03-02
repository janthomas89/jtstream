describe("./part/js", function() {
    var jsPart = JTStream.require('./part/js.js');
    var stream;
    var util;

    beforeEach(function() {
        util = jasmine.createSpyObj('util', [
            'evalScript'
        ]);
        stream = { util: util };
    });

    it("should call evalScript with given text", function() {
        jsPart(stream, {
            text: 'alert("some js");'
        });

        expect(util.evalScript).toHaveBeenCalledWith('alert("some js");');
    });

    it("should call evalScript with empty string", function() {
        jsPart(stream, {});

        expect(util.evalScript).toHaveBeenCalledWith('');
    });
});
