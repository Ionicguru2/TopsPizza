(function () {
    'use strict';

    angular
    .module('app')
    .filter('capitalize', capitalize);
    
    
     capitalize.$inject = ['$filter'];

    function capitalize($filter) {
        
        
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    
    }


})();