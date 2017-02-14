(function () {
  'use strict';

  tabCtrl.$inject = ['$localStorage', '$state', '$ionicTabsDelegate', 'alertService'];

  function tabCtrl($localStorage, $state, $ionicTabsDelegate, alertService) {

    var vm = this;

    vm.changeTab = changeTab;
    vm.order = $localStorage.order;

    function changeTab (index) {
      if(($localStorage.order) && ($localStorage.order.cart.length > 0)) {
        $state.go('tab.basket');
        $ionicTabsDelegate.select(index);
      } else
        alertService.add(2, 'Basket is empty');
    }
  }

  angular
    .module('app')
    .controller('tabCtrl', tabCtrl);
})();
