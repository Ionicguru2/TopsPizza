(function () {
  'use strict';

  trackerCtrl.$inject = ['$scope', 'httpService', '$interval', '$state'];
  function trackerCtrl($scope, httpService, $interval, $state) {

    var vm = this;
    vm.goBack = goBack;
    checkTracking();

      function checkTracking () {
      httpService.post('/tracker', null).then(function (result) {
        if (result.data)
          vm.message = result.data.msg;
        else
          vm.message = "Can't get data about you order now....";
      });
    };

    vm.updateTraning = $interval(checkTracking, 1000*5*60);

    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      $interval.cancel(vm.updateTraning);
    });

    function goBack() {
        $state.go('tab.menu');
    };
  }

  angular
    .module('app')
    .controller('trackerCtrl', trackerCtrl);
})();
