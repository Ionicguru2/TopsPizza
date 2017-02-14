(function() {
  'use strict';

  basketService.$inject = ['$localStorage', 'storeService', '$q', 'sanitiseOrder', 'httpService', 'alertService', '$state'];

  function basketService($localStorage, storeService, $q, sanitiseOrder, httpService, alertService, $state) {
    var basketService = {
      getTotal: getTotal,
      calcPrice: calcPrice,
      submitOrder: submitOrder,
      clearVoucher: clearVoucher,
    };
    return basketService;

    function submitOrder(payment) {
      var order = JSON.parse(JSON.stringify($localStorage.order));
      if (payment)
        order.info.payment = payment;
      if (order.info.address && order.info.address.id) {
        order.info.deliveryCharge = order.info.address.deliveryCharge;
        order.info.address = order.info.address.id;
      }
      order.cart = _.map(order.cart, sanitiseOrder.sanitiseCart);
      /*
          submit order
      */
      return httpService.post('/checkout', {
        data: JSON.stringify(order)
      });
    }

    function getTotal() {
      return calcPrice($localStorage.order);
    }

    function getDiscount(order) {
      return parseFloat(order.info.disc ? order.info.disc : 0);
    }

    function calcPrice(order) {
      var total = {};
      total.price = 0;
      total.discount = 0;
      total.delivery = 0;

      if (!order)
        return total;

      _.map(order.cart, function(cart) {
        total.price += (cart.price * cart.qty);
      });

      total.discount = getDiscount(order);
      total.sum = total.price - total.discount;
      if (order.info.logistics !== 'delivery' || !order.info.address) {
        total.delivery = 0;
      } else {
        storeService.findStores(order.info.address.postcode).then(function(data) {
          total.delivery = parseFloat(data.extraCharge);
          if (total.sum < parseFloat(data.min_spend))
            total.delivery = total.delivery + parseFloat(data.charge);
          total.sum = total.sum + total.delivery;
        });
      }

      return total;
    }

    function clearVoucher() {
      var order = $localStorage.order;
      delete order.voucher;
      delete order.info.voucher;
      delete order.addon;
      order.info.disc = 0;
    }

  }

  angular.module('app')
    .service('basketService', basketService);
})();
