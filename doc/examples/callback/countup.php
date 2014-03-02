<?php
    use JTStream\JTStream;
    use JTStream\Part\HTML as HTMLPart;

    require_once '../../../php-server/src/JTStream/autoload.php';

    $stream = new JTStream();

    for ($i = 0; $i < 5; $i++) {
        $stream->flush(new HTMLPart(
            'container-4',
            '<h2>' . $i .'</h2>'
        ));

        sleep(2);
    }

    $stream->eos();