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
        var replace = JTStream.require('./util/public.js').replace;

        it("should replace the content of a DOM element", function() {
            var elm = createElement('dummy', '<p>foo</p>');

            replace('dummy', '<p>bar</p>');

            expect(normalizeHTML(elm.innerHTML)).toBe('<p>bar</p>');
        });
    });

    describe("./util/public/append", function() {
        var append = JTStream.require('./util/public.js').append;

        it("should append the content of a DOM element", function() {
            var elm = createElement('dummy', '<p>foo</p>');

            append('dummy', '<p>bar</p>');

            expect(normalizeHTML(elm.innerHTML)).toBe('<p>foo</p><p>bar</p>');
        });
    });

    describe("./util/public/prepend", function() {
        var prepend = JTStream.require('./util/public.js').prepend;

        it("should prepend the content of a DOM element", function() {
            var elm = createElement('dummy', '<p>foo</p>');

            prepend('dummy', '<p>bar</p>');

            expect(normalizeHTML(elm.innerHTML)).toBe('<p>bar</p><p>foo</p>');
        });
    });

    describe("./util/public/requireScript", function() {
        var requireScript = JTStream.require('./util/public.js').requireScript;

        beforeEach(function() {
            JTStream.__requireScriptDummy = function() {};
            spyOn(JTStream, '__requireScriptDummy');

            JTStream.__requireScriptCallback = function() {};
            spyOn(JTStream, '__requireScriptCallback');
        });

        afterEach(function() {
            delete JTStream.__requireScriptDummy;
            delete JTStream.__requireScriptCallback;
        });

        it("should have executed the script", function() {
            runs(function() {
                requireScript('spec/util/public/require-script.js', function() {});
            });

            waitsFor(function() {
                return JTStream.__requireScriptDummy.calls.length > 0
            }, 'should have loaded the script', 500);

            runs(function() {
                expect(JTStream.__requireScriptDummy).toHaveBeenCalled();
            });
        });

        it("should have executed the callback", function() {
            runs(function() {
                requireScript('spec/util/public/require-script.js', JTStream.__requireScriptCallback);
            });

            waitsFor(function() {
                return JTStream.__requireScriptCallback.calls.length > 0
            }, 'should have loaded the script', 256);

            runs(function() {
                expect(JTStream.__requireScriptCallback).toHaveBeenCalled();
            });
        });
    });

    describe("./util/public/evalScript", function() {
        var evalScript = JTStream.require('./util/public.js').evalScript;

        it("should have evaluated the script", function() {
            JTStream.__requireScriptDummy = function() {};
            spyOn(JTStream, '__requireScriptDummy');

            evalScript('JTStream.__requireScriptDummy();');

            expect(JTStream.__requireScriptDummy).toHaveBeenCalled();

            delete JTStream.__requireScriptDummy;
        });
    });

    describe("./util/public/requireStyle", function() {
        var requireStyle = JTStream.require('./util/public.js').requireStyle;

        it("should have loaded the style", function() {
            JTStream.__requireStyleCallback = function() {};
            spyOn(JTStream, '__requireStyleCallback');

            runs(function() {
                requireStyle('spec/util/public/require-style.css', JTStream.__requireStyleCallback);
            });

            waitsFor(function() {
                return $('#testContainer').css('width') == '1337px';
            }, 'should have loaded the style', 256);

            runs(function() {
                expect(JTStream.__requireStyleCallback).toHaveBeenCalled();
                delete JTStream.__requireStyleCallback;

                expect($('#testContainer').css('width')).toContain('1337px');
            });
        });
    });

    describe("./util/public/evalStyle", function() {
        var evalStyle = JTStream.require('./util/public.js').evalStyle;

        it("should apply styles", function() {

            evalStyle('#testContainer { height: 1337px; }')

            expect($('#testContainer').css('height')).toContain('1337px');
        });
    });

    if (window.console && window.console.log) {
        describe("./util/public/log", function() {
            var log = JTStream.require('./util/public.js').log;
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
