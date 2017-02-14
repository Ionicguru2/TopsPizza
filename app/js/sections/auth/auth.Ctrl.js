(function() {
  'use strict';

  authCtrl.$inject = ['$scope', 'storeService', 'utils', '$state', 'authService', '$window', '$localStorage', 'alertService', '$ionicHistory'];

  function authCtrl($scope, storeService, utils, $state, authService, $window, $localStorage, alertService, $ionicHistory) {
    var vm = this;
    vm.username = '';
    vm.password = '';
    utils.loadingHide();

    vm.goBack = function() {
      $ionicHistory.goBack();
    };

    vm.loginFacebook = authService.facebookSignIn;



    vm.loginUser = loginUser;

    function loginUser() {

      if (!vm.username || !vm.password)
        return;

      authService.login(vm.username, vm.password, '/', function(res){

        if (!res || res.data.error || !res.data.token) {
          alertService.add(2, res.data.error ? res.data.error : res.data.Message);
          return;
        }
        $localStorage.token = res.data.token;
        $localStorage.email = vm.username;
        authService.loginWorkflow();
      });

    }

  }

  angular
    .module('app')
    .controller('authCtrl', authCtrl);
})();
