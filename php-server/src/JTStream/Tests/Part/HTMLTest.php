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

use JTStream\Part\HTML as HTMLPart;

/**
 * Unit test for JTStream\Part\HTML.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class HTMLTest extends \PHPUnit_Framework_TestCase
{
    public function testType()
    {
        $part = new HTMLPart();
        $this->assertEquals('html', $part->getType());
    }

    public function testId()
    {
        $part = new HTMLPart('test');
        $this->assertEquals('test', $part->getId());

        $part->setId('test2');
        $this->assertEquals('test2', $part->getId());
    }

    public function testHTML()
    {
        $part = new HTMLPart('test', 'test');
        $this->assertEquals('test', $part->getHtml());

        $part->setHtml('test2');
        $this->assertEquals('test2', $part->getHtml());
    }

    public function testMode()
    {
        $part = new HTMLPart('test', 'test');
        $this->assertEquals('replace', $part->getMode());

        $part->setMode('append');
        $this->assertEquals('append', $part->getMode());

        $part->setMode('prepend');
        $this->assertEquals('prepend', $part->getMode());

        $part2 = new HTMLPart('test', 'test', 'append');
        $this->assertEquals('append', $part2->getMode());

        $invaild = true;
        try {
            new HTMLPart('test', 'test', 'invalid');
        } catch (\RuntimeException $e) {
            $invaild = false;
        }
        $this->assertFalse($invaild);
    }

    public function testPayload()
    {
        $part = new HTMLPart('id', 'html', 'append');

        $expected = array(
            'id' => 'id',
            'html' => 'html',
            'mode' => 'append'
        );
        $this->assertEquals($expected, $part->getPayload());
    }
}
