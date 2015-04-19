'use strict';
angular.module('jour-nuit-ctrl', [])

.controller('HomeCtrl', function($scope, $state, accessToken) {
    console.log('home');
    $scope.fbLogin = function () {
        if (!window.cordova) {
            var appId = "468156286670593";
            facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login( ["email", "user_friends", "user_birthday", "user_about_me", "user_events"],
            function (r) {
                console.log(r);
                accessToken.set(r.authResponse.access_token);
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
.controller('ProfileCtrl', function($scope, $ionicModal, profile) {
    console.log('profile');
    $scope.user = profile.get(function (r) {
        if (pictures.length == 0) {

        }
        console.log(r);
    }, function (r) {
        console.log(r);
    });
    $scope.age = function (d) {
        return Math.floor(((new Date()) - (new Date(d)))/(365*24*60*60*1000));
    };

    $ionicModal.fromTemplateUrl('partials/pp-edit.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    });

    $scope.openModal = function() {
        $scope.modal.show()
    }
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
})
;
