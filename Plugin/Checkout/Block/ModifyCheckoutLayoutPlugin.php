<?php
/**
 * Copyright © 2018 Rubic. All rights reserved.
 * See LICENSE.txt for license details.
 */
namespace Ecomteck\DeliveryDate\Plugin\Checkout\Block;
use Magento\Checkout\Block\Checkout\LayoutProcessor;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
class ModifyCheckoutLayoutPlugin
{
    const CONFIG_ENABLE_DELIVERY_DATE    = 'deliverydate/general/enable';
    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;
    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(ScopeConfigInterface $scopeConfig)
    {
        $this->scopeConfig = $scopeConfig;
    }
    
    /**
     * Disable delivery date component in checkout page.
     *
     * @param array $jsLayout
     * @return array
     */
    private function disableDeliveryDateComponent($jsLayout)
    {
        if (!$this->scopeConfig->getValue(self::CONFIG_ENABLE_DELIVERY_DATE, ScopeInterface::SCOPE_STORE)) {
            unset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['shippingAdditional']['children']['delivery_date']);
        }
        return $jsLayout;
    }

    /**
     * @param LayoutProcessor $layoutProcessor
     * @param callable $proceed
     * @param array<int, mixed> $args
     * @return array
     */
    public function aroundProcess(LayoutProcessor $layoutProcessor, callable $proceed, ...$args)
    {
        $jsLayout = $proceed(...$args);
        $jsLayout = $this->disableDeliveryDateComponent($jsLayout);
        return $jsLayout;
    }
}