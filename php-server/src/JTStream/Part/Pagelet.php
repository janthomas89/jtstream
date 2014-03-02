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
use JTStream\Part\HTML as HTMLPart;
use JTStream\Part\Resource as ResourcePart;
use JTStream\Part\CSS as CSSPart;
use JTStream\Part\JS as JSPart;

/**
 * Part for streaming a pagelet including html, css and js.
 *
 * @author Jan Thomas <jan.thomas@rwth-aachen.de>
 */
class Pagelet implements PartInterface
{
    /**
     * The pagelets HTML part.
     *
     * @var HTMLPart
     */
    protected $htmlPart;

    /**
     * The pagelets js resources.
     *
     * @var array
     */
    protected $jsResources;

    /**
     * The pagelets css resources.
     *
     * @var array
     */
    protected $cssResources;

    /**
     * The pagelets js parts.
     *
     * @var array
     */
    protected $jsParts;

    /**
     * The pagelets css parts.
     *
     * @var array
     */
    protected $cssParts;

    /**
     * Initializes the part and its subparts.
     *
     * @param \JTStream\Part\HTML $htmlPart The pagelets HTML part.
     * @param array $jsResources The pagelets js resources.
     * @param array $cssResources The pagelets css resources.
     * @param array $jsParts The pagelets js parts.
     * @param array $cssParts The pagelets css parts.
     */
    public function __construct(
        HTMLPart $htmlPart = null,
        array $jsResources = array(),
        array $cssResources = array(),
        array $jsParts = array(),
        array $cssParts = array()
    ) {
        $this->htmlPart = $htmlPart;
        $this->jsResources = $jsResources;
        $this->cssResources = $cssResources;
        $this->jsParts = $jsParts;
        $this->cssParts = $cssParts;
    }

    /**
     * Returns the type of the part.
     *
     * @return string
     */
    public function getType()
    {
        return 'pagelet';
    }

    /**
     * Assembles and returns the parts payload.
     *
     * @return array
     */
    public function getPayload()
    {
        return array_merge(
            $this->htmlPart->getPayload(),
            $this->getJSPayload(),
            $this->getCSSPayload()
        );
    }

    /**
     * Returns the js payload.
     *
     * @return array
     */
    protected function getJSPayload()
    {
        $payload = array();

        if (count($this->jsResources) > 0) {
            $payload['jsResources'] = array();
            foreach ($this->jsResources as $jsResource) {
                $tmpPayload = $jsResource->getPayload();
                $payload['jsResources'][] = $tmpPayload['resourceUrl'];
            }
        }

        if (count($this->jsParts) > 0) {
            $payload['js'] = array();
            foreach ($this->jsParts as $jsPart) {
                $tmpPayload = $jsPart->getPayload();
                $payload['js'][] = $tmpPayload['text'];
            }
        }

        return $payload;
    }

    /**
     * Returns the css payload.
     *
     * @return array
     */
    protected function getCSSPayload()
    {
        $payload = array();

        if (count($this->cssResources) > 0) {
            $payload['cssResources'] = array();
            foreach ($this->cssResources as $cssResource) {
                $tmpPayload = $cssResource->getPayload();
                $payload['cssResources'][] = $tmpPayload['resourceUrl'];
            }
        }

        if (count($this->cssParts) > 0) {
            $payload['css'] = array();
            foreach ($this->cssParts as $cssPart) {
                $tmpPayload = $cssPart->getPayload();
                $payload['css'][] = $tmpPayload['text'];
            }
        }

        return $payload;
    }

    /**
     * Returns the HTML part.
     *
     * @return HTMLPart
     */
    public function getHTMLPart()
    {
        return $this->htmlPart;
    }

    /**
     * Sets the HTMLL part.
     *
     * @param \JTStream\Part\HTML $htmlPart
     */
    public function setHTMLPart(HTMLPart $htmlPart)
    {
        $this->htmlPart = $htmlPart;
    }

    /**
     * Returns the js resources.
     *
     * @return array
     */
    public function getJSResources()
    {
        return $this->jsResources;
    }

    /**
     * Sets the js resources.
     *
     * @param array $jsResources
     */
    public function setJSResources(array $jsResources)
    {
        $this->jsResources = $jsResources;
    }

    /**
     * Adds a js resource.
     *
     * @param \JTStream\Part\Resource $jsResource
     * @throws \RuntimeException
     */
    public function addJSResource(ResourcePart $jsResource)
    {
        if ($jsResource->getResourceType() != ResourcePart::TYPE_JS) {
            throw new \RuntimeException(sprintf('expected a js resource, %s given', $jsResource->getResourceType()));
        }

        $this->jsResources[] = $jsResource;
    }

    /**
     * Returns the css resources.
     *
     * @return array
     */
    public function getCSSResources()
    {
        return $this->cssResources;
    }

    /**
     * Sets the css resources.
     *
     * @param array $jsResources
     */
    public function setCSSResources(array $cssResources)
    {
        $this->cssResources = $cssResources;
    }

    /**
     * Adds a css resource.
     *
     * @param \JTStream\Part\Resource $cssResource
     * @throws \RuntimeException
     */
    public function addCSSResource(ResourcePart $cssResource)
    {
        if ($cssResource->getResourceType() != ResourcePart::TYPE_CSS) {
            throw new \RuntimeException(sprintf('expected a css resource, %s given', $cssResource->getResourceType()));
        }

        $this->cssResources[] = $cssResource;
    }

    /**
     * Returns the js parts.
     *
     * @return array
     */
    public function getJSParts()
    {
        return $this->jsParts;
    }

    /**
     * Sets the js parts.
     *
     * @param array $jsParts
     */
    public function setJSParts(array $jsParts)
    {
        $this->jsParts = $jsParts;
    }

    /**
     * Adds a js part.
     *
     * @param \JTStream\Part\JS $jsPart
     */
    public function addJSPart(JSPart $jsPart)
    {
        $this->jsParts[] = $jsPart;
    }

    /**
     * Sets the css parts.
     *
     * @param array $cssParts
     */
    public function getCSSParts()
    {
        return $this->cssParts;
    }

    /**
     * Sets the css parts.
     *
     * @param array $cssParts
     */
    public function setCSSParts(array $cssParts)
    {
        $this->cssParts = $cssParts;
    }

    /**
     * Adds a css part.
     *
     * @param \JTStream\Part\CSS $cssPart
     */
    public function addCSSPart(CSSPart $cssPart)
    {
        $this->cssParts[] = $cssPart;
    }
}
