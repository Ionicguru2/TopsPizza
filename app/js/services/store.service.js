//topspizza.co.uk/rest/doc/

(function() {
  'use strict';


  storeService.$inject = ['$http', 'restServer', '$sessionStorage', '$q'];

  function storeService($http, restServer, $sessionStorage, $q) {
    var storeService = {
      getCurrentInfo: getCurrentInfo,
      getCurrentStore: getCurrentStore,
      setCurrentStore: setCurrentStore,
      getAllStores: getAllStores,
      findStores: findStores,
      getStoreMenu: getStoreMenu,
      getToppings: getToppings,
      //getDeals: getDeals,
      //getCurrentDeal: getCurrentDeal,
      //setCurrentDeal: setCurrentDeal,
      getProductById: getProductById,
      getProducts: getProducts, //in use
      //getAllNavigations: getAllNavigations, //in use
      tget: tget
    };

    return storeService;

    function getCurrentStore() {
      return angular.copy($sessionStorage.currentStore);
    }

    function setCurrentStore(store) {
      $sessionStorage.currentStore = store;
      storeService.getStoreMenu(store.id);
    }

    function getAllStores() {
      return $http.get(restServer + '/stores')
        .success(function(data, status, headers, config) {
          return data;
        })
        .error(function(data, status, headers, config) {
          console.log('getAllStores error');
        });
    }
    /*
    function findStoreById(storeId) {
        return $http.get(restServer + '/stores' + storeId)
            .success(function (data, status, headers, config) {
                console.log('findStoreById(' + storeId + ')');
                console.log(data);
            })
            .error(function (data, status, headers, config) {
                console.log('findStoreById error(' + storeId + ')');
                console.log(data);
            });
    }*/

    function getCurrentInfo() {
      var deferred = $q.defer();
      $http.get(restServer + '/locator/')
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.resolve();
        });
      return deferred.promise;
    }

    function findStores(storeName) {
      var deferred = $q.defer();
      storeName = storeName.toLowerCase();
      $http.get(restServer + '/locator/' + storeName)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log('findStores(' + storeName + ') error');
          console.log(data);
          deferred.resolve(false);
        });
      return deferred.promise;
    }

    function getStoreMenu(storeId) {
      var deferred = $q.defer();
      if (storeId !== undefined) {
        var menu = {
          pizzas: [],
          drinks: [],
          sides: [],
          dips: [],
          desserts: [],
          products: []
        };
        $http.get(restServer + '/menu/' + storeId)
          .success(function(data, status, headers, config) {
            //data, sizeprice
            _.map(data, function(item, k) {
              var prices = item.prices.split(','),
                sizes = item.sizes.split(',');
              item.sizeprice = [];
              item.sizes = [];
              _.map(sizes, function(size, k) {
                item.sizeprice[k] = {
                  size: size,
                  price: parseFloat(prices[k]),
                  sizeName: (size === 'none') ? '£' + prices[k] : size + ' £' + prices[k]
                };
                item.sizes.push(size);
              });
              menu.products.push(item);
              switch (item.category) {
                case 'pizza':
                  menu.pizzas.push(item);
                  break;
                case 'drink':
                case 'alcoholic drink':
                  menu.drinks.push(item);
                  break;
                case 'classic sides':
                case 'toptastic sides':
                case 'chicken sides':
                  menu.sides.push(item);
                  break;
                case 'dips':
                  menu.dips.push(item);
                  break;
                case 'dessert':
                case 'ice cream':
                  menu.desserts.push(item);
                  break;
              }
            });

            var halfHalfPizza = {
              id: '0',
              name: 'Half & Half',
              description: 'Create your own half & half pizza',
              image: 'halfNhalf.jpg',
              sizes: menu.pizzas[2].sizes,
              prices: menu.pizzas[2].prices,
              sizeprice: menu.pizzas[2].sizeprice
            };
            menu.pizzas.push(halfHalfPizza);
            menu.products.push(halfHalfPizza);
            $sessionStorage.menu = menu;
            deferred.resolve(angular.copy($sessionStorage.menu));
          })
          .error(function(data, status, headers, config) {
            deferred.resolve(menu);
          });
      } else {
        deferred.resolve(angular.copy($sessionStorage.menu));
      }
      return deferred.promise;
    }

    function getCurrentDeal() {
      return angular.copy($sessionStorage.currentDeal);
    }

    function setCurrentDeal(deal) {
      $sessionStorage.currentDeal = angular.copy(deal);
    }

    function getDealsAvailableByDay(deals) {
      var toDay = (new Date()).getDay() - 1,
        dealsAvailable = [];
      if (toDay < 0) toDay = 6;

      for (var i = 0; i < deals.length; i++)
        if (deals[i].valid_days.split('')[toDay] == 1) {
          dealsAvailable.push(deals[i]);
        }

      return dealsAvailable;
    }

    function getProductById(productId) {
      var deferred = $q.defer();
      if (productId !== undefined) {
        if ($sessionStorage.getProductByIdResult !== undefined && $sessionStorage.getProductByIdResult.id == productId)
          deferred.resolve(angular.copy($sessionStorage.getProductByIdResult));
        else
          $http.get(restServer + '/product/' + productId)
          .success(function(data, status, headers, config) {
            console.log('getProductById(' + productId + ')');
            console.log(data);
            $sessionStorage.getProductByIdResult = data;
            deferred.resolve(angular.copy($sessionStorage.getProductByIdResult));
          })
          .error(function(data, status, headers, config) {
            console.log('getProductById(' + productId + ') error');
            console.log(data);
            deferred.resolve(undefined);
          });
      } else
        deferred.resolve(undefined);
      return deferred.promise;
    }

    function getAllNavigations() {
      return $http.get(restServer + '/nav')
        .success(function(data, status, headers, config) {
          console.log('getAllNavigations');
          console.log(data);
        })
        .error(function(data, status, headers, config) {
          console.log('getAllNavigations error');
          console.log(data);
        });
    }

    function getProducts(store_id) {

      return $http.get(restServer + '/menu/' + store_id).error(function(data, status, headers, config) {
        console.log('getProducts error');
      });
    }


    function getToppings(storeId) {
      var deferred = $q.defer();
      if (!storeId)
        deferred.resolve(angular.copy($sessionStorage.toppings));
      else
        $http.get(restServer + '/toppings/' + storeId)
        .success(function(data, status, headers, config) {
          $sessionStorage.toppings = data;
          deferred.resolve(angular.copy($sessionStorage.toppings));
        })
        .error(function(data, status, headers, config) {
          $sessionStorage.toppings = [];
          deferred.resolve(angular.copy($sessionStorage.toppings));
        });
      return deferred.promise;
    }

    function tget(what, store_id) {
      var deferred = $q.defer();
      $http.get(restServer + '/' + what + '/' + store_id)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        //return error if something went wrong
        .error(function(data, status, headers, config) {
          console.log('error: getting ' + what);
        });
      return deferred.promise;

    }


  }


  angular
    .module('app')
    .service('storeService', storeService);

})
();
