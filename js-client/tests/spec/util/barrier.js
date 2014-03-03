describe("./util/barrier", function() {
    var Barrier = jtstream.require('./util/barrier.js');
    var barrier;

    beforeEach(function() {
        barrier = new Barrier(function() {});
        spyOn(barrier, 'callback');
    });

    it("callback should not have been called after initialization", function() {
        expect(barrier.callback).not.toHaveBeenCalled();
    });

    it("callback should not have been called when one release was queried", function() {
        barrier.getRelease();

        expect(barrier.callback).not.toHaveBeenCalled();
    });

    it("callback should not have been called when two releases were queried", function() {
        barrier.getRelease();
        barrier.getRelease();

        expect(barrier.callback).not.toHaveBeenCalled();
    });

    it("callback should have been called when one release was called", function() {
        (barrier.getRelease())();

        expect(barrier.callback).toHaveBeenCalled();
    });

    it("callback should not have been called when two releases were called", function() {
        var release1 = barrier.getRelease();
        var release2 = barrier.getRelease();

        release1();
        expect(barrier.callback).not.toHaveBeenCalled();

        release2();
        expect(barrier.callback).toHaveBeenCalled();
    });

    it("callback should not have been called twice when barrier is over released", function() {
        var release1 = barrier.getRelease();
        release1();

        var release2 = barrier.getRelease();
        release2();

        expect(barrier.callback.calls.length).toBe(1);
    });
});
