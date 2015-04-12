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
    }
})
;
