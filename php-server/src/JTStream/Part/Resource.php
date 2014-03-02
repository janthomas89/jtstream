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
 * Part for streaming a js or css resource.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class Resource implements PartInterface
{
    const TYPE_JS = 'js';
    const TYPE_CSS = 'css';

    /**
     * The resources type (js, css).
     *
     * @var string
     */
    protected $resourceType;

    /**
     * The resources URL.
     *
     * @var string
     */
    protected $resourceUrl;

    /**
     * Wether the resources should be cached or not.
     *
     * @var boolean
     */
    protected $cacheable;

    /**
     * Initializes the part.
     *
     * @param string $resourceType The resources type (js, css).
     * @param string $resourceUrl The resources URL.
     * @param boolean $cacheable Wether the resources should be cached or not.
     */
    public function __construct($resourceType, $resourceUrl, $cacheable = true)
    {
        $this->setResourceType($resourceType);
        $this->setResourceUrl($resourceUrl);
        $this->setCacheable($cacheable);
    }

    /**
     * Returns the type of the part.
     *
     * @return string
     */
    public function getType()
    {
        return 'resource';
    }

    /**
     * Returns the resources type.
     *
     * @return string
     */
    public function getResourceType()
    {
        return $this->resourceType;
    }

    /**
     * Sets the resources type.
     *
     * @param string $resourceType
     */
    public function setResourceType($resourceType)
    {
        $this->resourceType = $resourceType;
    }

    /**
     * Returns the resources URL.
     *
     * @return string
     */
    public function getResourceUrl()
    {
        return $this->resourceUrl;
    }

    /**
     * Returns theresources cacheable URL.
     *
     * @return string
     */
    public function getCacheableURL()
    {
        $url = $this->getResourceUrl();

        if(!$this->getCacheable()) {
            $url .= '?' . uniqid();
        }

        return $url;
    }

    /**
     * Sets the resources URL.
     *
     * @param string $resourceUrl
     */
    public function setResourceUrl($resourceUrl)
    {
        $this->resourceUrl = $resourceUrl;
    }

    /**
     * Returns wether or not the resource is cacheable.
     *
     * @return boolean
     */
    public function getCacheable()
    {
        return $this->cacheable;
    }

    /**
     * Sets wether or not the resource is cacheable.
     *
     * @return boolean
     */
    public function setCacheable($cacheable)
    {
        $this->cacheable = $cacheable;
    }

    /**
     * Returns the parts payload.
     *
     * @return type
     */
    public function getPayload()
    {
        $payload = array(
            'resourceType' => $this->getResourceType(),
            'resourceUrl' => $this->getCacheableURL(),
        );

        return $payload;
    }
}
