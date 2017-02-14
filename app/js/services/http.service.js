(function() {
  'use strict';

  httpService.$inject = ['$http', 'restServer', '$q'];

  function httpService($http, restServer, $q) {

    var httpService = {
      get: get,
      post:post,
      postNew:postNew
    };

    return httpService;

    function get(url, params) {
        var deferred = $q.defer();

        $http.get(restServer + url, params, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function(result) {

          if (!result.data) {
            result.data = {
              error: 'Unknown Error'
            };
            deferred.reject(result);

          } else
            deferred.resolve(result);


        }, function(error) {

          deferred.reject(error);
        });

        return deferred.promise;

      }

      function post(url, data) {
        var deferred = $q.defer();

        $http.post(restServer + url, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          //transformRequest: angular.identity,
          transformRequest: function(obj) {
            var str = [];
            for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          }
        }).then(function(result) {

          if (!result.data) {
            result.data = {
              error: 'Unknown Error'
            };
            deferred.reject(result);

          } else
            deferred.resolve(result);
        }, function(error) {
          deferred.reject('Error', error);
        });

        return deferred.promise;

      }

      function postNew(url, data, headers) {
        if(!headers)
          headers = [];
        /*
          this one is much shorter and it can send header & post using a simple jsonObject, so much better and shorter than the other one: Arash
        */
          var deferred = $q.defer();

          var config = {
              transformRequest: function(obj) {
                  var str = [];
                  for (var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              }
          };

          data = {
              data: JSON.stringify(data)
          };

          headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.headers = headers;
          $http.post(restServer + url, data, config).then(function(result){

              if (!result.data) {
                  result.data = {
                      error: 'Unknown Error'
                  };
                  deferred.reject(result);
              } else
                  deferred.resolve(result);
          }, function(error) {
            deferred.reject('Error', error);
          });

          return deferred.promise;

      }

  }
  angular
    .module('app')
    .service('httpService', httpService);
})();
