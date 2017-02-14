(function() {
  'use strict';

  profileCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup', 'authService', '$filter', 'alertService', '$ionicHistory'];

  function profileCtrl($scope, storeService, $state, $ionicPopup, authService, $filter, alertService, $ionicHistory) {
    var vm = this;

    vm.store = storeService.getCurrentStore();
    vm.user = {};
    vm.user.firstName = '';
    vm.user.lastName = '';
    vm.user.dob = '';
    vm.user.tel = '';
    vm.user.mobile = '';
    vm.title = 'Account';
    vm.BirthDate = '';

    vm.goBack = function() {
      $ionicHistory.goBack();
    };

    vm.update = function() {
      if (vm.user.dob)
        vm.user.dob = $filter('date')(vm.BirthDate, 'yyyy-MM-dd');
      authService.update(vm.user, function(response) {
        if (response && response.data && typeof response.data.error === 'undefined') {
          alertService.add(2, 'User Profile: Profile was updated.');
        } else {
          alertService.add(2, result.data.error ? 'User Profile:' + result.data.error : 'User Profile:' + result.data.Message);
        }
      });
    };

    vm.getUserInfo = function() {
      authService.getUserInfo(function(response) {
        if (response && response.data && typeof response.data.error === 'undefined') {
          vm.user.firstName = response.data.firstName;
          vm.user.lastName = response.data.lastName;
          vm.user.dob = response.data.dob;
          vm.BirthDate = new Date(response.data.dob);
          vm.user.tel = response.data.tel;
          vm.user.mobile = response.data.mobile;
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'User Profile',
            template: 'User was not found.'
          });
          alertPopup.then(function() {
            return $state.go('tab.auth');
          });
        }
      });
    };
    vm.getUserInfo();

  };

  angular
    .module('app')
    .controller('profileCtrl', profileCtrl);

})();
