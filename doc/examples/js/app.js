(function() {

    console.log('hello from app.js');

    /* Custom type: custom1 */
    JTStream.registerCallback('custom1', function(stream, payload) {
        console.log(payload);
    });


    var stream1 = JTStream.createURLStream('callback/countdown.php', {
        onStreamStart: function(payload, stream) {

        },
        onProcess: function(type, payload, stream) {

        },
        onStreamEnd: function(payload, stream) {

        }
    });
    stream1.open();

    var stream2 = JTStream.createURLStream('callback/countup.php', {

    });
    stream2.open();
})();