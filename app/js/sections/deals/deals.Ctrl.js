(function() {
	'use strict';

	dealsCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicHistory', 'utils'];

	function dealsCtrl($scope, storeService, $state, $ionicHistory, utils){
		var vm = this;

		vm.selectDeal = selectDeal;
		vm.store = storeService.getCurrentStore();

    utils.loadingShow();
		storeService.tget('deals', vm.store.id).then(function(data) {
      utils.loadingHide();
			vm.deals = data;

		}, function (error) {
      console.log('error loading menu in deals - '+error);
      utils.loadingHide();
    });

    vm.goBack = function () {
      var back = $ionicHistory.backView();
      if (!back || (back.stateId == 'tab.deal'))
        $state.go('tab.menu');
      else
        $ionicHistory.goBack();
    };
	};



	function selectDeal(deal) {

		if(deal.item_id){
			return 'tab.deal(' + JSON.stringify(deal) + ')';
		}

	}

	angular
		.module('app')
		.controller('dealsCtrl', dealsCtrl);

})();
