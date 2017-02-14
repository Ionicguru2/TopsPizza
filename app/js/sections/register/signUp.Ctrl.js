(function () {
  'use strict';

  registerCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup', 'authService', '$localStorage', '$ionicHistory'];
  function registerCtrl($scope, storeService, $state, $ionicPopup, authService, $localStorage, $ionicHistory) {
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.confirm_password = '';
    vm.error_message = false;


    vm.goBack = function () {
      $ionicHistory.goBack();
    };

    vm.register = function () {
      if (!vm.username && !vm.password && !vm.confirm_password) {
        return false;
      }
      if (vm.password !== vm.confirm_password) {
        vm.error_message = 'Confirm Password should be repeated exactly.';
        return false;
      }
      return authService.register(vm.username, vm.password, '/', function (result) {
        if (result && result.data && !result.data.error) {
          var alertPopup = $ionicPopup.alert({
            title: 'User Register',
            template: 'user was successfully created.'
          });
          alertPopup.then(function () {
            if (result.data.token) {
              $localStorage.token = result.data.token;
              $localStorage.email = vm.username;
            }
            authService.loginWorkflow();
            //return $state.go('tab.auth');
          });
        } else {
          $ionicPopup.alert({
            title: 'User Register',
            template: 'User was not created.'
          });
        }
      });
    };
    vm.checkConfirmPassword = function () {
      if (vm.password !== vm.confirm_password) {
        vm.error_message = 'Confirm Password should be repeated exactly.';
      } else {
        vm.error_message = false;
      }
    };
    vm.loginFacebook = function () {
      authService.facebookSignIn();
    };
  };
  angular
    .module('app')
    .controller('registerCtrl', registerCtrl);

})();
