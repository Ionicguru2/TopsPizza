(function() {
  'use strict';

  paymentCtrl.$inject = ['$scope', 'storeService', 'authService', '$localStorage', '$ionicHistory', 'basketService', 'alertService', '_errors', '$ionicModal', '$state', '$rootScope'];

  function paymentCtrl($scope, storeService, authService, $localStorage, $ionicHistory, basketService, alertService, _errors, $ionicModal, $state, $rootScope) {

    var vm = this;
    vm.store = storeService.getCurrentStore();
    vm.isLoggedIn = authService.isLoggedIn();
    vm.goBack = $ionicHistory.goBack;
    vm.order = $localStorage.order;
    vm.user = $localStorage.currentUser;
    vm.monthsAndYears = monthAndYear();
    vm.monthes = vm.monthsAndYears.months;
    vm.years = vm.monthsAndYears.years;
    vm.card = {
      name: vm.user.firstName + ' ' + vm.user.lastName
    };
    vm.validate = {};
    vm.total = basketService.getTotal();
    vm.submitOrder = submitOrder;
    //name, number, month, year, cvc
    function submitOrder() {
      vm.validate = {
        name: _.isString(vm.card.name) && vm.card.name !== '',
        number: _.isNumber(vm.card.number) && vm.card.number !== '',
        cvc: _.isNumber(vm.card.cvc) && vm.card.cvc !== '',
        exp_month: _.isString(vm.card.exp_month) && vm.card.exp_month !== '',
        exp_year: _.isString(vm.card.exp_year) && vm.card.exp_year !== '',
        error: false
      };
      if (!vm.validate.name)
        vm.validate.error = _errors.ccName;
      if (!vm.validate.number)
        vm.validate.error = _errors.ccNumber;
      if (!vm.validate.cvc)
        vm.validate.error = _errors.cvcNumber;
      if (!vm.validate.exp_month || !vm.validate.exp_year)
        vm.validate.error = _errors.ccExpiration;
      if (vm.validate.error) {
        alertService.add(2, vm.validate.error);
        return false;
      }

      vm.order.info.payment = vm.card;
      vm.disabled = true;
      basketService.submitOrder(vm.card).then(function(result) {
        if ((typeof(result) == 'object') && (result.data && !result.data.error)) {
          /* IF sucessful and is cash payment*/
          if (typeof result.data.order_no === 'number') {
            $state.go('tab.tracker');
          } else if (result.data.PaReq && result.data.PaReq.length >= 100) {
            /* IF sucessful and is CARD payment */
            $ionicModal.fromTemplateUrl('js/sections/3dsecure/3dsecure.html', {
              scope: $scope,
              animation: 'slide-in-up',
            }).then(function(modal) {
              $scope.modal = modal;
              window.data = result.data;
              var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
              var eventer = window[eventMethod];
              var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
              // Listen to message from child window
              eventer(messageEvent, function(e) {
                //order ID
                modal.remove();
                if (e.data === 'external' || e.data === 'internal') {
                  vm.disabled = false;
                  $state.go('tab.failed', {
                    msg: e.data
                  });
                } else {
                  $rootScope.$broadcast('countBasketPrice');
                  $rootScope.$broadcast('checkoOut');
                  $state.go('tab.tracker');
                }
              }, false);
              modal.show();
            });

          } else {
            alertService.add(2, 'error 4: We couldn\'t place your order at this time please contact your store');
            vm.disabled = false;
          }

        } else if (result.data.error) {
          alertService.add(2, result.data.error);
          vm.disabled = false;
        } else {
          alertService.add(2, 'error 5: We couldn\'t place your order at this time please contact your store');
          vm.disabled = false;
        }
      }, function(error) {
        alertService.add(2, error);
        vm.disabled = false;
      });
    }

    function monthAndYear() {
      var d = new Date();
      var m = d.getMonth() + 1;
      var y = d.getFullYear();
      var years = {};
      var current = {
        'exp_year': ("0" + y).slice(-2),
        'exp_month': ("0" + m).slice(-2)
      };
      var months = {
        'Jan (01)': '01',
        'Feb (02)': '02',
        'Mar (03)': '03',
        'Apr (04)': '04',
        'May (05)': '05',
        'June (06)': '06',
        'July (07)': '07',
        'Aug (08)': '08',
        'Sep (09)': '09',
        'Oct (10)': '10',
        'Nov (11)': '11',
        'Dec (12)': '12'
      };

      for (var i = 0; i < 10; i++) {
        if (i)
          y = y + 1;
        years[y] = ("0" + y).slice(-2);
      }
      return {
        'years': years,
        'months': months,
        'current': current
      };
    }
  }

  angular
    .module('app')
    .controller('paymentCtrl', paymentCtrl);
})();
