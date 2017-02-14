(function() {
  'use strict';
  angular
    .module('app')
    .filter('orderTime', orderTime);
  orderTime.$inject = ['$filter'];
  function orderTime($filter) {
    return function(input) {
      return (!!input) ? moment(input).format('H:mm') : '';
    }
  }
})();
