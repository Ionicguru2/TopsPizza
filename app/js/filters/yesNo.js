(function () {
    'use strict';

    angular
    .module('app')
    .filter('yesNo', yesNo);
    
     yesNo.$inject = ['$filter'];

    function yesNo($filter) {
        
        
        return function(input){
            
            return input ? 'Yes' : 'No';
            
        }
    
    }


})();