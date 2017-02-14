(function () {
  'use strict';


  storesCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup', 'utils', 'alertService'];

  function storesCtrl($scope, storeService, $state, $ionicPopup, utils, alertService) {

    var vm = this;
    vm.setStore = setStore;

    storeService.getAllStores().success(function (data, status, headers, config) {
      vm.allStores = data;
    });

    function setStore(store) {

      if (store) {
        if (utils.checkColseStore(store)) {
          storeService.setCurrentStore(store);
          $state.go('tab.home');
        } else
        alertService.add(2, 'Store is closed now!');
      }
    }


  }

  angular
    .module('app')
    .controller('storesCtrl', storesCtrl);

})();
