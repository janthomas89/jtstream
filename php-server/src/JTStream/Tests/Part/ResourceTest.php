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

use JTStream\Part\Resource as ResourcePart;

/**
 * Unit test for JTStream\Part\Resource.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class ResourceTest extends \PHPUnit_Framework_TestCase
{
    public function testType()
    {
        $part = new ResourcePart('js', 'url');
        $this->assertEquals('resource', $part->getType());
    }

    public function testText()
    {
        $part = new ResourcePart('js', 'url');
        $this->assertEquals('js', $part->getResourceType());

        $part->setResourceType('css');
        $this->assertEquals('css', $part->getResourceType());
    }

    public function testPayload()
    {
        $part = new ResourcePart('js', 'url');

        $expected = array(
            'resourceType' => 'js',
            'resourceUrl' => 'url',
        );
        $this->assertEquals($expected, $part->getPayload());
    }
}
