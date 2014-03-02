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
 * Part for streaming generic content.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class Generic implements PartInterface
{
    /**
     * The parts generic payload.
     *
     * @var array
     */
    protected $payload;

    /**
     * The parts type.
     *
     * @var string
     */
    protected $type;

    /**
     * Initializes the part.
     *
     * @param string $type
     * @param array $payload
     */
    public function __construct($type, array $payload)
    {
        $this->setPayload($payload);
        $this->setType($type);
    }

    /**
     * Returns the type of the part.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Sets the parts type.
     *
     * @param string $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * Sets the generic payload.
     *
     * @param array $payload
     */
    public function setPayload(array $payload)
    {
        $this->payload = $payload;
    }

    /**
     * Returns the generic payload.
     *
     * @return array
     */
    public function getPayload()
    {
        return $this->payload;
    }
}
