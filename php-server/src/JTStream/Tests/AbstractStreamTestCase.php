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

use JTStream\Tests\JTStreamStub as JTStream;

/**
 * Abstract test case for testing the stream.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class AbstractStreamTestCase extends \PHPUnit_Framework_TestCase
{
    /**
     * Compares the actual result of a stream with a expected one.
     *
     * @param string $expected
     * @param function $test
     */
    protected function assertStream($expected, $test)
    {
        ob_start();

        $stream = new JTStream();
        $test($stream);

        $actual = ob_get_contents();
        ob_end_clean();

        $this->assertEquals($expected, $actual);
    }
}