(function() {

    console.log('hello from app.js');

    /* Custom type: custom1 */
    jtstream.registerCallback('custom1', function(stream, payload) {
        console.log(payload);
    });


    var stream1 = jtstream.createURLStream('callback/countdown.php', {
        onStreamStart: function(payload, stream) {

        },
        onProcess: function(type, payload, stream) {

        },
        onStreamEnd: function(payload, stream) {

        }
    });
    stream1.open();

    var stream2 = jtstream.createURLStream('callback/countup.php', {

    });
    stream2.open();
})();