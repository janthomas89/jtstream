<?php

/*
 * This file is part of the jtstream package.
 *
 * (c) Jan Thomas <jan.thomas@rwth-aachen.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JTStream\Part;

use JTStream\PartInterface;

/**
 * Part for streaming a js string.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class JS implements PartInterface
{
    /**
     * CSS text that will be streamed.
     *
     * @var string
     */
    protected $text;

    /**
     * Initializes the part.
     *
     * @param string $text
     */
    public function __construct($text)
    {
        $this->setText($text);
    }

    /**
     * Returns the type of the part.
     *
     * @return string
     */
    public function getType()
    {
        return 'js';
    }

    /**
     * Returns the js text.
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Sets the js text.
     *
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * Returns the parts payload.
     *
     * @return array
     */
    public function getPayload()
    {
        return array(
            'text' => $this->getText(),
        );
    }
}