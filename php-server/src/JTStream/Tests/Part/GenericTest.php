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

use JTStream\Part\Generic as GenericPart;

/**
 * Unit test for JTStream\Part\Generic.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class GenericTest extends \PHPUnit_Framework_TestCase
{
    public function testType()
    {
        $part = new GenericPart('type', array('foo' => 'bar'));
        $this->assertEquals('type', $part->getType());

        $part->setType('type2');
        $this->assertEquals('type2', $part->getType());
    }

    public function testPayload()
    {
        $expected = array(
            'foo' => 'bar'
        );

        $part = new GenericPart('type', $expected);
        $this->assertEquals($expected, $part->getPayload());

        $expected2 = array(
            'bar' => 'foo'
        );
        $part->setPayload($expected2);
        $this->assertEquals($expected2, $part->getPayload());
    }
}
