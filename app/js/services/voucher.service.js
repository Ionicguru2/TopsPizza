(function() {
    'use strict';

    voucherService.$inject = ['httpService', '$q', 'restServer', 'alertService', '$localStorage', '$sessionStorage', 'basketService', '$rootScope'];

    function voucherService(httpService, $q, restServer, alertService, $localStorage, $sessionStorage, basketService, $rootScope) {

        var vm = this;

        var voucher = {
            init: init
        };
        return voucher;

        function init(voucher, store, total) {
            if (!voucher || !store)
                return false;
            var data = {
                "info": {
                    voucher: voucher,
                    store: store.id
                }
            };
            httpService.postNew('/check_voucher', data).then(function(result) {
                if (!result.data || result.data.error)
                    alertService.add(2, result.data.error);
                else if (result.data.cartMin && result.data.cartMin > total)
                    alertService.add(2, 'You do not meet the minimum requirement for this voucher');
                else
                    router(result.data, total);
            });
        }
        //percentage voucher, value voucher, point, exception (voucher types exception is amount off your order but just for some categories of products),
        function router(info, total) {

            switch (info.voucher) {
                case "percent":
                    percent(info, $sessionStorage.menu);
                    break;
                case "value":
                    value(info, $sessionStorage.menu);
                    break;
                case "addon":
                    return addon(info, $sessionStorage.menu, $localStorage.order);
                case "point":
                    return point(info, $sessionStorage.menu);
                case "exception":
                    exception(info, $sessionStorage.menu);
                    break;
            }

        }

        function addon(info, menu, order) {

            var search = (info.type) ? {
                TyID: info.type
            } : {
                id: info.product
            };
            if(info.size)
              search.size = info.size;
            var product = _.findWhere(order.cart, search);
            if(!product){
              alertService.add(2, 'Please add the right product to your basket first');
              return;
            }
            order.info.disc = _.findWhere(_.findWhere(menu.products, {id:product.id}).sizeprice,{size:product.size}).price;
            $localStorage.order.info.voucher = info.name;
            order.voucher = info;
            order.voucher.product = product;
            $rootScope.$broadcast('updateCart');
            $rootScope.$broadcast('countBasketPrice');
        }


    }
    angular
        .module('app')
        .service('voucherService', voucherService);
})();
