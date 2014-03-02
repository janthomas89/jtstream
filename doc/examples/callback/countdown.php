<?php
    use JTStream\JTStream;
    use JTStream\Part\HTML as HTMLPart;

    require_once '../../../php-server/src/JTStream/autoload.php';

    $stream = new JTStream();

    for ($i = 3; $i >= 0; $i--) {
        $stream->flush(new HTMLPart(
            'container-3',
            '<h2>' . $i .'</h2>'
        ));

        sleep(1);
    }

    $stream->eos();