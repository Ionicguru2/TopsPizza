(function() {
  'use strict';

  productCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicPopup', '$ionicHistory', '$ionicNavBarDelegate', '$ionicScrollDelegate', 'prodService'];

  function productCtrl($scope, $rootScope, $state, $ionicPopup, $ionicHistory, $ionicNavBarDelegate, $ionicScrollDelegate, prodService) {

    $ionicNavBarDelegate.showBackButton(true);
    var vm, prodService;
    vm = this;
    vm.product = $state.params;
    vm.showBase = false;
    vm.showToppings = false;
    vm.customise = false;
    if (!vm.product.id) {
      $state.go('tab.menu');
      return;
    }
    prodService = new prodService(vm);
    vm.goBack = goBack;

    function goBack() {

      if ((_.keys(vm.stateItem.pay).length > 0) || !vm.stateItem.swap.dummy)
        $ionicPopup.confirm({
          title: "Would you like to save your changes?",
        }).then(function(res) {
          if (res)
            vm.addToOrder();
          go();
        });
      else
        go();
    }

    function go() {
      var back = $ionicHistory.backView();
      if (!back)
        $state.go('tab.menu');
      else
        $ionicHistory.goBack();
    }

    $scope.$on('getProduct', function(event, deal) {
      if (!deal)
        return;
      prodService.onGetProduct(deal);
      //=============after leave view return deal presets===========================
      $scope.$on('$ionicView.afterLeave', function() {
        $rootScope.$broadcast('getCustomize', vm.deal);
      });
    });

    vm.changeQty = function(curr) {
      prodService.changeQty(curr);
    };
    /*
     vm.setActiveCtrl = function setActiveCtrl(input) {
     vm.showToppings = input;
     return input;
     };
     */
    vm.isActiveCtrl = function isActiveCtrl(input) {
      return (vm.showToppings == input) ? true : false;
    };

    vm.resetToppings = function() {
      prodService.resetToppings();
    };

    /*    vm.saveCustomise = function () {
     vm.showContent(0);
     };*/

    vm.recalcPrice = function() {
      prodService.recalcPrice();
    };

    vm.addToOrder = function() {
      prodService.addToOrder();
    };

    vm.setBaseSelected = function(curr) {
      prodService.changeQty(curr);
      vm.showContent(0);
    };

    vm.showContent = function(type) {
      switch (type) {
        case 0:
          {
            vm.showBase = false;
            vm.showToppings = false;
            $ionicNavBarDelegate.title('Hello Pizza Lover');
            $rootScope.hideTabs = '';
            break;
          }
        case 1:
          {
            vm.showBase = !vm.showBase;
            $ionicNavBarDelegate.title('');
            $rootScope.hideTabs = 'tabs-item-hide';
            break;
          }
        case 2:
          {
            vm.showToppings = 'sauce';
            $ionicNavBarDelegate.title('');
            $rootScope.hideTabs = 'tabs-item-hide';
            break;
          }
      }
      vm.customise = !vm.customise;

      /*
       $ionicNavBarDelegate.showBar(!vm.customise);
       $ionicScrollDelegate.resize();
       $ionicScrollDelegate.scrollTop();*/
    };
  }


  angular
    .module('app')
    .controller('productCtrl', productCtrl);


})
();
