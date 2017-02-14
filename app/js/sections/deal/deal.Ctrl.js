(function () {
  'use strict';

  dealCtrl.$inject = ['$scope', '$rootScope', 'storeService', '$state', '$ionicPopup', '$localStorage', 'config', '$ionicHistory', 'customiseService', 'utils', '$ionicScrollDelegate'];

  function dealCtrl($scope, $rootScope, storeService, $state, $ionicPopup, $localStorage, config, $ionicHistory, customiseService, utils, $ionicScrollDelegate) {

    var vm = this;
    utils.loadingShow();
    vm.deal = $state.params;
    vm.deal.price = +vm.deal.price;
    vm.deal.qty = 1;
    vm.deal.addprice = 0;
    vm.store = storeService.getCurrentStore();
    vm.allselect = 0;
    if (vm.deal.id == null) {
      $state.go('tab.deals');

    }

    vm.goBack = function () {
      var back = $ionicHistory.backView();
      if (!back || (back.stateId == 'tab.product'))
        $state.go('tab.deals');
      else
        $ionicHistory.goBack();
    };

    //-----------<editor-fold desc="returnig from h&h or from product">--------

    // check for broadcast customise from produt tab
    $scope.$on('getCustomize', getCustomize);
    // check for broadcast customise from produt tab or h&h
    $scope.$on('setHalf', getCustomize);

    $scope.$on('getPresets', getPresets);

    function getCustomize(event, deal) {
      $scope.$watch('vm.dealItems', function () {
        if (vm.dealItems) {
          vm.allselect = deal.allselect;
          vm.deal.addprice = 0;
          angular.forEach(deal.items, function (item) {
            var deal = _.findWhere(vm.dealItems, {id: item.itemId});
            deal.selected = item.prod;
            vm.deal.addprice += item.prod.addSum ? item.prod.addSum : 0;
          });
        }
      });

    };

    function getPresets(event, presets) {
      $scope.$watch('vm.dealItems', function () {
        if (vm.dealItems) {
          _.map(presets, function (preset) {

            var curr = _.findWhere(vm.dealItems, {id: preset.itemid});
            curr.selected = preset.selected;
          });
        }
      });
    }

    //-------------------</editor-fold>----------------


    //--------------------------<editor-fold desc="function customise current item in deal, going to product tab with customise mode">

    vm.customiseProduct = function (item) {
      var product = _.findWhere(item.items, {id: item.selected.id});

      //check for h&h mode if current product h&h than we going to h&h tab
      if (item.selected.id == config.hNhID) {
        product.presets = item.selected.half;
        $state.go('tab.halfNhalf', product)

        $scope.$on('$ionicView.afterLeave', function () {
          $rootScope.$broadcast('getHalf', customiseService.setProduct(item, vm.dealItems, null, vm.allselect, 1));
        });
      } else {
        product.presets = item.selected.toppings;
        $state.go('tab.product', product)

        $scope.$on('$ionicView.afterLeave', function () {
          $rootScope.$broadcast('getProduct', customiseService.setProduct(item, vm.dealItems, null, vm.allselect));
        });
      }
    }
    //--------------------------</editor-fold>--------------------------


    //--------------<editor-fold desc="filing order json to local storage">--------------------------

    vm.addToOrder = function () {

      utils.initOrder();

      var badorder = false;
      var cart =
      {
        "items": [],
        "deal": vm.deal.id,
        "name": vm.deal.name,
        "price": vm.deal.price + vm.deal.addprice,
        "qty": vm.deal.qty
      };
      //==================< remove orderr from basket and replace it >==============================
      if (vm.deal.presets)
        $localStorage.order.cart.splice(vm.deal.presets.index, 1);

      //this funcion create item obj at order json and add to item:[]
      function createItem(item) {

        var itemarr = {itemid: item.id, id:item.selected.id, half: item.selected.half, name: item.selected.name, item: []};

        if (item.selected.id == config.hNhID) {

          _.map(item.selected.half, function (item) {
            var newItem = {
              product: item.id,
              id: item.id,
              name: item.name,
              toppings: item.toppings,
              addinfo: item.addinfo
            };
            itemarr.item.push(newItem);
          });

          if (itemarr.item.length == 0)
            badorder = true;
          itemarr.size = item.size;

        } else {
          var newItem = {product: item.selected.id, id: item.selected.id, name: item.selected.name, toppings: []};
          if (item.selected.toppings) {
            newItem.toppings = item.selected.toppings;
            newItem.addinfo = item.selected.addinfo;
          }
          itemarr.item.push(newItem);
          itemarr.size = item.size;
        }
        return itemarr;
      };
      //add items object to items: []
      function addItems(items) {
        angular.forEach(vm.dealItems, function (item) {
          items.push(createItem(item));
        });
      }

      addItems(cart.items);
      if (!badorder) {
        $localStorage.order.cart.push(cart);
        console.log('You add new order from deal -> \n' + JSON.stringify($localStorage.order));
        $ionicHistory.goBack();
      }
    };
    //---------------------------------</editor-fold>---------------------------------

    //-------------------------------<editor-fold desc="folding items">-------------------------------
    vm.toggleGroup = function (group) {


      if (vm.isGroupShown(group)) {
        vm.shownGroup = null;
        $ionicScrollDelegate.resize();
        $ionicScrollDelegate.scrollTop();
      }
      else {
        vm.shownGroup = group;
      }

    };

    vm.isGroupShown = function (group) {
      return vm.shownGroup === group;
    };
    //-------------------------------</editor-fold>-------------------------------


    //-------------------<editor-fold desc="add product to selected value in item and check rule for lunch time">

    vm.setSelected = function (item, product, group) {

      item.selected = product;

      item.lunch_type = '62' === vm.deal.id ? 2 : 1;
      vm.allselect += vm.allselect == vm.dealItems.length ? 0 : 1;

      vm.toggleGroup(group);
      if (item.selected.id == config.hNhID)
        vm.customiseProduct(item);
    };
    //=============================</editor-fold>==============================================


    //=========================<editor-fold desc="start of controller and load items">===========
    storeService.tget('menu', vm.store.id).then(function (data) {

      vm.menu = data;
      $scope.$broadcast('loadDealItems');

    }, function (error) {
      console.log('error: Deal > issue with loading Menu : ' + error);
    });


    $scope.$on('loadDealItems', loadDealItems);

    function loadDealItems() {
      console.log('success : Deal > Items (loadDealItems) ');
      vm.dealItems = vm.dealItemsAdd(vm.deal, vm.menu, config, vm.store.halfNhalf == '1');
    }

    //-----------------------------------function filling items================================

    vm.dealItemsAdd = function (deal, menu, config, isHalfnHalf) {

      var dealItems = [];
      var items, searchby, category;
      deal.item_id = csv2array(deal.item_id);
      deal.item_size = csv2array(deal.item_size);
      deal.item_type = csv2array(deal.item_type);
      //deal.presets
      _.map(deal.item_id, function (id, i) {

        if (id) {

          //===exception: if Id is 0 make it one
          id = (id == 0) ? "1" : id;
          //IF ITS A PRODUCT
          if (deal.item_type[i] == 'product') {
            searchby = {
              'id': id
            };
            items = _.where(menu, searchby);
            category = items[0].category;
            vm.allselect += 1;
            items = {
              "id": i,
              "items": items,
              "size": deal.item_size[i],
              "type": deal.item_type[i],
              "lunch_type": id == config.margaritaID ? 2 : 0,
              "firstID": id == config.margaritaID ? config.margaritaID : null,
              "category": category,
              "selected": items[0]
            }
          }

          //IF ITS A PRODUCT TYPE
          if (deal.item_type[i] == 'type') {
            searchby = {
              'TyID': id
            };
            items = _.where(menu, searchby);

            category = items[0].category;
            if (id == '10') {
              items = items.concat(_.where(menu, {TyID: '2'}));
            }
            //if store has h&h function and this is product is pizza than add item h&h
            if (isHalfnHalf && (category == 'pizza')) {
              items.unshift(
                {
                  TyID: id,
                  alcohol: "0",
                  category: "pizza",
                  description: "Pizza made of two pizza",
                  id: config.hNhID,
                  name: "Half & half pizza",
                  sizes: "",
                  prices: ""
                }
              );
            }

            items = {
              "id": i,
              "items": items,
              "size": deal.item_size[i],
              "type": deal.item_type[i],
              "lunch_type": 0,
              "firstID": null,
              "category": category,
              "selected": null
            }

          }

          //console.log(_.findWhere(menu, searchby));

          dealItems.push(items);
        }

      });

      if (deal.presets) {
        vm.deal.addprice = deal.presets.cart.price - vm.deal.price;
        vm.deal.qty = deal.presets.cart.qty;
        _.map(deal.presets.cart.items, function (item) {
          var dealItem = _.findWhere(dealItems, {id: item.itemid});
          if (dealItem) {
            dealItem.selected = item;
            vm.allselect += 1;
          }
        });
      }

      utils.loadingHide();

      return dealItems;


    }
    //========================================</editor-fold>================================


  };


  function csv2array(data) {
    if (data)
      return data.split(',');
  }


  angular
    .module('app')
    .controller('dealCtrl', dealCtrl);
})();
