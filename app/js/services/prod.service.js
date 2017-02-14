(function() {
  //Service for product
  prodService.$inject = ['$rootScope', 'storeService', '$ionicPopup', 'qty', 'toppingService', '$localStorage', '$ionicHistory', 'config', 'utils'];

  function prodService($rootScope, storeService, $ionicPopup, qty, toppingService, $localStorage, $ionicHistory, config, utils) {
    var prodService = function(context, product) {
      var vm, self;
      if (context)
        this.vm = context;
      else
        this.vm = {};

      vm = this.vm;
      self = this;
      //var self = this;
      if (product)
        vm.product = product;
      vm.customise = false;
      vm.addOrder = 'Add to order';
      vm.store = storeService.getCurrentStore();
      vm.qty = qty;
      /*      vm.getPresets = getPresets;
       vm.saveCustomise = this.saveCustomise;*/
      //===================<editor-fold desc="init default items">===========================
      //init obj for logic and calc prices
      vm.store.sizes = vm.store.sizes.replace(/'/g, "").split(',');
      vm.product.sizes = vm.product.sizes.split(',');
      vm.product.prices = vm.product.prices.split(',');

      vm.stateItem = {
        swap: {},
        pay: {},
        oldbase: {},
        freecheese: {},
        freesauce: {},
        etalons: {},
        checkEtalon: [],
        cnt: 0,
        freeswaps: 0,
        smallsize: config.smallsize,
        prices: vm.product.prices
      };

      vm.stateItem.sizes = _.chain(vm.product.sizes).map(function(curr, index) {
        return {
          value: curr,
          label: (curr == "none") ? '£' + vm.product.prices[index] : curr
        };
      }).filter(function(data, index) {
        if(_.contains(vm.store.sizes, data.value) || _.contains(['none', 'Can','bottle','triple'], data.value))
          return true;
        vm.stateItem.prices.splice(_.findIndex(vm.product.sizes,data.value), 1);
      }).value();

      vm.deal = false;

      //init object add to order
      vm.orderItem = {
        product: vm.product.id,
        toppings: [],
        addinfo: {},
        qty: vm.qty[0],
        size: vm.stateItem.sizes[0],
        sum: vm.stateItem.prices[0],
        addSum: 0
      };
      vm.stateItem.freeswaps = config.swaps;
      vm.stateItem.swap = toppingService.initSwap(vm.stateItem.freeswaps);

      //=================================</editor-fold>========================================


      //======================<editor-fold desc="Do preset for pizza">==========================
      vm.preSets = {
        doPreSet: function(presetArray, IIDs) {
          angular.forEach(presetArray, function(value) {
            value.qty = 0;
            for (var i = 0; i < IIDs.length; i++) {
              if (IIDs[i] == value.id) {
                value.qty = 1;
                if (_.include(['fish', 'meat', 'veg'], value.type))
                  vm.stateItem.cnt += 1;
                break;
              }
            }
          });
        },
        defPreSets: function() {
          if (vm.product.IIDs && vm.product.IIDs !== '') {

            //_.findWhere(vm.toppings.base, {id: config.classicBase}).qty = 1;
            this.doPreSet(vm.toppings.base, [config.classicBase]);
            this.doPreSet(vm.toppings.cheese, vm.product.IIDs.split(','));
            this.doPreSet(vm.toppings.fish, vm.product.IIDs.split(','));
            this.doPreSet(vm.toppings.meat, vm.product.IIDs.split(','));
            this.doPreSet(vm.toppings.sauce, vm.product.IIDs.split(','));
            this.doPreSet(vm.toppings.veg, vm.product.IIDs.split(','));
            vm.stateItem.checkEtalon = JSON.parse(JSON.stringify(_.flatten(_.values(vm.toppings))));
            vm.stateItem.etalons = toppingService.initEtalons(vm.toppings.fish.concat(vm.toppings.meat.concat(vm.toppings.veg)));
            vm.stateItem.freesauce = toppingService.initEtalons(vm.toppings.sauce);
            vm.stateItem.freecheese = toppingService.initEtalons(vm.toppings.cheese);
            vm.stateItem.oldbase = config.classicBase;
            vm.stateItem.toppings = _.flatten(_.values(vm.toppings));

          }
        }
      };
      //======================================</editor-fold>=================================

      //------------------------------------------------------------------------
      utils.loadingShow();
      storeService.tget('toppings', vm.store.id).then(function(data) {

        vm.toppings = _.groupBy(data, 'type');
        vm.preSets.defPreSets();
        getPresets(vm.product.presets, vm.deal ? vm.deal.normaliseBase : null, self);
        utils.loadingHide();
      }, function(error) {
        console.log('product load toppings error - ' + error);
        utils.loadingHide();
      });

      /*
       vm.customiseProduct = function customiseProduct() {
       vm.customise = 'base';

       }
       */

      //=======================<editor-fold desc="custom presets from basket">======================
      function getPresets(prodPresets, normaliseBase, self) {

        if (prodPresets) {
          var presets, curr;
          if (prodPresets.cart) {
            vm.orderItem.size = _.findWhere(vm.stateItem.sizes, {
              value: prodPresets.cart.size.toLowerCase()
            });
            vm.orderItem.qty = prodPresets.cart.qty;
            presets = _.sortBy(prodPresets.cart.items[0].item[0].toppings, function(num) {
              return Math.sin(num.qty);
            });
          } else {
            presets = _.sortBy(prodPresets, function(num) {
              return Math.sin(num.qty);
            });
          }
          _.map(presets, function(item) {
            curr = _.findWhere(vm.stateItem.toppings, {
              id: item.id
            });
            if (curr) {
              //curr = JSON.parse(JSON.stringify(curr));
              if ((item.qty == -1) && _.include(['base', 'cheese', 'sauce'], curr.type)) {
                //do nothing
              } else if ((item.qty == 2) && _.include(['cheese', 'sauce'], curr.type)) {
                curr.qty = 1;
                self.changeQty(curr);
                curr.qty = 2;
                self.changeQty(curr);
              } else {
                if (item.qty == -1)
                  curr.qty = 0;
                else {
                  curr.qty = item.qty;
                  if (curr.type == 'base')
                    vm.choice = curr.id;
                }

                self.changeQty(curr);
              }
            }
          });
          if (normaliseBase)
            self.addToOrder();
        }
      }
      //==================================</editor-fold>=============================================


    };

    prodService.prototype.onGetProduct = function(deal) {
      var vm = this.vm;

      vm.addOrder = 'Save';
      vm.deal = deal;
      if ((deal.dtype > 0) && (vm.product.id == config.margheritaID)) {
        vm.stateItem.freeswaps = deal.dtype == 1 ? config.margheritaDealChanges : config.margheritaLunchtimeChanges;
        vm.stateItem.swap = {};
      } else {
        vm.stateItem.freeswaps = config.swaps;
        vm.stateItem.swap = toppingService.initSwap(vm.stateItem.freeswaps);
      }

      vm.orderItem.name = vm.product.name;
      vm.orderItem.id = vm.product.id;
      vm.orderItem.size = _.findWhere(vm.stateItem.sizes, {
        value: deal.size.toLowerCase()
      });
      /*var presets = _.findWhere(deal.items, {itemId: deal.itemId});
       if (presets.prod.toppings)
       vm.getPresets(presets.prod);*/

      toppingService.calcPrice(vm.orderItem, vm.stateItem);
      //vm.customiseProduct();

      //=============after leave view return deal presets===========================
      /*        scope.$on('$ionicView.afterLeave', function () {
       $rootScope.$broadcast('getCustomize', vm.deal);
       });*/

    };
    ///---------------------------------
    prodService.prototype.resetToppings = function resetToppings() {

      this.vm.stateItem.pay = {};
      this.vm.stateItem.cnt = 0;
      this.vm.preSets.defPreSets(this.vm);
      this.vm.stateItem.freeswaps = this.vm.product.id == config.margheritaID ? 0 : config.swaps;
      this.vm.stateItem.swap = toppingService.initSwap(this.vm.stateItem.freeswaps);

      if ((this.vm.deal) && (this.vm.product.id == config.margheritaID)) {
        this.vm.stateItem.freeswaps = this.vm.deal.dtype == 1 ? config.margheritaDealChanges : config.margheritaLunchtimeChanges;
        this.vm.stateItem.swap = {};
      } else {
        this.vm.stateItem.freeswaps = config.swaps;
        this.vm.stateItem.swap = toppingService.initSwap(this.vm.stateItem.freeswaps);
      }

      toppingService.calcPrice(this.vm.orderItem, this.vm.stateItem);
    };

    /*    //====================< button save in customise mode product view >==============================
     prodService.prototype.saveCustomise = function () {
     var vm = this.vm?this.vm:this;
     vm.showContent(0);
     };*/

    prodService.prototype.recalcPrice = function() {
      if (this.vm.orderItem.size.value == config.smallsize)
        toppingService.resetBase(this.vm.stateItem, this.vm.toppings.base);
      toppingService.calcPrice(this.vm.orderItem, this.vm.stateItem);
    };

    prodService.prototype.changeQty = function(curr) {
      if (toppingService.addTopping(this.vm.stateItem, curr, this.vm.toppings) === true) {
        toppingService.calcPrice(this.vm.orderItem, this.vm.stateItem);
      } else
        $ionicPopup.alert({
          title: 'You cannot add more toppings!',
          template: '7 topping max.'
        });
    };


    //==================<editor-fold desc="add order section">========================
    prodService.prototype.addToOrder = function() {
      var vm = this.vm;

      toppingService.saveOrder(vm.orderItem, vm.stateItem, [].concat(vm.toppings.base, vm.toppings.cheese, vm.toppings.fish, vm.toppings.meat, vm.toppings.sauce, vm.toppings.veg), vm.product.category);


      if (vm.deal) {

        _.map(vm.deal.items, function(value) {
          if (value.itemId == vm.deal.itemId)
            value.prod = vm.orderItem;
        });
        if (vm.deal.normaliseBase)
          $rootScope.$broadcast('getCustomize', vm.deal);
        else
          $ionicHistory.goBack();
        return;
      }

      utils.initOrder();


      //==================< remove orderr from basket and replace it >==============================
      if (this.vm.product.presets)
        $localStorage.order.cart.splice(this.vm.product.presets.index, 1);

      var cart = {
        "id": this.vm.product.id,
        "name": this.vm.product.name,
        "price": this.vm.orderItem.sum + this.vm.orderItem.addSum,
        "isPizza": this.vm.product.category == 'pizza',
        "size": this.vm.orderItem.size.value,
        "TyID": this.vm.product.TyID,
        "items": [{
          "item": [{
            product: this.vm.orderItem.product,
            "type": this.vm.product.category,
            addinfo: this.vm.orderItem.addinfo
          }],
          size: this.vm.orderItem.size.value
        }],
        qty: this.vm.orderItem.qty
      };

      if (this.vm.orderItem.toppings)
        cart.items[0].item[0].toppings = this.vm.orderItem.toppings;
      $localStorage.order.cart.push(cart);
      console.log('You add new order from product -> \n' + JSON.stringify($localStorage.order));
      $ionicHistory.goBack();


    };

    //=============================</editor-fold>====================================
    return prodService;
  }
  angular
    .module('app')
    .factory('prodService', prodService);

})
();
