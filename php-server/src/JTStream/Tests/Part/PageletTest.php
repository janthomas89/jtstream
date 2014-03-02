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

use JTStream\Part\Pagelet as PageletPart;
use JTStream\Part\HTML as HTMLPart;
use JTStream\Part\Resource as ResourcePart;
use JTStream\Part\JS as JSPart;
use JTStream\Part\CSS as CSSPart;

/**
 * Unit test for JTStream\Part\Pagelet.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class PageletTest extends \PHPUnit_Framework_TestCase
{
    public function testType()
    {
        $part = new PageletPart();
        $this->assertEquals('pagelet', $part->getType());
    }

    public function testHTMLPart()
    {
        $part = new PageletPart();
        $this->assertNull($part->getHTMLPart());

        $htmlPart = new HTMLPart();
        $part2 = new PageletPart($htmlPart);
        $this->assertSame($htmlPart, $part2->getHTMLPart());

        $htmlPart2 = new HTMLPart();
        $part2->setHTMLPart($htmlPart2);
        $this->assertSame($htmlPart2, $part2->getHTMLPart());
    }

    public function testJSParts()
    {
        $part = new PageletPart();
        $this->assertEquals(array(), $part->getJSParts());

        $expected = array(
            new JSPart('some js')
        );
        $part->setJSParts($expected);
        $this->assertEquals($expected, $part->getJSParts());

        $tmpPart = new JSPart('some js');
        $expected[] = $tmpPart;
        $part->addJSPart($tmpPart);
        $this->assertEquals($expected, $part->getJSParts());
    }


    public function testJSResources()
    {
        $part = new PageletPart();
        $this->assertEquals(array(), $part->getJSResources());

        $expected = array(
            new ResourcePart('js', 'url')
        );
        $part->setJSResources($expected);
        $this->assertEquals($expected, $part->getJSResources());

        $tmpPart = new ResourcePart('js', 'url');
        $expected[] = $tmpPart;
        $part->addJSResource($tmpPart);
        $this->assertEquals($expected, $part->getJSResources());
    }

    public function testCssParts()
    {
        $part = new PageletPart();
        $this->assertEquals(array(), $part->getCSSParts());

        $expected = array(
            new CSSPart('some css')
        );
        $part->setCSSParts($expected);
        $this->assertEquals($expected, $part->getCSSParts());

        $tmpPart = new CSSPart('some css');
        $expected[] = $tmpPart;
        $part->addCSSPart($tmpPart);
        $this->assertEquals($expected, $part->getCSSParts());
    }

    public function testCSSResources()
    {
        $part = new PageletPart();
        $this->assertEquals(array(), $part->getCSSResources());

        $expected = array(
            new ResourcePart('css', 'url')
        );
        $part->setCSSResources($expected);
        $this->assertEquals($expected, $part->getCSSResources());

        $tmpPart = new ResourcePart('css', 'url');
        $expected[] = $tmpPart;
        $part->addCSSResource($tmpPart);
        $this->assertEquals($expected, $part->getCSSResources());
    }

    public function testPayload()
    {
        $pagelet = new PageletPart();

        /* HTML part */
        $htmlPart = new HTMLPart('id', 'html');
        $pagelet->setHTMLPart($htmlPart);

        /* JS parts */
        $jsParts = array(
            new JSPart('some js')
        );
        $pagelet->setJSParts($jsParts);

        /* JS resources */
        $jsResources = array(
            new ResourcePart('js', 'url')
        );
        $pagelet->setJSResources($jsResources);

        /* CSS parts */
        $cssParts = array(
            new CSSPart('some css')
        );
        $pagelet->setCSSParts($cssParts);

        /* CSS resources */
        $cssResources = array(
            new ResourcePart('css', 'url')
        );
        $pagelet->setCSSResources($cssResources);

        $expected = array(
            'id' => 'id',
            'html' => 'html',
            'jsResources' => array(
                'url',
            ),
            'js' => array(
                'some js'
            ),
            'cssResources' => array(
                'url',
            ),
            'css' => array(
                'some css'
            ),
        );
        $this->assertEquals($expected, $pagelet->getPayload());
    }
}
