(function () {
    'use strict';

    angular
    .module('app')
    .filter('openingTime', openingTime);
    
     openingTime.$inject = ['$filter'];

    function openingTime($filter) {
        
        
        return function(input){
            
            var currentTime = new Date();
            var currentDay = $filter('date')(new Date(), 'EEEE');
            
            return input[currentDay];
            //check the current time to see if the store is open or closed!
            
        }
    
    }


})();