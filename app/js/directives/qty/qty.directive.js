(function() {
    'use strict';
    angular
        .module('app')
        .directive('qty', qty);

    qty.$inject = ['$state'];

    function qty($state) {

        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'js/directives/qty/qty.html',//?' + Math.floor((Math.random() * 1000000000000) + 1),
            scope: {
                "id": "=",
                "name": "=",
                "value": "=",
                "dis":"="
            }
        };

    }

})();
