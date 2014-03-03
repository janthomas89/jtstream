<?php
    use JTStream\JTStream;
    use JTStream\Part\Pagelet as PageletPart;
    use JTStream\Part\HTML as HTMLPart;
    use JTStream\Part\Resource as ResourcePart;
    use JTStream\Part\JS as JSPart;
    use JTStream\Part\CSS as CSSPart;

    require_once '../../php-server/src/JTStream/autoload.php';
?>

<!DOCTYPE html>
<html lang="en-us">
    <head>
        <meta charset="utf-8">
        <title>jtstream [ˈd͜ʃɛtstriːm] - Pagelet Example</title>
        <style>
            .head {
                background: #aaa;
                border-bottom: 2px solid black;
                min-height: 100px;
            }

            .left {
                background: #ccc;
                width: 200px;
                float: left;
                min-height: 300px;
            }

            .main {
                float: left;
                min-height: 300px;
            }
        </style>
    </head>
    <body>
        <div class="pagelet head" id="pagelet-1">
            Pagelet 1 - loading ...
        </div>

        <div style="clear: both;">
            <div class="pagelet left" id="pagelet-2">
                Pagelet 2 - loading ...
            </div>

            <div class="pagelet main" id="pagelet-3">
                Pagelet 3 - loading ...
            </div>
        </div>
    </body>

    <script>
        var __DEV__ = true;
    </script>
    <script src="/js-client/jtstream.js"></script>

<?php
    $stream = new JTStream();

    $stream->sos(array('Start!'));

    $cssResource = new ResourcePart('css', 'css/pagelet.css');
    $jsResource = new ResourcePart('js', 'js/pagelet.js');

    sleep(1);

    /* Head */
    $htmlPart = new HTMLPart('pagelet-1', '<h1>jtstream [ˈd͜ʃɛtstriːm] - Pagelet Example</h1>');
    $cssResource = new ResourcePart('css', 'css/pagelet.css');
    $headPagelet = new PageletPart($htmlPart);
    $headPagelet->addCSSResource($cssResource);
    $headPagelet->addJSResource($jsResource);
    $stream->flush($headPagelet);

    sleep(1);

    /* Main */
    $htmlPart = new HTMLPart('pagelet-3', '<h2>Headline</h2>Lorem ipsum dolor sit amet ...');
    $mainPagelet = new PageletPart($htmlPart);
    $mainPagelet->addCSSResource($cssResource);
    $mainPagelet->addJSResource($jsResource);
    $mainPagelet->addJSPart(new JSPart('initPagelet("' . $htmlPart->getId() . '");'));
    $stream->flush($mainPagelet);

    sleep(1);

    /* Left */
    $htmlPart = new HTMLPart('pagelet-2', '<ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>');
    $leftPagelet = new PageletPart($htmlPart);
    $leftPagelet->addCSSPart(new CSSPart('.left a {line-height: 30px;}'));
    $stream->flush($leftPagelet);

    $stream->eos(array('Ende!'));
?>

</html>