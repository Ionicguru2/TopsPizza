(function () {
    'use strict';

    productsCtrl.$inject = ['$scope','storeService', '$state','$ionicHistory', 'utils'];

	function productsCtrl($scope, storeService, $state, $ionicHistory, utils) {

	    var vm = this;
	    vm.store = storeService.getCurrentStore();
    if (vm.store.halfNhalf == 1)
      vm.ishalfNhalf = true;
	    vm.category = $state.current.name.split(".")[1];
      utils.loadingShow();
	    storeService.tget('menu', vm.store.id).then(function(data){

	    	data = _.map(data, function(val, key){
	    		if(val.category == 'ice cream')
	    			val.category = 'dessert';

	    		return val;
	    	});

	    	vm.menu  = data;
        utils.loadingHide();
	    }, function (error) {
        console.log('error loading menu in products - '+error);
        utils.loadingHide();
      });

	    /*
	    Functions
	    */

	    vm.selectproduct = function selectproduct(product){
			return 'tab.product(' + JSON.stringify(product)+')';
		}

    vm.goBack = function () {
      var back = $ionicHistory.backView();
      if (!back || (back.stateId == 'tab.product'))
        $state.go('tab.menu');
      else
        $ionicHistory.goBack();
    };
	};

	angular
        .module('app')
        .controller('productsCtrl', productsCtrl);


})();
