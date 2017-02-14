(function() {
  'use strict';

  alertService.$inject = ['$ionicPopup'];

  function alertService(ionicPopup) {

    var alertService = {
      add: add,
      check: check,
      addAlerts: addAlerts
    };
    return alertService;

    function add(type, msg, msgParam) {
      //this.addFull(type, '', msg, msgParam);
      ionicPopup.alert({
        title: msg,
        template: msgParam
      });
    }

    function check(data) {
      if ((data) && (data.alerts))
        alertService.addAlerts(data.alerts);
    }

    function addAlerts(alerts, msgParam) {
      if (!alerts)
        return;
      for (var i in alerts)
        this.add(alerts[i].type, alerts[i].msg, msgParam);
    }

  }

  angular
    .module('app')
    .service('alertService', alertService);
})();
