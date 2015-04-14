'use strict';
angular.module('jour-nuit-ctrl', [])

.controller('HomeCtrl', function($scope) {
    console.log('home');
    $scope.fbLogin = function () {
        if (!window.cordova) {
            var appId = "468156286670593";
            facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login( ["email"],
            function (response) { alert(JSON.stringify(response)) },
            function (response) { alert(JSON.stringify(response)) }
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
;
