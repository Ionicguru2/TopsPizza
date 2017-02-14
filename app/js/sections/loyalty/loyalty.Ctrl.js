(function () {
  'use strict';

  loyaltyCtrl.$inject = ['authService', 'storeService', 'utils', '$state', '$localStorage'];
  function loyaltyCtrl(authService, storeService, utils, $state, $localStorage) {
    var vm = this;
    utils.loadingShow();
    vm.store = storeService.getCurrentStore();
    authService.getUserInfo(function (result) {
      utils.loadingHide();
      if (result.data && result.data.loyality)
        vm.loyalty = result.data.loyality.loyalty;
      else
        vm.loyalty = 0;
      if (vm.loyalty < 1000)
        $localStorage.freeDeal = null;
    });

    vm.orderNow = orderNow;

    function orderNow(){
      if (utils.checkQtyFreeDeal())
      {
        storeService.tget('loyality',vm.store.id).then(function(data){
          if (data && !data.error){
            $localStorage.freeDeal = data;
            $state.go('tab.deal', data);
          }
        });
      }
    };
  };

  angular
    .module('app')
    .controller('loyaltyCtrl', loyaltyCtrl);
})();
