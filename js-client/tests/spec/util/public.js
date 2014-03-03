(function() {
    var createElement = function(id, innerHTML) {
        var elm = document.createElement('DIV');
        elm.setAttribute('id', id);
        elm.innerHTML = innerHTML;

        var container = document.getElementById('testContainer');
        container.innerHTML = '';
        container.appendChild(elm);

        return elm;
    };

    var normalizeHTML = function(html) {
        html = html.toLowerCase();
        html = html.replace(/(\r\n|\n|\r)/gm, '');
        return html;
    };

    describe("./util/public/replace", function() {
        var replace = jtstream.require('./util/public.js').replace;

        it("should replace the content of a DOM element", function() {
            var elm = createElement('dummy', '<p>foo</p>');

            replace('dummy', '<p>bar</p>');

            expect(normalizeHTML(elm.innerHTML)).toBe('<p>bar</p>');
        });
    });

    describe("./util/public/append", function() {
        var append = jtstream.require('./util/public.js').append;

        it("should append the content of a DOM element", function() {
            var elm = createElement('dummy', '<p>foo</p>');

            append('dummy', '<p>bar</p>');

            expect(normalizeHTML(elm.innerHTML)).toBe('<p>foo</p><p>bar</p>');
        });
    });

    describe("./util/public/prepend", function() {
        var prepend = jtstream.require('./util/public.js').prepend;

        it("should prepend the content of a DOM element", function() {
            var elm = createElement('dummy', '<p>foo</p>');

            prepend('dummy', '<p>bar</p>');

            expect(normalizeHTML(elm.innerHTML)).toBe('<p>bar</p><p>foo</p>');
        });
    });

    describe("./util/public/requireScript", function() {
        var requireScript = jtstream.require('./util/public.js').requireScript;

        beforeEach(function() {
            jtstream.__requireScriptDummy = function() {};
            spyOn(jtstream, '__requireScriptDummy');

            jtstream.__requireScriptCallback = function() {};
            spyOn(jtstream, '__requireScriptCallback');
        });

        afterEach(function() {
            delete jtstream.__requireScriptDummy;
            delete jtstream.__requireScriptCallback;
        });

        it("should have executed the script", function() {
            runs(function() {
                requireScript('spec/util/public/require-script.js', function() {});
            });

            waitsFor(function() {
                return jtstream.__requireScriptDummy.calls.length > 0
            }, 'should have loaded the script', 500);

            runs(function() {
                expect(jtstream.__requireScriptDummy).toHaveBeenCalled();
            });
        });

        it("should have executed the callback", function() {
            runs(function() {
                requireScript('spec/util/public/require-script.js', jtstream.__requireScriptCallback);
            });

            waitsFor(function() {
                return jtstream.__requireScriptCallback.calls.length > 0
            }, 'should have loaded the script', 256);

            runs(function() {
                expect(jtstream.__requireScriptCallback).toHaveBeenCalled();
            });
        });
    });

    describe("./util/public/evalScript", function() {
        var evalScript = jtstream.require('./util/public.js').evalScript;

        it("should have evaluated the script", function() {
            jtstream.__requireScriptDummy = function() {};
            spyOn(jtstream, '__requireScriptDummy');

            evalScript('jtstream.__requireScriptDummy();');

            expect(jtstream.__requireScriptDummy).toHaveBeenCalled();

            delete jtstream.__requireScriptDummy;
        });
    });

    describe("./util/public/requireStyle", function() {
        var requireStyle = jtstream.require('./util/public.js').requireStyle;

        it("should have loaded the style", function() {
            jtstream.__requireStyleCallback = function() {};
            spyOn(jtstream, '__requireStyleCallback');

            runs(function() {
                requireStyle('spec/util/public/require-style.css', jtstream.__requireStyleCallback);
            });

            waitsFor(function() {
                return $('#testContainer').css('width') == '1337px';
            }, 'should have loaded the style', 256);

            runs(function() {
                expect(jtstream.__requireStyleCallback).toHaveBeenCalled();
                delete jtstream.__requireStyleCallback;

                expect($('#testContainer').css('width')).toContain('1337px');
            });
        });
    });

    describe("./util/public/evalStyle", function() {
        var evalStyle = jtstream.require('./util/public.js').evalStyle;

        it("should apply styles", function() {

            evalStyle('#testContainer { height: 1337px; }')

            expect($('#testContainer').css('height')).toContain('1337px');
        });
    });

    if (window.console && window.console.log) {
        describe("./util/public/log", function() {
            var log = jtstream.require('./util/public.js').log;
            var originalDev = __DEV__;

            beforeEach(function() {
                spyOn(console, 'log').andCallThrough();
            });

            afterEach(function() {
                __DEV__ = originalDev;
            });

            it("should not call console.log, when __DEV__ = false;", function() {
                __DEV__ = false;
                log('test1');
                expect(console.log).not.toHaveBeenCalled();
            });

            it("should call console.log, when __DEV__ = true;", function() {
                __DEV__ = true;
                log('test2');
                expect(console.log).toHaveBeenCalled();
            });
        });
    }
})();
