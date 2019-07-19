define([
    'jquery',
    'ko',
    'uiComponent'
], function ($, ko, Component) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Ecomteck_DeliveryDate/delivery-date-block'
        },
        initialize: function () {
            this._super();
            var disabled = window.checkoutConfig.shipping.delivery_date.disabled;
            var enableTimePicker = window.checkoutConfig.shipping.delivery_date.enableTimePicker;
            var noday = window.checkoutConfig.shipping.delivery_date.noday;
            var hourMin = parseInt(window.checkoutConfig.shipping.delivery_date.hourMin);
            var hourMax = parseInt(window.checkoutConfig.shipping.delivery_date.hourMax);
            var afterDays = parseInt(window.checkoutConfig.shipping.delivery_date.afterDays);
            var format = window.checkoutConfig.shipping.delivery_date.format;
            if(!format) {
                format = 'yy-mm-dd';
            }
            var disabledDay = disabled.split(",").map(function(item) {
                return parseInt(item, 10);
            });

            ko.bindingHandlers.datetimepicker = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var $el = $(element);
                    //initialize datetimepicker
                    var options = {
                        showTimepicker: false,
                        minDate: afterDays,
                        dateFormat:format
                    };
                    if(enableTimePicker){
                        options.hourMin = hourMin;
                        options.hourMax = hourMax;
                        options.showTimepicker = true;
                    }

                    if(!noday) {
                        options.beforeShowDay = function(date) {
                            var day = date.getDay();
                            if(disabledDay.indexOf(day) > -1) {
                                return [false];
                            } else {
                                return [true];
                            }
                        }
                    }

                    $el.datetimepicker(options);

                    var writable = valueAccessor();
                    if (!ko.isObservable(writable)) {
                        var propWriters = allBindingsAccessor()._ko_property_writers;
                        if (propWriters && propWriters.datetimepicker) {
                            writable = propWriters.datetimepicker;
                        } else {
                            return;
                        }
                    }
                    writable($(element).datetimepicker("getDate"));
                },
                update: function (element, valueAccessor) {
                    var widget = $(element).data("DateTimePicker");
                    //when the view model is updated, update the widget
                    if (widget) {
                        var date = ko.utils.unwrapObservable(valueAccessor());
                        widget.date(date);
                    }
                }
            };

            return this;
        }
    });
});
