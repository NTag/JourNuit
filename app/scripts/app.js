'use strict';
// Jour&Nuit

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('jour-nuit', ['ionic', 'ngResource', 'jour-nuit-ctrl', 'jour-nuit-services'])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .state('check-email', {
        url: '/check-email',
        templateUrl: 'partials/check-email.html',
        controller: 'CheckEmailCtrl'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl'
    })
    .state('ppedit', {
        url: '/ppedit',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>'
    })
    .state('ppedit.facebook', {
        url: '/facebook',
        templateUrl: 'partials/ppedit/facebook.html',
        controller: 'PPEditFacebookCtrl'
    })
    ;
})

.run(function($ionicPlatform, $state, checkEmail, accessToken) {
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
                accessToken.set(access_token);
                checkEmail.get({s: access_token}, function () {
                    console.log('Deja inscrit');
                    console.log(access_token);
                    $state.go('profile');
                }, function (r) {
                    console.log(r);
                    console.log('Pas encore inscrit');
                    $state.go('check-email');
                });
            },
            function (r) {
                console.log('Pas Facebook connected');
                console.log(response);
            }
        );
    });
})
;
