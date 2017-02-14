/*
Options : [text,email,tel,search,number,date,month,password]
*/

(function() {
    'use strict';
    angular
        .module('app')
        .directive('ionInput', ionInput);

    ionInput.$inject = ['$state'];

    function ionInput($state) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/directives/ion-input/ion-input.html',//?1' + Math.floor((Math.random() * 1000000000000) + 1),
            scope: {
                "id": "@",
                "name": "@",
                "value": "=",
                "type": "@",
                "placeholder":"@",
                "icon":"@",
                "removelable":"@",
                "intro":"@",
                "model":"="
            }
        };

    }

})();
