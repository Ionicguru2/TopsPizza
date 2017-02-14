(function () {
  'use strict';
 basketCtrl.$inject = ['$scope', '$rootScope', 'storeService',  '$state', 'config', '$localStorage', 'httpService', 'utils', 'alertService'];
  function basketCtrl($scope, $rootScope, storeService,  $state, config, $localStorage, httpService, utils, alertService) {
    var vm = this;
    utils.initOrder();
    vm.order = $localStorage.order;
    //console.log('You order  = \n' + JSON.stringify($localStorage.order));

    //vm.orderItems = vm.order.cart;
    vm.sum = 0;
    //vm.disc = 0;
    //vm.cartVoucher = $localStorage.order.info.voucher;
    vm.calcPrice = calcPrice;

    calcPrice();


    function calcPrice () {
      vm.sum = 0;
      if (vm.order)
        _.map(vm.order.cart, function (cart) {
          vm.sum += cart.price * cart.qty;
        });
    };

    vm.delItem = function (index) {
      vm.order.cart.splice(index, 1);
      vm.calcPrice();
      if (vm.order.cart.length < 1)
      {
        alertService.add(2,'Basket is empty');
        $state.go('tab.home');
      }
    };

    vm.store = storeService.getCurrentStore();
    utils.loadingShow(); //-------deals menu-------------------
    storeService.tget('deals', vm.store.id).then(function (data) {

      vm.deals = data;
      utils.loadingHide();

    }, function (error) {

      console.log(error);
      utils.loadingHide();

    });

    utils.loadingShow(); //-------load menu-------------------
    storeService.tget('menu', vm.store.id).then(function (data) {

      data = _.map(data, function (val) {
        if (val.category == 'ice cream')
          val.category = 'dessert';

        return val;
      });

      vm.menu = data;
      utils.loadingHide();
    }, function (error) {

      console.log(error);
      utils.loadingHide();

    });


    vm.getbase = function (item) {
      if (item.addinfo)
        return item.addinfo.base;
    };

    vm.getToppings = function (item) {
      if (item.addinfo)
        return item.addinfo.toppings;
    };


    vm.customiseCart = function (index) {
      vm.presets = {cart: vm.order.cart[index], index: index};

      if (vm.order.cart[index].deal) {

        var deal = _.findWhere(vm.deals, {id: vm.order.cart[index].deal});

        if (deal) {
          deal.presets = vm.presets;
          $state.go('tab.deal', deal);
        }

      } else if (vm.order.cart[index].id == config.hNhID){
        $state.go('tab.halfNhalf', {presets:vm.presets});
      } else
      {
        var product = _.findWhere(vm.menu, {id: vm.order.cart[index].id});
        if (product) {
          product.presets = vm.presets;
          $state.go('tab.product', product);
        }
      }
    };
    /*
    //-------------<editor-fold desc="Check voucher">--------------------------
    vm.update = function (showAlert) {
      function doDisc(type, summ, amount, cnt) {

        switch (type) {
          case 'percent':
            return (summ * amount) / 100;
          case 'value':
            return amount * cnt;
        }
      };

      if (vm.cartVoucher) {

        httpService.post('/check_voucher', {data: JSON.stringify({
            "info": {
              "voucher": vm.cartVoucher,
              "store": vm.store.id
            }
          })}).then(function (result) {
          if (result.data && !result.data.error) {
            $localStorage.order.info.voucher = result.data.voucher;
            var setDisc = false;
            if (result.data.cartMin) {
              if (vm.sum >= +result.data.cartMin)
                setDisc = true;
            }
            if (result.data.type == 'addon') {
              //add to order this product?
              var product = _.findWhere(vm.menu, {id: result.data.addon});
              vm.addon = $localStorage.addon = {
                id: product.id,
                name: product.name,
                qty: 1,
                size: product.sizes.split(',')[0]
              };
            }
            else if (setDisc && (result.data.addon) && (result.data.addon.length > 0)) {
              var items = _.filter($localStorage.order.cart, function (val) {
                return _.include(result.data.addon, val.TyID)
              });
              var sum = 0;
              _.map(items, function (item) {
                sum += item.price * item.qty;
              });
              vm.disc = doDisc(result.data.type, sum, +result.data.amount, result.data.addon.length);
            } else if (setDisc){
              vm.disc = doDisc(result.data.type, vm.sum, +result.data.amount, $localStorage.order.cart.length);
            }
            vm.order.info.disc = vm.disc;
          } else
          {
            alertService.showAlert('Voucher is not available','this voucher is invalid or has expired');
          }
        });
      } else{
        if(showAlert)
         alertService.showAlert('Voucher is not available','this voucher is invalid or has expired');
        vm.disc = 0;
        vm.addon = $localStorage.addon = null;
        vm.order.info.disc = vm.disc;
      }

    };
    //When going to this view need to check voucher from order
    vm.update();
    //</editor-fold>

    vm.delVoucher = function () {
      vm.cartVoucher = vm.order.info.voucher = null;
      vm.update();
    };
    */
  }

  angular
    .module('app')
    .controller('basketCtrl', basketCtrl);
})();
