<?php

/*
 * This file is part of the jtstream package.
 *
 * (c) Jan Thomas <jan.thomas@rwth-aachen.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JTStream\Tests;

use JTStream\JTStream;

/**
 * Stub ob JTStream disabling the output buffer flushing for unit testing.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class JTStreamStub extends JTStream
{
    protected function flushOutputBuffer()
    {
        /* noop */
    }
}
