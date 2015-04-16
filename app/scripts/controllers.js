'use strict';
angular.module('jour-nuit-ctrl', [])

.controller('HomeCtrl', function($scope, $state, accessToken) {
    console.log('home');
    $scope.fbLogin = function () {
        if (!window.cordova) {
            var appId = "468156286670593";
            facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login( ["email"],
            function (r) {
                console.log(r);
                accessToken.set(r.access_token);
                $state.go('check-email');
            },
            function (r) {
                // Il a pas voulu se logguer, on fait rien
                console.log(r);
            }
        );
    };
})
.controller('CheckEmailCtrl', function($scope, accessToken, register) {
    console.log('checkemail');
    var infos = {
        email: ''
    };
    $scope.infos = infos;
    $scope.register = function () {
        var data = new register();
        data.email = infos.email;
        data.$save(function (r) {
            alert('Succes');
            console.log(r);
        }, function (r) {
            alert('Error');
            console.log(r);
        });
    };
})
.controller('ProfileCtrl', function($scope) {
    console.log('profile');
    
})
;
