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

use JTStream\Tests\AbstractStreamTestCase;
use JTStream\Tests\JTStreamStub as JTStream;
use JTStream\Part\Generic as GenericPart;

/**
 * Unit test for JTStream\JTStream.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class JTStreamTest extends AbstractStreamTestCase
{
    /**
     * Tests flush.
     */
    public function testFlush()
    {
        $this->assertStream("", function(JTStream $stream) {
            $stream->flush();
        });

        $expected = "<script>JTStream.process({\"type\":\"test\",\"foo\":\"bar\"});</script>\n";
        $this->assertStream($expected, function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->flush($part);
        });
    }

    /**
     * Tests push.
     */
    public function testPush()
    {
        $this->assertStream("", function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->push($part);
        });

        $expected = "<script>JTStream.process({\"type\":\"test\",\"foo\":\"bar\"});</script>\n";
        $this->assertStream($expected, function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->push($part);
            $stream->flush();
        });

        $expected2 = $expected . "<script>JTStream.process({\"type\":\"test2\",\"foo\":\"bar\"});</script>\n";
        $this->assertStream($expected2, function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->push($part);

            $part2 = new GenericPart('test2', array('foo' => 'bar'));
            $stream->push($part2);

            $stream->flush();
        });
    }

    /**
     * Tests unshift.
     */
    public function testUnshift()
    {
        $this->assertStream("", function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->unshift($part);
        });

        $expected = "<script>JTStream.process({\"type\":\"test\",\"foo\":\"bar\"});</script>\n";
        $this->assertStream($expected, function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->unshift($part);
            $stream->flush();
        });

        $expected2 = "<script>JTStream.process({\"type\":\"test2\",\"foo\":\"bar\"});</script>\n" . $expected;
        $this->assertStream($expected2, function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->unshift($part);

            $part2 = new GenericPart('test2', array('foo' => 'bar'));
            $stream->unshift($part2);

            $stream->flush();
        });
    }

    /**
     * Tests reset.
     */
    public function testReset()
    {
        $this->assertStream("", function(JTStream $stream) {
            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->push($part);
            $stream->reset();
            $stream->flush();
        });
    }

    /**
     * Test asynchronous url streams.
     */
    public function testURLStream()
    {
        $expected = "<script>parent.JTStream[\"test\"].process({\"type\":\"test\",\"foo\":\"bar\"});</script>\n";
        $this->assertStream($expected, function(JTStream $stream) {
            $_GET['_jtstreamid'] = 'test';

            $part = new GenericPart('test', array('foo' => 'bar'));
            $stream->unshift($part);
            $stream->flush();

            unset($_GET['_jtstreamid']);
        });
    }

    /**
     * Tests the start of stream functionality.
     */
    public function testSos()
    {
        $expected = "<script>JTStream.sos([\"Start!\"]);</script>\n";

        $this->assertStream($expected, function(JTStream $stream) {
            $stream->sos(array('Start!'));
        });

        $this->assertStream($expected, function(JTStream $stream) {
            $stream->sos(array('Start!'));
            $stream->flush();
        });
    }

    /**
     * Tests the end of stream functionality.
     */
    public function testEos()
    {
        $expected = "<script>JTStream.eos([\"End!\"]);</script>\n";

        $this->assertStream($expected, function(JTStream $stream) {
            $stream->eos(array('End!'));
        });

        $this->assertStream($expected, function(JTStream $stream) {
            $stream->eos(array('End!'));
            $stream->flush();
        });
    }

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
