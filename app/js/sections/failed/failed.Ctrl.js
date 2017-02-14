(function() {
  'use strict';

  failedCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup', '$ionicHistory','$stateParams'];

  function failedCtrl($scope, storeService, $state, $ionicPopup, $ionicHistory,$stateParams) {
    var vm = this;
    vm.goBack = function() {
      $ionicHistory.goBack();
    };
    switch($stateParams.msg){
      case 'external':vm.msg = 'We couldnt varify your Payment, perhaps try a different card'; break;
      case 'internal':vm.msg = 'we couldnt place your order'; break;
    }
  }
  angular
    .module('app')
    .controller('failedCtrl', failedCtrl);

})();
