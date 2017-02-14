(function() {
  'use strict';

  checkoutCtrl.$inject = ['$state', '$ionicHistory', 'httpService', '$localStorage', 'utils', 'storeService', 'voucherService', 'basketService'];

  function checkoutCtrl($state, $ionicHistory, httpService, $localStorage, utils, storeService, voucherService, basketService) {
    var vm = this;
    vm.payment = 'card';
    utils.initOrder();
    vm.order = $localStorage.order;
    vm.sum = 0;
    vm.voucherInput = $localStorage.order.info.voucher;
    vm.tracking = tracking;
    vm.goBack = $ionicHistory.goBack;
    vm.voucherEvent = voucherEvent;
    vm.total = basketService.getTotal();
    getAddress();



    function getAddress() {
      if (utils.getOrderInfo().address)
        vm.address = utils.getOrderInfo().address.No + ' ' + utils.getOrderInfo().address.address;
    }
    vm.store = storeService.getCurrentStore();
    utils.loadingShow();
    //-------deals menu-------------------
    storeService.tget('deals', vm.store.id).then(function(data) {
      vm.deals = data;
      utils.loadingHide();
    }, function(error) {
      //console.log(error);
      utils.loadingHide();
    });
    utils.loadingShow();
    //-------load menu-------------------
    storeService.tget('menu', vm.store.id).then(function(data) {
      data = _.map(data, function(val) {
        if (val.category == 'ice cream')
          val.category = 'dessert';
        return val;
      });
      vm.menu = data;
      utils.loadingHide();
    }, function(error) {
      //console.log(error);
      utils.loadingHide();
    });
    vm.getbase = function(item) {
      if (item.addinfo)
        return item.addinfo.base;
    };
    vm.getToppings = function(item) {
      if (item.addinfo)
        return item.addinfo.toppings;
    };

    function tracking() {
      if (!vm.store)
          alertService.add(2, 'we couldn\'t find the store');
      if (vm.store.active === '0')
          alertService.add(2, 'Tops Pizza ' + vm.store.name + ' is closed or not accepting orders online');
      if (vm.order.info.logistics == 'delivery' && vm.total.price < parseFloat(vm.store.min_spend))
          alertService.add(2, 'Tops Pizza ' + vm.store.name + ' minimum order for delivery is £' + vm.store.min_spend + ', Please add £' + (vm.store.min_spend - vm.total.price).toFixed(2) + ' to your order total');
      else if (vm.payment === 'card')
          $state.go('tab.payment')
      else {
          vm.onSubmit = true;
          basketService.submitOrder();
      }
    }

    function voucherEvent() {
      if (vm.order.info.voucher || !vm.voucherInput) {
        basketService.clearVoucher();
        vm.total = basketService.getTotal();
        return vm.voucherInput = vm.order.info.voucher = null;
      }
      vm.voucherInput = vm.voucherInput.replace(/ /g, '').trim().toLowerCase();
      voucherService.init(vm.voucherInput, vm.store, vm.total);
    }

  }

  angular
    .module('app')
    .controller('checkoutCtrl', checkoutCtrl);
})();
