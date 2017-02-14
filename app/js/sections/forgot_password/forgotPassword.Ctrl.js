(function () {
  'use strict';

  forgotPasswordCtrl.$inject = ['$scope', 'storeService', '$ionicLoading', '$state', '$ionicPopup', 'authService', '$ionicHistory'];
  function forgotPasswordCtrl($scope, storeService, $ionicLoading, $state, $ionicPopup, authService, $ionicHistory) {
    var vm = this;
    vm.email = '';

    vm.goBack = function () {
      $ionicHistory.goBack();
    };
    vm.forgotPassword = function () {
      if (vm.email) {
        authService.resetPassword(vm.email, function (result) {
          if (result && result.data && typeof result.data.error === 'undefined') {
            var alertPopup = $ionicPopup.alert({
              title: 'Forgot Password',
              template: 'We send an email with instructions.'
            });
            alertPopup.then(function (res) {
              return $state.go('tab.auth');
            });
          } else {
            $ionicPopup.alert({
              title: 'Forgot Password',
              template: 'No such user in system.'
            });
          }
        });
      }
    };
    vm.loginFacebook = function () {
      authService.facebookSignIn();
    };
  };
  angular
    .module('app')
    .controller('forgotPasswordCtrl', forgotPasswordCtrl);

})();
