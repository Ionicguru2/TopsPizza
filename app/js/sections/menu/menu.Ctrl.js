(function() {
    'use strict';



    menuCtrl.$inject = ['$scope', 'storeService', '$state', '$ionicPopup'];

    function menuCtrl($scope, storeService, $state, $ionicPopup) {

        var vm = this;

      vm.menuItems = [{"n": "Deals","h": "deals","s": 1,"t": "m"}, {"n": "Pizza", "h": "pizza", "a": 1, "t": "m"},
        {"n": "Sides", "h": "sides", "t": "m"}, {"n": "Desserts","h": "dessert","t": "m"},
        {"n": "Drinks", "h": "drink", "t": "m"}, {"n": "Dips", "h": "dips", "t": "m"}];

        vm.selectType = selectType;

        function selectType(type) {

            return 'tab.' + type;

        }

    }

    angular
        .module('app')
        .controller('menuCtrl', menuCtrl);

})();
