(function() {
  'use strict';
  utils.$inject = ['$localStorage', '$ionicLoading', 'alertService', 'httpService', '$state'];

  function utils($localStorage, $ionicLoading, alertService, httpService, $state) {

    var utils = {
      getWorkTime: getWorkTime,
      initOrder: initOrder,
      cleanOrder: cleanOrder,
      getOrderInfo: getOrderInfo,
      loadingShow: loadingShow,
      loadingHide: loadingHide,
      checkColseStore: checkColseStore,
      checkDate: checkDate,
      capitalizeFilter: capitalizeFilter,
      checkQtyFreeDeal: checkQtyFreeDeal,
      //submitOrder: submitOrder
    };
    return utils;

    function getWorkTime(store, d) {
      if (!d)
        d = new Date();
      var weekday = new Array(7),
        workTimes;
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      workTimes = store[weekday[d.getDay()]];
      if (workTimes)
        workTimes = workTimes.split(',');

      return {
        workTimes: workTimes,
        currHour: d.getHours(),
        currMin: d.getMinutes(),
        storeStartHours: +workTimes[0].split(':')[0],
        storeStartMins: +workTimes[0].split(':')[1],
        storeStopHours: +workTimes[1].split(':')[0],
        storeStopMins: +workTimes[1].split(':')[1]
      };
    }

    function initOrder() {
      if (!$localStorage.order)
        $localStorage.order = {
          store: {},
          info: {
            payment: {}
          },
          cart: []
        };
    }

    function cleanOrder() {
      if (!$localStorage.order)
        this.initOrder();
      $localStorage.order.cart = [];
      $localStorage.order.store = {};
      $localStorage.order.info = {
        payment: {}
      };
    }

    function getOrderInfo() {
      if (!$localStorage.orderInfo)
        $localStorage.orderInfo = {}
      return $localStorage.orderInfo;
    }

    function loadingShow() {
      $ionicLoading.show({
        template: '<ion-spinner class="spiral spinner-assertive"></ion-spinner>'
      });
    }

    function loadingHide() {
      $ionicLoading.hide();
    }

    function checkColseStore(store) {
      var currDate = new Date();
      currDate.setDate(currDate.getDate() - 1);

      if (this.checkDate(store, currDate).isopen)
        return true
      else {
        currDate.setDate(currDate.getDate() + 1);
        return this.checkDate(store, currDate).isopen;
      }
    }

    function checkDate(store, d) {
      var h = this.getWorkTime(store, d);
      h.currDate = new Date();

      h.startDate = new Date(new Date(d.getTime()).setHours(h.storeStartHours - 2, h.storeStartMins, 0));
      h.stopDate = new Date(new Date(d.getTime()).setHours(h.storeStopHours, h.storeStopMins, 0));
      if (h.stopDate < h.startDate)
        h.stopDate.setDate(h.stopDate.getDate() + 1);
      if ((h.currDate < h.stopDate) && (h.currDate > h.startDate))
        h.isopen = true;
      else h.isopen = false;
      return h;
    }

    function capitalizeFilter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function checkQtyFreeDeal() {
      var points = 0,
        qty = 0;
      if ($localStorage.currentUser && $localStorage.currentUser.loyality)
        points = $localStorage.currentUser.loyality.loyalty;
      if ($localStorage.order && $localStorage.order.cart.length > 0)
        _.map($localStorage.order.cart, function(items) {
          if (items.deal == "54")
            qty += 1;
        });
      if ((points - qty * 1000) / 1000 < 1) {
        alertService.add(2, "You can't add more deal for free!")
        return false;
      } else return true;
    }
    /*
    function submitOrder() {
      var order = JSON.parse(JSON.stringify($localStorage.order));

      _.map(order.cart, function(curr) {
        if (_.has(curr, 'id'))
          delete curr['id'];
        if (_.has(curr, 'name'))
          delete curr['name'];
        if (_.has(curr, 'price'))
          delete curr['price'];
        if (_.has(curr, 'isPizza'))
          delete curr['isPizza'];
        if (_.has(curr, 'size'))
          delete curr['size'];
        if (_.has(curr, 'TyID'))
          delete curr['TyID'];

        _.map(curr.items, function(items) {
          if (_.has(items, 'itemid'))
            delete items['itemid'];
          if (_.has(items, 'id'))
            delete items['id'];
          if (_.has(items, 'name'))
            delete items['name'];
          if (_.has(items, 'half'))
            delete items['half'];
          _.map(items.item, function(item) {
            if (_.has(item, 'type'))
              delete item['type'];
            if (_.has(item, 'id'))
              delete item['id'];
            if (_.has(item, 'name'))
              delete item['name'];
            if (_.has(item, 'addinfo'))
              delete item['addinfo'];
          });
        });
      });
      httpService.post('/check_order', {
        data: JSON.stringify(order)
      }).then(function(result) {
        if (result.data && !result.data.error) {
          httpService.post('/checkout', {
            data: JSON.stringify(order)
          }).then(function(result) {
            if (result.data && !result.data.error) {
              cleanOrder();
              $state.go('tab.tracker');
              return true;
            } else {
              alertService.add(2, result.data.error ? result.data.error : result.data.message);
              return false;
            }
          });
        } else {
          alertService.add(2, result.data.error ? result.data.error : result.data.message);
          return false;
        }

      });
    }*/
  }
  angular
    .module('app')
    .service('utils', utils);
})();
