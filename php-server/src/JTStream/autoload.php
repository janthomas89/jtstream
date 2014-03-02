<?php

/*
 * This file is part of the jtstream package.
 *
 * (c) Jan Thomas <jan.thomas@rwth-aachen.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

spl_autoload_register(function($class) {
    if (strpos($class, 'JTStream') === 0) {
        $path = str_replace('\\', DIRECTORY_SEPARATOR, $class);
        require substr($path, 9) . '.php';
    }
});
