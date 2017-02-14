(function() {
  'use strict';

  authService.$inject = ['restServer', 'utils', '$http', '$localStorage', '$rootScope', '$state', '$q', 'httpService', 'FB_APP_ID'];

  function authService(restServer, utils, $http, $localStorage, $rootScope, $state, $q, httpService, FB_APP_ID) {
    var authService = {
      login: login,
      isLoggedIn: isLoggedIn,
      register: register,
      update: update,
      getCurrentUser: getCurrentUser,
      logout: logout,
      getUserInfo: getUserInfo,
      resetPassword: resetPassword,
      changePassword: changePassword,
      loginWorkflow: loginWorkflow,
      facebookSignIn: facebookSignIn
    };
    return authService;

    function isLoggedIn() {
      if (!$localStorage.token)
        return false;
      return true;
    }

    function login(username, password, uri, cb) {
      var loginData = {
        u: username.replace(/^\s+|\s+$/gm, ''),
        p: password.replace(/^\s+|\s+$/gm, '')
      };

      $http.post(restServer + '/login', encodeURI('data=' + JSON.stringify(loginData)), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(response) {
        cb(response);
      }, function() {
        cb(false);
      });
    }

    function resetPassword(email, cb) {
      var loginData = {
        u: email.replace('/^\s+|\s+$/gm', '')
      };

      $http.post(restServer + '/reset_password', encodeURI('data=' + JSON.stringify(loginData)), {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function(response) {
          cb(response);
        }, function() {
          cb(false);
        });
    }

    function register(username, password, uri, cb) {
      var registerData = {
        u: username.trim(),
        p: password.trim()
      };

      $http.post(restServer + '/register', encodeURI('data=' + JSON.stringify(registerData)), {
          //transformRequest: angular.identity,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function(response) {
          cb(response);
        }, function() {
          cb(false);
        });
    }

    function update(userInfo, cb) {

      $http.post(restServer + '/update', encodeURI('data=' + JSON.stringify(userInfo)), {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function(response) {
          cb(response);
        }, function() {
          cb(false);
        });
    }

    function changePassword(passwordData, cb) {

      $http.post(restServer + '/change_password', encodeURI('data=' + JSON.stringify(passwordData)), {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function(response) {
          cb(response);
        }, function() {
          cb(false);
        });
    }

    function getUserInfo(cb) {
      //var formData = new FormData();

      $http.post(restServer + '/user_info', null, {
          //transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })
        .then(function(response) {
          if (response.data) {
            $localStorage.currentUser = response.data;
            $rootScope.currentUser = response.data;
          }
          cb(response);
        }, function() {
          cb(false);
        });
    }

    function getCurrentUser() {
      return angular.copy($localStorage.currentUser);
    }

    function logout() {

      delete $localStorage.currentUser;
      delete $localStorage.addon;
      delete $localStorage.token;
      utils.cleanOrder();
      $rootScope.$broadcast('countBasketPrice');
      $rootScope.$broadcast('logout');

    }

    function loginWorkflow() {
      getUserInfo(function(response) {
        if (!response)
          $state.go('tab.menu');

        var currUser = authService.getCurrentUser();
        if (currUser.firstName && currUser.lastName && (currUser.mobile || currUser.tel)) {
          $rootScope.$emit('login');
          if ($localStorage.order && $localStorage.order.cart && ($localStorage.order.cart.length > 0))
            $state.go('tab.basket');
          else
            $state.go('tab.store');
        } else
          $state.go('tab.profile');

      });
    }

    //This method is executed when the user press the "Login with facebook" button
    function facebookSignIn() {
      //here we add the data to DOM
      var w = 580;
      var h = 400;
      var left = (screen.width / 2) - (w / 2);
      var top = (screen.height / 2) - (h / 2);
      var url = "https://topspizza.co.uk/rest/fb";
      var fbWindow = window.open(url, "coonect", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
      fbWindow.focus();
      window.addEventListener('message', receiver);
    }

    function receiver(e) {

      if (!e.data.token)
        return;

      $localStorage.token = e.data.token;
      loginWorkflow();
    }

  }

  angular.module('app')
    .service('authService', authService);
})();
