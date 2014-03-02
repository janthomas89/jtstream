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

use JTStream\PartInterface;

/**
 * Represents the servers stream endpoint.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 * @see https://www.facebook.com/note.php?note_id=389414033919
 */
class JTStream
{
    /**
     * Queue that holds all parts which are sheduled for streaming.
     *
     * @var array
     */
    protected $parts;

    /**
     * Constructor of the stream. It resets the part queue.
     */
    public function __construct()
    {
        $this->reset();
    }

    /**
     * Adds a part to the queues front.
     *
     * @param \JTStream\PartInterface $part
     */
    public function unshift(PartInterface $part)
    {
        array_unshift($this->parts, $part);
    }

    /**
     * Adds a part to the queues end.
     *
     * @param \JTStream\PartInterface $part
     */
    public function push(PartInterface $part)
    {
        array_push($this->parts, $part);
    }

    /**
     * Flushes the queue and streams all pending parts.
     *
     * @param JTStream\PartInterface $part
     */
    public function flush(PartInterface $part = null)
    {
        if ($part) {
            $this->push($part);
        }

        foreach ($this->parts as $part) {
            $result = $this->render($part);
            $this->stream($result);
        }

        $this->reset();
    }

    /**
     * Tags the start of a stream.
     *
     * @param array $payload
     */
    public function sos($payload = array())
    {
        $this->stream('sos(' . json_encode($payload) . ');');
    }

    /**
     * Tags the end of a stream.
     *
     * @param array $payload
     */
    public function eos($payload = array())
    {
        $this->stream('eos(' . json_encode($payload) . ');');
    }

    /**
     * Resets the queue.
     */
    public function reset()
    {
        $this->parts = array();
    }

    /**
     * Renders the JavaScript string representation of a part.
     *
     * @param \JTStream\PartInterface $part
     * @return string
     */
    protected function render(PartInterface $part)
    {
        $payload = array_merge(
            array('type' => $part->getType()),
            $part->getPayload()
        );

        return 'process(' . json_encode($payload) . ');';
    }

    /**
     * Streams a part.
     *
     * @param string $result
     */
    protected function stream($result)
    {
        if ($this->getAjaxStreamID() != '') {
            $result = '<script>parent.JTStream[' . json_encode($this->getAjaxStreamID()) . '].' . $result . '</script>';
        } else {
            $result = '<script>JTStream.' . $result . '</script>';
        }

        echo $result . "\n";
        $this->flushOutputBuffer();
    }

    /**
     * Flushes the output to the client.
     */
    protected function flushOutputBuffer()
    {
        ob_flush();
        flush();
    }

    /**
     * Returns the clients stream id, if it exists.
     * If a stream id exists, we are dealing with a asynchronous url stream
     * instead of a page load stream.
     *
     * @return stream
     */
    protected function getAjaxStreamID()
    {
        return isset($_GET['_jtstreamid']) ? $_GET['_jtstreamid'] : '';
    }
}
