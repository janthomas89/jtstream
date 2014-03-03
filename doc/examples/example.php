<?php
    use JTStream\JTStream;
    use JTStream\Part\HTML as HTMLPart;
    use JTStream\Part\Resource as ResourcePart;
    use JTStream\Part\JS as JSPart;
    use JTStream\Part\CSS as CSSPart;
    use JTStream\Part\Generic as GenericPart;

    require_once '../../php-server/src/JTStream/autoload.php';
?>

<!DOCTYPE html>
<html lang="en-us" debug="true">
    <head>
        <meta charset="utf-8">
        <title>jtstream [ˈd͜ʃɛtstriːm] - Example</title>
        <style>
            .container {
                border: 1px dashed red;
                padding: 10px;
                margin: 10px;
            }
        </style>
    </head>
    <body>
        <h1>jtstream [ˈd͜ʃɛtstriːm] - Example</h1>

        <hr>

        <div class="container" id="container-1">
            Container 1 - loading ...
        </div>

        <div class="container" id="container-2">
            Container 2 - loading ...
        </div>

        <div class="container" id="container-3">
            Container 3
        </div>

        <div class="container" id="container-4">
            Container 4
        </div>

    </body>

    <script type="text/javascript">
        var __DEV__ = true;
    </script>
    <script src="/js-client/jtstream.js"></script>

<?php
    $stream = new JTStream();

    $stream->sos(array('Start!'));

    $stream->flush(new ResourcePart('js', 'js/app.js'));

    sleep(1);

    $stream->flush(new GenericPart('custom1', array(
        'msg' => 'Lorem ipsum dolor ...',
    )));

    sleep(1);

    $stream->push(new HTMLPart(
        'container-2',
        '<p>Lorem ipsum dolor sit amet! ' . time() . '</p>'
    ));
    $stream->flush();

    sleep(2);

    $stream->push(new HTMLPart(
        'container-2',
        '<p>Hallo Welt!</p>',
        'append'
    ));
    $stream->flush();

    sleep(1);

    $stream->flush(new HTMLPart(
        'container-1',
        '<p>Lorem ipsum dolor sit amet! ' . time() . '</p>'
    ));

    sleep(1);

    $stream->flush(new JSPart('console.log("Hello World!");'));

    sleep(1);

    $stream->flush(new CSSPart('
        body {
            background: #eee;
        }
    '));

    $stream->eos(array('Ende!'));
?>

</html>