(function () {
    'use strict';

    angular
    .module('app')
    .filter('basePrice', basePrice);

     basePrice.$inject = ['$filter'];

    function basePrice($filter) {


        return function(input){

            var size  = input.sizes.split(',');
            var price = input.prices.split(',')
            .map(function(item) {
                return parseFloat(item);
            });

            var result = combine2Object(size, price);
            var keysbyindex = Object.keys(result);
           if (input.category == 'pizza')
            return '£' + result.medium.toFixed(2);
          else
             return '£' + result[keysbyindex[0]].toFixed(2);

            function combine2Object(size, price) {
              var result = {};

              for (var i = 0; i < price.length; ++i)
                result[ size[i] ] = price[i];

              return result;

            }

        }

    }


})();
