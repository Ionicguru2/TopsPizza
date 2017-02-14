(function() {
  'use strict';

  logisticCtrl.$inject = ['$scope', 'storeService', '$state', 'restServer', 'httpService', 'timeService', 'alertService', '$localStorage', 'utils', '$ionicHistory', '$filter', '$ionicListDelegate', '$q', '$http'];

  function logisticCtrl($scope, storeService, $state, restServer, httpService, timeService, alertService, $localStorage, utils, $ionicHistory, $filter, $ionicListDelegate, $q, $http) {
    var vm = this;

    vm.addressList = [];
    vm.getTimes = [];
    vm.goBack = goBack;
    vm.changeNewAddress = changeNewAddress;
    vm.store = storeService.getCurrentStore();
    vm.order = $localStorage.order;
    vm.order.info.logistics = (vm.order.info.logistics) ? vm.order.info.logistics : 'delivery';
    vm.searchAddress = searchAddress;
    vm.refresh = refresh;
    vm.editAddress = editAddress;
    vm.saveAddress = saveAddress;
    refresh();

    function goBack() {
      var back = $ionicHistory.backView();
      if (!back || (back.stateName == 'tab.auth'))
        $state.go('tab.home');
      else
        $ionicHistory.goBack();
    }

    function changeNewAddress() {
      vm.firstAdd = true;
      vm.address = {};
      vm.address.location = 'Home';
      vm.address.address = vm.selectedPostAddress.address;
      vm.address.postcode = (vm.selectedPostAddress.postcode).toUpperCase();
      vm.saveAddress(vm.address);
    }

    function getTimes(method) {
      if (!vm.store) {
        $state.go('main.store');
        return;
      }
      var range = timeService.avilableTimes(vm.store, !method).range;
      if (range[0] && range[0].value)
        vm.order.info.when = range[0].value;
      return range;
    }

    function refresh() {
      if (vm.order.info.logistics === 'delivery') {
        vm.getTimes = getTimes(1);
        getAddress();
      } else {
        vm.getTimes = getTimes(0);
        delete vm.order.info.address;
      }
    }

    function getAddress() {
      httpService.post('/user_address', null).then(function(result) {
        if (!result.data || result.data.error)
          alertService.add(2, "Please enter delivery address first");
        var defaultAddress = _.findWhere(result.data, {
          defaultAddress: "1"
        });
        //HERE IS WHERE WE CHANGE DEFAULT ADDRESS
        if (!defaultAddress) {
          defaultAddress = result.data[0];
          defaultAddress.defaultAddress = "1";
        }
        if (vm.order.info.address) {
          var selectedExist = _.findWhere(result.data, {
            id: vm.order.info.address.id
          });
          if (!selectedExist)
            delete vm.order.info.address;
        }

        if (vm.order.info.address && defaultAddress.id !== vm.order.info.address.id) {
          defaultAddress.defaultAddress = "0";
          vm.order.info.address = _.findWhere(result.data, {
            id: vm.order.info.address.id
          });
          vm.order.info.address.defaultAddress = "1";
          httpService.post('/save_user_address', {
            data: JSON.stringify(angular.copy(vm.order.info.address))
          });
        } else
          vm.order.info.address = defaultAddress;
        vm.addressList = result.data;
      });
    }

    function searchAddress(postcode) {
      utils.loadingShow();
      vm.postAddressList = null;
      httpService.post('/postcodeToAddress', {
          data: '{"postcode":' + '"' + postcode + '"}'
        })
        .then(function(result) {
          if ((result.data.msg === true) || (result.data.Addresses)) {
            vm.postAddressList = [];
            for (var i = 0; i < result.data.Addresses.length; i++) {
              var addressList = result.data.Addresses[i].split(','),
                adrObj = {
                  id: i,
                  postcode: postcode
                };

              addressList = _.filter(_.compact(addressList), function(elem) {
                return elem != ' ';
              });
              adrObj.address = addressList.join(', ');
              vm.postAddressList.push(adrObj);
            }
            utils.loadingHide();
          } else {
            utils.loadingHide();
            alertService.add(2, result.data.error + ' : ' + result.data.Message);
          }
        });
    }

    function editAddress(address) {
      vm.address = address;
      vm.showAddressForm = !vm.showAddressForm;
    }

    function saveAddress(model, del) {
      if (del)
        model.hidden = '1';
      httpService.post('/save_user_address', {
        data: JSON.stringify(angular.copy(model))
      }).then(function(r) {
        if(r.data.error)
          alertService.add(2, r.data.error);
        refresh();
        vm.showAddressForm = false;
      });

    }

  }

  angular
    .module('app')
    .controller('logisticCtrl', logisticCtrl);
})();
