(function () {
  'use strict';
  angular.module('app', ['ionic','ngStorage', 'ngCordova', 'credit-cards', 'ionicLazyLoad'])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider'];

  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    /*      try {
     PackageInfo info =
     cordova.getActivity().getPackageManager().getPackageInfo("com.goapes.golearn", PackageManager.GET_SIGNATURES);

     for (Signature signature : info.signatures) {
     MessageDigest md = MessageDigest.getInstance("SHA");
     md.update(signature.toByteArray());
     Log.e("MY KEY HASH:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
     }

     } catch (NameNotFoundException e) {

     } catch (NoSuchAlgorithmException e) {

     }*/


    $httpProvider.interceptors.push([
      '$localStorage',
      function ($localStorage) {
        return {
          request: function (config) {
            config.headers['Authorization'] = $localStorage.token;
            return config;
          },
          response: function (response) {
            return response;
          }
        };
      }
    ]);

    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $stateProvider
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'js/sections/nav/tabs.html',
        controller: 'tabCtrl as vm'
      })
      // Each tab has its own nav history stack:
      .state('tab.locator', {
        url: '/locator',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/locator/locator.html',
            controller: 'locatorCtrl as vm'
          }
        },
        data: {
          authenticate: false
        },
        hideTabs: true

      })
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'js/sections/home/home.html',
            controller: 'homeCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.menu', {
        url: '/menu',
        views: {
          'tab-menu': {
            templateUrl: 'js/sections/menu/menu.html',
            controller: 'menuCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.deals', {
        url: '/deals',
        views: {
          'tab-deals': {
            templateUrl: 'js/sections/deals/deals.html',
            controller: 'dealsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.deal', {
        url: '/deal',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/deal/deal.html',
            controller: 'dealCtrl as vm'
          }
        },
        params: {
          id: null,
          name: null,
          description: null,
          logistic: null,
          price: null,
          valid_days: null,
          item_id: null,
          item_size: null,
          item_type: null,
          featured: null,
          presets: null
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.more', {
        url: '/more',
        views: {
          'tab-more': {
            templateUrl: 'js/sections/more/more.html',
            controller: 'moreCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.loyalty', {
        url: '/loyalty',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/loyalty/loyalty.html',
            controller: 'loyaltyCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.stores', {
        url: '/stores',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/stores/stores.html',
            controller: 'storesCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })


      .state('tab.product', {
        url: '/product',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/product/product.html',
            controller: 'productCtrl as vm'
          }
        },
        params: {
          id: null,
          name: null,
          image: null,
          description: null,
          features: null,
          TyID: null,
          category: null,
          alcohol: null,
          sizes: null,
          prices: null,
          IIDs: null,
          presets: null
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.halfNhalf', {
        url: '/halfNhalf',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/halfNhalf/halfNhalf.html',
            controller: 'halfNhalfCtrl as vm'
          }
        },
        params: {
          presets: null
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.pizza', {
        url: '/pizza',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/products/products.html',
            controller: 'productsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.sides', {
        url: '/sides',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/products/products.html',
            controller: 'productsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.drink', {
        url: '/drinks',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/products/products.html',
            controller: 'productsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.dessert', {
        url: '/dessert',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/products/products.html',
            controller: 'productsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })


      .state('tab.dips', {
        url: '/dips',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/products/products.html',
            controller: 'productsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })


      .state('tab.privacy', {
        url: '/privacy',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/legals/privacy.html',
            controller: 'productsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.terms', {
        url: '/terms',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/legals/terms.html',
            controller: 'legalsCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })
      .state('tab.history', {
       url: '/history',
        views:{
          'tab-hidden':{
            templateUrl:'js/sections/history/history.html',
            controller:'historyCtrl as vm'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.auth', {
        url: '/auth',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/auth/auth.html',
            controller: 'authCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.forgotPassword', {
        url: '/forgotPassword',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/forgot_password/forgot_password.html',
            controller: 'forgotPasswordCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.sigUp', {
        url: '/signUp',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/register/register.html',
            controller: 'registerCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.profile', {
        url: '/profile',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/profile/profile.html',
            controller: 'profileCtrl as vm'
          }
        },
        data: {
          authenticate: true
        }
      })
      .state('tab.chane_password', {
        url: '/changePassword',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/change_password/change_password.html',
            controller: 'changePasswordCtrl as vm'
          }
        },
        data: {
          authenticate: true
        }
      })

      .state('tab.basket', {
        url: '/basket',
        views: {
          'tab-basket': {
            templateUrl: 'js/sections/basket/basket.html',
            controller: 'basketCtrl as vm'
          }
        },
        data: {
          authenticate: false
        }
      })

      .state('tab.logistic', {
        url: '/logistic',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/logistic/logistic.html',
            controller: 'logisticCtrl as vm'
          }
        },
        data: {
          authenticate: true
        },
        hideTabs: true
      })

      .state('tab.checkout', {
        url: '/checkout',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/checkout/checkout.html',
            controller: 'checkoutCtrl as vm'
          }
        },
        data: {
          authenticate: true
        },
        hideTabs: true
      })


      .state('tab.payment', {
        url: '/payment',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/payment/payment.html',
            controller: 'paymentCtrl as vm'
          }
        },
        data: {
          authenticate: true
        },
        hideTabs: true
      })

      .state('tab.failed', {
        url: '/failed',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/failed/failed.html',
            controller: 'failedCtrl as vm'
          }
        },
        data: {
          authenticate: true
        },
        hideTabs: false
      })

      .state('tab.tracker', {
        url: '/tracker',
        views: {
          'tab-hidden': {
            templateUrl: 'js/sections/tracker/tracker.html',
            controller: 'trackerCtrl as vm'
          }
        },
        data: {
          authenticate: true
        },
        hideTabs: false
      })

    ;

    $urlRouterProvider.otherwise('tab/locator');

  }


})();
