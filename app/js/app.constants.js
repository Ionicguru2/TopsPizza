(function () {
    'use strict';
    angular
        .module('app')
        .constant('restServer', 'https://topspizza.co.uk/rest')
        .constant('FB_APP_ID', '472146392945808')
        .constant('currentTime', new Date())
        .constant('qty', [1,2,3,4,5,6,7,8,9])
        .constant('_errors', {
          ccName :"Please enter your name",
          ccNumber : "Please enter a valid credit card number",
          cvcNumber:"Please enter the 3-digit security code in the back of your card",
          ccExpiration : "Please enter your card expiration date"
        })
        .constant('config', {
          //unless its already on it, pizza can only have this many toppings
          "maxToppingChange": 7,
          //by default they get 2 free swaps/ replacment (not changes)
          "swaps": 2,
          /*
           # IF ITS A DEAL,
           # ITS NOT HALF AND HALF
           # AND THE PIZZA IS MARGHARITA THEY GET 4 FREE TOPPINGS
           # IF ITS LUNCH TIME & is_margherita DEAL THEY GET 3 FREE CHANGES */
          "margheritaDealChanges": 4,
          "margheritaLunchtimeChanges": 3,
          "margheritaID": '1',
          "noneSauceID": '48',
          "noneCheeseID": '47',
          "classicBase": "36",
          "smallsize": "small",
          "hNhID": "halfNhalf"
        });
})();
