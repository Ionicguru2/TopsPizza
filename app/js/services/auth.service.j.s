(function () {
  'use strict';

  authService.$inject = ['restServer', '$http', '$q', '$localStorage', '$rootScope', '$state', 'utils', '$ionicPopup'];
  function authService(restServer, $http, $q, $localStorage, $rootScope, $state, utils, $ionicPopup) {
    var authService = {
      login: login,
      isLoggedIn: isLoggedIn,
      register: register,
      update: update,
      loginFB: loginFB,
      getCurrentUser: getCurrentUser,
      logout: logout,
      getUserInfo: getUserInfo,
      resetPassword: resetPassword,
      checkAccess: checkAccess,
      changePassword: changePassword,
      loginWorkflow: loginWorkflow,
      facebookSignIn: facebookSignIn
    };
    return authService;

    function isLoggedIn() {
      //if you have "$localStorage" why use $window ?
      //var token = $localStorage.token;
      console.log('isLoggedIn():Check for local storage token = '+ $localStorage.token);
      if ($localStorage.token) {
        return true;
      }
      return false;
    }

    function checkAccess(data) {
      console.log('checkAccess func data = '+JSON.stringify(data));
      if (typeof data.authenticate !== 'undefined' && data.authenticate === true) {
        if (isLoggedIn()) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function login(username, password, uri, cb) {
      var loginData = {
        u: username.trim(),
        p: password.trim()
      };
      /*,
       formData = new FormData();
       formData.append('data', JSON.stringify(loginData));*/
      $http.post(restServer + '/login', encodeURI('data=' + JSON.stringify(loginData)), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function (response) {
          cb(response);
        }, function () {
          cb(false);
        });
    }

    function resetPassword(email, cb) {
      var loginData = {
        u: email.trim()
      };
      /*,
       formData = new FormData();
       formData.append('data', JSON.stringify(loginData));*/

      $http.post(restServer + '/reset_password', encodeURI('data=' + JSON.stringify(loginData)), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function (response) {
          cb(response);
        }, function () {
          cb(false);
        });
    }

    function register(username, password, uri, cb) {
      var registerData = {
        u: username.trim(),
        p: password.trim()
      };
      /*,
       formData = new FormData();
       formData.append('data', JSON.stringify(registerData));*/
      $http.post(restServer + '/register', encodeURI('data=' + JSON.stringify(registerData)), {
        //transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function (response) {
          cb(response);
        }, function () {
          cb(false);
        });
    }


    function update(userInfo, cb) {
      /* var formData = new FormData();
       formData.append('data', JSON.stringify(userInfo));*/
      $http.post(restServer + '/update', encodeURI('data=' + JSON.stringify(userInfo)), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function (response) {
          cb(response);
        }, function () {
          cb(false);
        });
    }

    function changePassword(passwordData, cb) {

      $http.post(restServer + '/change_password', encodeURI('data='+JSON.stringify(passwordData)), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function (response) {
          cb(response);
        }, function () {
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
        .then(function (response) {
          if (response.data) {
            $rootScope.currentUser = response.data;
            $localStorage.currentUser = response.data;
          }
          cb(response);
        }, function () {
          cb(false);
        });
    }

    function loginFB(access_token, cb) {
      //var formData = new FormData();
      $http.post(restServer + '/facebook', null, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'access_token': access_token
        }
      })
        .then(function (response) {
          if (response.data) {
            // $rootScope.currentUser = response.data;
            // $localStorage.currentUser = response.data;
          }
          cb(response);
        }, function () {
          cb(false);
        });
    }

    function getCurrentUser() {
      return angular.copy($localStorage.currentUser);
    }

    function logout() {
      //$window.localStorage.removeItem('token');
      if ($localStorage.token)
        delete $localStorage['token'];
      return true;
    }

    function loginWorkflow() {
      getUserInfo( function () {
        var currUser = authService.getCurrentUser();
        if (currUser.firstName && currUser.lastName && currUser.mobile && currUser.tel) {
          if ($localStorage.order && $localStorage.order.cart && ($localStorage.order.cart.length > 0))
            $state.go('tab.logistic');
          else
            $state.go('tab.home');
        } else
          $state.go('tab.profile');

      });
    }

    function saveFbLogin(authResponse) {
      console.log('---------------saveFbLogin func-------');
      if (authResponse.accessToken) {
        console.log('GOOD: AccessToken have = '+authResponse.accessToken+'\n Sending data to our server!');
        loginFB(authResponse.accessToken, function (result) {
          console.log('Data going to server \n Result data is -- '+JSON.stringify(result));
          if (result && result.data && !result.data.error) {
            console.log('COOL: we have token from server = '+ result.data.token);
            $localStorage.token = result.data.token;
            console.log('Now getting from  getFacebookProfileInfo()');
            getFacebookProfileInfo(authResponse)
              .then(function (profileInfo) {
                console.log('We get info from FB = '+ JSON.stringify(profileInfo));
                // For the purpose of this example I will store user data on local storage
                $localStorage.email = profileInfo.email;
                utils.loadingHide();
                //$state.go('tab.home');
              }, function (fail) {
                // Fail get profile info

                console.log('profile info fail = ' + fail);
              });
            loginWorkflow();
          } else {
            console.log('BAD: something wrong.\n Result data is -- '+JSON.stringify(result));
            $ionicPopup.alert({
              title: 'Cant send token',
              template: 'Token is not saving at server'
            });
          }
        });

      } else
      console.log('BAD: We dont have accessToken. authResponse = '+authResponse);
    }

    // This is the success callback from the login method
    function fbLoginSuccess(response) {
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }
      console.log('response = ' + JSON.stringify(response));

      var authResponse = response.authResponse;
      saveFbLogin(authResponse);
    }

    // This is the fail callback from the login method
    function fbLoginError(error) {
      console.log('fbLoginError = '+ error);
      utils.loadingHide();
    }

    // This method is to get the user profile info from the facebook api
    function getFacebookProfileInfo(authResponse) {
      var info = $q.defer();
      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          console.log('getFacebookProfileInfo respnse = ' + response);
          info.resolve(response);
        },
        function (response) {
          console.log('ERROR: getFacebookProfileInfo respnse = ' + response);
          info.reject(response);
        }
      );
      return info.promise;
    }

    //This method is executed when the user press the "Login with facebook" button
    function facebookSignIn() {
      facebookConnectPlugin.getLoginStatus(function (success) {
        if (success.status === 'connected') {
          // The user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('getLoginStatus = '+ success.status);
          saveFbLogin(success.authResponse);
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.
          console.log('getLoginStatus = '+ success.status);
          utils.loadingShow();
          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    }
  }

  angular.module('app')
    .service('authService', authService);
})();
