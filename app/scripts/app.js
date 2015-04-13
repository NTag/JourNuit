'use strict';
// Jour&Nuit

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('jour-nuit', ['ionic', 'jour-nuit-ctrl', 'jour-nuit-services'])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .state('check-email', {
        url: '/',
        templateUrl: 'partials/check-email.html',
        controller: 'CheckEmailCtrl'
    });
})

.run(function($ionicPlatform, checkEmail) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

        facebookConnectPlugin.getAccessToken(
            function (access_token) {
                checkEmail.get().then(function () {
                    alert('Deja inscrit');
                }, function () {
                    alert('Pas encore inscrit');
                });
            },
            function (response) { alert(JSON.stringify(response)) }
        );
    });
})
;
