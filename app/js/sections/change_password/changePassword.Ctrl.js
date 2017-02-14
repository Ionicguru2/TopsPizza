(function () {
    'use strict';

    changePasswordCtrl.$inject = ['$scope','storeService', '$state','$ionicPopup', 'authService', '$localStorage'];
	function changePasswordCtrl($scope, storeService, $state, $ionicPopup, authService, $localStorage) {
	    var vm = this;
        vm.old_password = '';
        vm.new_password = '';
        vm.confirm_password = '';

        vm.changePassword = function(){
            if(vm.old_password && vm.new_password && vm.confirm_password){
                authService.changePassword(
                    {
                        "u": $localStorage.email,
                        "p":vm.old_password,
                        "new_password":vm.new_password,
                        "repeat_password":vm.confirm_password
                    },
                    function(response) {
                        if(response && !response.data.error) {
                          if (response.data.msg == true)
                            $ionicPopup.alert({
                              title: 'Password Change',
                              template: 'Password was changed successfully.'
                            }); else
                            $ionicPopup.alert({
                                title: 'Password Change',
                                template: response.data.msg
                            });
                        } else {
                            $ionicPopup.alert({
                                title: 'Password Change',
                                template: 'Password was not changed.'
                            });
                        }
                    }
                );
            }
        };

        vm.loginFacebook = function() {
          authService.facebookSignIn();
        };
    };
    angular
        .module('app')
        .controller('changePasswordCtrl', changePasswordCtrl);

})();
