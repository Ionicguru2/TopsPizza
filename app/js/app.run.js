(function() {
  'use strict';
  angular.module('app')
    .run(run);
  run.$inject = ['$ionicPlatform', '$state', '$rootScope', 'authService', 'utils', 'alertService', 'storeService'];
  function run($ionicPlatform, $state, $rootScope, authService, utils, alertService, storeService) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      $rootScope.hideTabs = (toState.hideTabs) ? 'tabs-item-hide' : '';
      if ((toState.name != 'tab.locator') && (toState.name != 'tab.stores')) {
        var store = storeService.getCurrentStore();
        if (!store || store.active != 1) {
          event.preventDefault();
          $state.go('tab.locator');
        }
      }
      if (toState.data.authenticate && !authService.isLoggedIn()) {
        event.preventDefault();
        $state.go('tab.auth');
      }
    }
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (toState.resolve) {
        utils.loadingHide();
      }
    });
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        $rootScope.offlineState = networkState;
        $rootScope.noInet = true;
        alertService.showAlert('', "Unable to connect with the server. check your internet connection and try again!").then(function(res) {
          if (res && ionic.Platform.isAndroid())
              navigator.app.exitApp();
        });
      });

    });

  }

})();
