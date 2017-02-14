(function () {
  'use strict';
  angular
    .module('app')
    .directive('brandEffect', brandEffect)
    .controller("brandEffectCtrl", brandEffectCtrl);

  brandEffect.$inject = ['$state'];

  function brandEffect($state) {

    return {
      restrict: 'E',
      replace: 'true',
      controller: 'brandEffectCtrl',
      templateUrl: 'js/directives/brandEffect/brandEffect.html'
    };

  }


  brandEffectCtrl.$inject = ['$scope', '$state', 'storeService'];

  function brandEffectCtrl($scope, $state, storeService) {

    //$scope.$watch(function () {
      var store = storeService.getCurrentStore();

      //if store is not available Please redirect to locator
      /*if (!store || store.active != 1)
        $state.go('tab.locator');*/

      $scope.store = store;
      $scope.openning = false;
      showTimes();
    //});
    $scope.showMap = function () {
      var lat = parseFloat($scope.store.latitude);
      var long = parseFloat($scope.store.longitude);
      var text = encodeURIComponent($scope.store.name)
      if (ionic.Platform.isIOS())
        window.open("maps://maps.apple.com/?q=" + lat + "," + long, '_system', 'location=yes')
      else
        window.open("geo:" + lat + "," + long, '_system', 'location=yes')
    };

    function showTimes() {
      $scope.weekdays = new Array(7);
      $scope.weekdays[0] = {day: "Sunday", time: ''};
      $scope.weekdays[1] = {day: "Monday", time: ''};
      $scope.weekdays[2] = {day: "Tuesday", time: ''};
      $scope.weekdays[3] = {day: "Wednesday", time: ''};
      $scope.weekdays[4] = {day: "Thursday", time: ''};
      $scope.weekdays[5] = {day: "Friday", time: ''};
      $scope.weekdays[6] = {day: "Saturday", time: ''};

      _.map($scope.weekdays, function (curr) {
        curr.time = $scope.store[curr.day];
      });

    }

  }


})();
