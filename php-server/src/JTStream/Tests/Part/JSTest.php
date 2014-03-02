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

use JTStream\Part\JS as JSPart;

/**
 * Unit test for JTStream\Part\JS.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class JSTest extends \PHPUnit_Framework_TestCase
{
    public function testType()
    {
        $part = new JSPart('some js');
        $this->assertEquals('js', $part->getType());
    }

    public function testText()
    {
        $part = new JSPart('some js');
        $this->assertEquals('some js', $part->getText());

        $part->setText('other js');
        $this->assertEquals('other js', $part->getText());
    }

    public function testPayload()
    {
        $part = new JSPart('some js');

        $expected = array(
            'text' => 'some js'
        );
        $this->assertEquals($expected, $part->getPayload());
    }
}
