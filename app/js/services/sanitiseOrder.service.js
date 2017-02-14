(function() {
    'use strict';

    sanitiseOrder.$inject = [];

    function sanitiseOrder() {
        var sanitiseOrder = {
            sanitiseCart: sanitiseCart
        };
        return sanitiseOrder;

        function sanitiseCart(v, k) {
            return (v.deal) ? sanitiseDeal(v) : sanitiseProduct(v);
        }

        function sanitiseProduct(v) {
            var response = {
                items: sanitiseItems(v.items),
                qty: v.qty
            };
            return response;
        }

        function sanitiseDeal(v) {
            var response = {
                deal: v.deal,
                items: sanitiseItems(v.items),
                qty: v.qty
            };
            return response;
        }

        function sanitiseItems(v) {
            var response = _.map(v, function(w) {

                response = {
                    item: _.map(w.item, sanitiseItem)
                };

                if (w.size && w.size != 'na')
                    response.size = w.size;
                if (w.qty)
                    response.qty = w.qty;

                return response;
            });
            return response;
        }

        function sanitiseItem(v) {

            var response = {
                product: v.product
            };
            //product toppings
            if (v.addinfo && v.addinfo.toppings && v.addinfo.toppings.length)
                response.toppings = _.map(v.addinfo.toppings, sanitiseToppings);
            //deal toppings
            if (v.toppings && v.toppings.length > 0)
                response.toppings = v.toppings;
            return response;
        }

        function sanitiseToppings(v) {
            return {
                id: v.id,
                qty: v.qty
            };
        }
    }
    angular.module('app')
        .service('sanitiseOrder', sanitiseOrder);
})();
