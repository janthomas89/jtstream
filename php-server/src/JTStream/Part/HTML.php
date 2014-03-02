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
 * Part for streaming a HTML element.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class HTML implements PartInterface
{
    /**
     * The elements DOM-ID.
     *
     * @var string
     */
    protected $id;

    /**
     * The elements inner HTML content.
     *
     * @var string
     */
    protected $html;

    /**
     * The parts mode (replace, append, prepend).
     *
     * @var string
     */
    protected $mode;

    /**
     * Initializes the part.
     *
     * @param string $id The elements DOM-ID.
     * @param string $html The elements inner HTML content.
     * @param string $mode (replace, append, prepend)
     */
    public function __construct($id = '', $html = '', $mode = 'replace')
    {
        $this->setId($id);
        $this->setHtml($html);
        $this->setMode($mode);
    }

    /**
     * Returns the type of the part.
     *
     * @return string
     */
    public function getType()
    {
        return 'html';
    }

    /**
     * Returns the elements DOM-ID.
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Sets the elements DOM-ID.
     *
     * @param string $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Returns the elements HTML content.
     *
     * @return string
     */
    public function getHtml()
    {
        return $this->html;
    }

    /**
     * Sets the elements HTML content.
     *
     * @param string $html
     */
    public function setHtml($html)
    {
        $this->html = $html;
    }

    /**
     * Returnss the mode.
     *
     * @return string
     */
    public function getMode()
    {
        return $this->mode;
    }

    /**
     * Sets the mode.
     *
     * @param string $mode (replace, append, prepend)
     * @throws \Exception
     */
    public function setMode($mode)
    {
        $validModes = array('replace' => true, 'append' => true, 'prepend' => true);
        if (!isset($validModes[$mode])) {
            throw new \RuntimeException('invalid mode: ' . $mode . ', valid modes are: ' . implode(',', $validModes));
        }

        $this->mode = $mode;
    }

    /**
     * Returns the parts payload.
     *
     * @return array
     */
    public function getPayload()
    {
        $payload = array(
            'id' => $this->getId(),
            'html' => $this->getHtml(),
        );

        if ($this->getMode() != 'replace') {
            $payload['mode'] = $this->getMode();
        }

        return $payload;
    }
}
