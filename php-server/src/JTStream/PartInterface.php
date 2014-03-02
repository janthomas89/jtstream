<?php

/*
 * This file is part of the jtstream package.
 *
 * (c) Jan Thomas <jan.thomas@rwth-aachen.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JTStream;

/**
 * Interface for Parts that will be streamed to the client.
 * 
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
interface PartInterface
{
    /**
     * Returns the parts identifier.
     * 
     * @return string The parts identifier
     */
    public function getType();

    /**
     * Returns the parts payload.
     * 
     * @return array The parts payload
     */
    public function getPayload();
}
