(function () {
    'use strict';

    legalsCtrl.$inject = ['$scope','storeService', '$state','$ionicPopup', '$ionicHistory'];
	function legalsCtrl($scope, storeService, $state, $ionicPopup, $ionicHistory) {
	   var vm = this;
    vm.goBack = function () {
      $ionicHistory.goBack();
    };
	};

    angular
        .module('app')
        .controller('legalsCtrl', legalsCtrl);

})();
