(function () {
    'use strict';

    angular
    .module('app')
    .filter('toObject', toObject);
    
     toObject.$inject = ['$filter'];

    function toObject($filter) {
        
        
        return function(input){
            
            var input  = input.sizes.split(',');
            return input;
            
        }
    
    }


})();