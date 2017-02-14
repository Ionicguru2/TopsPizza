(function () {
    'use strict';
    angular
        .module('app')
        .directive('dealEngine', dealEngine)
        .controller("dealEngineCtrl", dealEngineCtrl);

    dealEngine.$inject = ['$state'];

    function dealEngine($state) {

		return {
			restrict: 'E',
			replace: 'true',
			cache:'false',
			controller: 'dealEngineCtrl',
			templateUrl: 'js/directives/deal/deal.html',//?'+Math.floor((Math.random() * 1000000000000) + 1),
			scope:{
			    'deal':'='
			},
			link: function(scope, element, attrs, dealEngineCtrl) {

				/*
				** if given group is the selected group, deselect it
				* else, select the given group
				*/

				scope.toggleGroup = function(group) {
					console.log(group);
					if (scope.isGroupShown(group)) {
						scope.shownGroup = null;

					} else {
						scope.shownGroup = group;
					}
				};

				scope.isGroupShown = function(group) {
				    return scope.shownGroup === group;
				};

			    scope.store = dealEngineCtrl.store;
			    dealEngineCtrl.menu.then(function(data){
			    	scope.menu=data;
			    });



			    scope.$watch('deal', function(deal){
			        //console.log(scope.menu);
			        if(deal) {

			        	//console.log(deal);
			        	deal.item_id   = deal.item_id.split(',');
			        	deal.item_size = deal.item_size.split(',');
			        	deal.item_type = deal.item_type.split(',');

			        	//console.log(deal);

			        	//console.log(scope.deal);

			           scope.dealItems = [];
			           var items, searchby, category;


			           _.map(scope.deal.item_id, function(id, i){

			           	if(id){

			           		if(deal.item_type[i] =='product'){

			           			searchby = {'id': id};
			           			items = _.findWhere(scope.menu, searchby);
			           			category = items.category;
			           			items = {"items":items, "type":deal.item_type[i], "category":category, "selected":items.name}

			           		}

			           		if(deal.item_type[i] =='type'){

			           			searchby = {'TyID': id};
			           			items = _.where(scope.menu, searchby);
			           			category = items[0].category;
			           			items = {"items":items, "type":deal.item_type[i], "category":category, "selected":null}

			           		}


			           		scope.dealItems.push(items);
			           	}

			           });

			           console.log(scope.dealItems);
			        }


                });


            }
		};

    }

    dealEngineCtrl.$inject = ['$scope','$attrs', '$element', 'storeService','$ionicNavBarDelegate'];

    function dealEngineCtrl($scope, $attrs, $element, storeService, $ionicNavBarDelegate) {

        var vm = this;
        vm.store = storeService.getCurrentStore();
        vm.menu  = storeService.tget('menu', vm.store.id);

    }


})();
