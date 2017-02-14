(function () {
  'use strict';

  historyCtrl.$inject = ['$scope', 'httpService', '$interval'];
  function historyCtrl($scope, httpService, $interval) {

    var vm = this;


    httpService.post('/order_history', null).then(function (result) {
      vm.history = result.data;
    });
  }

  myFilter.$inject = ['$filter'];
  function myFilter($filter) {
    return function (stringData, format) {

      return $filter('date')(new Date(stringData), format);
    }
  };


  angular
    .module('app')
    .controller('historyCtrl', historyCtrl)
    .filter('myFilter', myFilter);
})();
