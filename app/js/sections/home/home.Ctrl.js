(function() {
    'use strict';
    homeCtrl.$inject = ['storeService'];
    function homeCtrl(storeService){
		var vm = this;
		vm.selectDeal = selectDeal;
		vm.store = storeService.getCurrentStore();
		storeService.tget('deals', vm.store.id).then(function(data) {
			vm.deals = data;
		});
    function selectDeal(deal) {
  		if(deal.item_id)
  			return 'tab.deal(' + JSON.stringify(deal) + ')';
  	}
	}
    angular
        .module('app')
        .controller('homeCtrl', homeCtrl);
})();
