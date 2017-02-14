(function () {
  'use strict';

  halfNhalfCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup', 'toppingService', 'customiseService', '$rootScope', 'qty', '$localStorage', '$ionicHistory', 'utils', 'prodService', 'config'];

  function halfNhalfCtrl($scope, storeService, $state, $ionicPopup, toppingService, customiseService, $rootScope, qty, $localStorage, $ionicHistory, utils, prodService, config) {

    var vm = this;
    vm.store = storeService.getCurrentStore();
    vm.qty = qty;
    vm.orderItem = {price: 0, qty: vm.qty[0], toppings: [], sum:0, addSum:0};

    vm.goBack = function () {
      var back = $ionicHistory.backView();
      if (back && (back.stateName == 'tab.product'))
        $state.go('tab.home');
      else if (back && (back.stateName == 'tab.deal')) {
        $ionicPopup.confirm({
          title: "You don't save customise. Save it?",
        }).then(function (res) {
          if (res)
            vm.addToOrder();
          else
            $state.go('tab.home');
        });
      } else
        $ionicHistory.goBack();
    };
    utils.loadingShow();
    storeService.tget('menu', vm.store.id).then(function (data) {

      vm.menu = _.where(data, {category: 'pizza'});
      vm.addOrder = 'Add to order';
      vm.allselect = 0;
      loadItems(vm.menu);
      //$scope.$broadcast('loadDealItemsEnd');
    }, function (error) {
      utils.loadingHide();
      console.log(error);
    });

    function loadItems(menu) {
      vm.items = [];

      vm.sizes = _.without(toppingService.csv2array(menu[0].sizes), 'small');
      vm.orderItem.size = vm.sizes[0];
      for (var i = 0; i < 2; i++) {
        vm.items.push({
          "id": i,
          "items": menu,
          "size": vm.sizes[0],
          "price": 0,
          "addPrice": 0,
          "type": 'type',
          "lunch_type": 0,
          "category": 'pizza',
          "selected": null
        });
      }
      getPresets();
      utils.loadingHide();
    }

//---------------------------------Deal Section
    $scope.$on('getHalf', function (event, deal) {
      vm.deal = deal;
      vm.orderItem.size = deal.size;
      vm.addOrder = 'Save to deal';
    });


    vm.customiseProduct = function (item, presets) {
      var product = _.findWhere(item.items, {id: item.selected.id});
      if (presets) {
        var currpresets = _.filter(item.selected.toppings, function (elem) {
          return !_.include(['base', 'cheese', 'sauce'], elem.type);
        });
        product.presets = currpresets.concat(presets);
        vm.prodService = new prodService(null, product);
        vm.prodService.onGetProduct(customiseService.setProduct(item, vm.items, vm.deal, vm.allselect, 1, true));
      } else {
        product.presets = item.selected.toppings;
        $state.go('tab.product', product)

        $scope.$on('$ionicView.afterLeave', function () {
          $rootScope.$broadcast('getProduct', customiseService.setProduct(item, vm.items, vm.deal, vm.allselect, 1));
        });
      }
    }

    function findBase(itemProd) {
      var presets = [];
      if (itemProd.addinfo.base)
        presets.push({id: itemProd.addinfo.base.id, qty: 1});
      _.map(itemProd.addinfo.toppings, function (elem) {
        if ((elem.type == 'sauce') || (elem.type == 'cheese'))
          presets.push(elem);
      });
      return presets;
    };

    $scope.$on('getCustomize', function (event, value) {
      $scope.$watch('vm.items', function () {
        if (vm.items) {
          var product, oldProduct, presets;
          if (value.add) {
            vm.deal = value.add;
            vm.addOrder = 'Save to deal';
          }
          vm.orderItem.size = value.size;
          vm.allselect = value.allselect;

          angular.forEach(value.items, function (item) {
            product = _.findWhere(vm.items, {id: item.itemId});
            product.selected = item.prod;
            product.price += item.prod.sum ? item.prod.sum : 0;
            product.addPrice += item.prod.addSum ? item.prod.addSum : 0;
            vm.recalcPrice();
            if (item.itemId == value.itemId)
              presets = findBase(item.prod);

            if ((item.itemId != value.itemId) && !value.normaliseBase)
              oldProduct = product;
          });
          if (oldProduct)
            vm.customiseProduct(oldProduct, presets);
        }
      });
    });
    //-----------------------------------------------------------------------
    vm.recalcPrice = function () {
      var sum = 0;
      var addSum = 0;
      _.map(vm.items, function (item) {
        vm.itemSetPrice(item);
        if ((sum + addSum) < (item.price + item.addPrice)) {
          sum = item.price;
          addSum = item.addPrice;
          if (item.selected.toppings)
            vm.orderItem.toppings = item.selected.toppings;
        }
        vm.orderItem.sum = sum;
        vm.orderItem.addSum = addSum;
      })
    };

    vm.itemSetPrice = function (item) {
      item.size = vm.orderItem.size;
      var prices = [];
      var sizes = [];
      var oldprice = item.price;

      if (item.selected) {
        if (item.selected.prices) {
          prices = toppingService.csv2array(item.selected.prices);
          sizes = toppingService.csv2array(item.selected.sizes);
        }
        else {
          var currProd = _.findWhere(vm.menu, {id: item.selected.id})
          prices = toppingService.csv2array(currProd.prices);
          sizes = toppingService.csv2array(currProd.sizes);
        }
      }

      for (var i = 0; i < sizes.length; i++) {
        if (sizes[i] == item.size) {
          item.price = +prices[i];
          break;
        }

      }
      var diff = oldprice == 0 ? 1 : item.price / oldprice;
      item.addPrice = item.addPrice * diff;

    }
    //------------presets----------------

    function getPresets() {
      vm.prodPresets = $state.params.presets;
       var presets;
      if (vm.prodPresets) {
        if (vm.prodPresets.cart) {
          presets = vm.prodPresets.cart.items[0].item;
          vm.orderItem.size = vm.prodPresets.cart.items[0].size;
        } else
          presets = vm.prodPresets;
        _.map(presets, function (elem, index) {
          vm.setSelected(vm.items[index], elem, true);
        });

      }
    }

    //---------------------------------
    vm.toggleGroup = function (group) {


      if (vm.isGroupShown(group)) {
        vm.shownGroup = null;

      }
      else {
        vm.shownGroup = group;
      }

    };

    vm.isGroupShown = function (group) {
      return vm.shownGroup === group;
    };

    vm.setSelected = function (item, product, noToggle) {
      vm.allselect += vm.allselect == 2 ? 0 : 1;
      item.selected = product;
      vm.recalcPrice();
      if (!noToggle)
        vm.toggleGroup(item.id);
    };

    vm.addToOrder = function () {
      if (vm.deal) {
        var ordItem = {
          product: config.hNhID,
          name: vm.items[0].selected.name + '/' + vm.items[1].selected.name,
          id: config.hNhID,
          half: [],
          qty: vm.orderItem.qty,
          size: vm.orderItem.size,
          sum: vm.orderItem.sum,
          addSum: vm.orderItem.addSum
        };
        ordItem.half.push(vm.items[0].selected);
        ordItem.half.push(vm.items[1].selected);
        angular.forEach(vm.deal.items, function (item) {
          if (item.prod.id == config.hNhID) {
            item.prod = ordItem;
          }
        });
        $scope.$on('$ionicView.afterLeave', function () {
          $rootScope.$broadcast('setHalf', vm.deal);
        });
      } else {
        utils.initOrder();
        if (vm.prodPresets)
          $localStorage.order.cart.splice(vm.prodPresets.index, 1);

        var cart =
        {
          "id": config.hNhID,
          name: 'Half & half pizza',
          "price": vm.orderItem.sum + vm.orderItem.addSum,
          "isPizza": true,
          "size": vm.orderItem.size,
          "items": [
            {
              "item": [],
              size: vm.orderItem.size
            }
          ],
          qty: vm.orderItem.qty
        };
        _.map(vm.items, function (item) {
          var prod = {
            id: item.selected.id,
            product: item.selected.id, name: item.selected.name, toppings: [],
            "type": item.selected.category,
            addinfo: item.selected.addinfo
          }
          if (item.selected.toppings)
            prod.toppings = item.selected.toppings;
          cart.items[0].item.push(prod);
        });
        $localStorage.order.cart.push(cart);
        console.log('You add new order from product -> \n' + JSON.stringify($localStorage.order));
      }

      $ionicHistory.goBack();

    }
  }


  angular
    .module('app')
    .controller('halfNhalfCtrl', halfNhalfCtrl);


})();
