(function() {
  'use strict';

  locatorCtrl.$inject = ['storeService', 'utils', '$state', 'alertService', '$localStorage'];
  function locatorCtrl(storeService, utils, $state, alertService, $localStorage) {
    var vm = this;
    vm.postcode = $localStorage.postcode;
    vm.searchStore = searchStore;
    vm.initStore = initStore;

    function searchStore() {
      if (!vm.postcode) {
        alertService.add(2, 'Please enter a valid postcode');
        return;
      }
      vm.postcode = vm.postcode.trim().toLowerCase();
      utils.loadingShow();
      storeService.findStores(vm.postcode).then(function(data){
        utils.loadingHide();
        if (!data || data.error) {
          alertService.add(2, 'Please enter a valid postcode');
          return;
        }
        $localStorage.postcode = vm.postcode;
        vm.initStore(data);
      });
    }
    function initStore(store) {
      storeService.setCurrentStore(store);
      storeService.getToppings(store.id);
      storeService.tget('deals', store.id).then(function(data) {
        $state.go('tab.home');
      });
    }
  }
  angular
    .module('app')
    .controller('locatorCtrl', locatorCtrl);

})();
