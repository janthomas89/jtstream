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

use JTStream\Part\CSS as CSSPart;

/**
 * Unit test for JTStream\Part\CSS.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class CSSTest extends \PHPUnit_Framework_TestCase
{
    public function testType()
    {
        $part = new CSSPart('some css');
        $this->assertEquals('css', $part->getType());
    }

    public function testText()
    {
        $part = new CSSPart('some css');
        $this->assertEquals('some css', $part->getText());

        $part->setText('other css');
        $this->assertEquals('other css', $part->getText());
    }

    public function testPayload()
    {
        $part = new CSSPart('some css');

        $expected = array(
            'text' => 'some css'
        );
        $this->assertEquals($expected, $part->getPayload());
    }
}
