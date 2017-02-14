(function () {
    'use strict';
    angular
        .module('app')
        .directive('tribox', tribox)

   tribox.$inject = ['$state'];

    function tribox($state) {

		return {
			restrict: 'E',
			replace: 'true',
			templateUrl: 'js/directives/tribox/tribox.html',//?'+Math.floor((Math.random() * 1000000000000) + 1),
			scope:{
          "topping":"=",
          "changeQty":"="
			}
		};

    }

})();
