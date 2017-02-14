(function() {
    'use strict';

    moreCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup', 'authService'];

    function moreCtrl($scope, storeService, $state, $ionicPopup, authService) {

        var store = storeService.getCurrentStore();
        var vm = this;
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        vm.isLoggedIn = authService.isLoggedIn();

        vm.logout = function() {
            authService.logout();
            return $state.go('tab.auth');
        }
    }

    angular
        .module('app')
        .controller('moreCtrl', moreCtrl);
})();
