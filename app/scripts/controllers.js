'use strict';
angular.module('jour-nuit-ctrl', [])

.controller('HomeCtrl', function($scope, $state, accessToken) {
    console.log('home');
    $scope.fbLogin = function () {
        if (!window.cordova) {
            var appId = "468156286670593";
            facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login( ["email", "user_friends", "user_birthday", "user_about_me", "user_events", "user_photos"],
            function (r) {
                console.log(r);
                accessToken.set(r.authResponse.accessToken);
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
.controller('ProfileCtrl', function($scope, $state, $ionicModal, profile, events) {
    console.log('profile');
    $scope.ppimage = 'images/no-pp.jpg';
    $scope.user = profile.get(function (r) {
        if (r.pictures.length > 0) {
            $scope.ppimage = r.pictures[0];
        }
        console.log(r);
    }, function (r) {
        console.log(r);
    });
    $scope.age = function (d) {
        return Math.floor(((new Date()) - (new Date(d)))/(365*24*60*60*1000));
    };
    $scope.events = events.query();

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

    $scope.goToMenu = function () {
        $state.go('menu');
    };
})
.controller('MenuCtrl', function($scope, $state) {
    console.log('menu');
    $scope.goToProfile = function () {
        $state.go('profile');
    };
    $scope.goToMatchs = function () {
        $state.go('matchs');
    };
})
.controller('MatchsCtrl', function($scope, $state) {
    console.log('matchs');
    $scope.goToMenu = function () {
        $state.go('menu');
    };
})
.controller('PPEditFacebookCtrl', function($scope, $state, $http, accessToken) {
    console.log('pp edit facebook');
    // On récupère les albums
    facebookConnectPlugin.api("me/albums", ["user_photos"],
        function (r) {
            //console.log(r);
            // On récupère maintenant les photos de l'album "Photos de profil"
            console.log("Albums retrieved");
            console.log(r.data[0].id);
            facebookConnectPlugin.api(r.data[0].id + "/photos", ["user_photos"],
                function (rr) {
                    //console.log(rr);
                    console.log("Photos retrieved");
                    $scope.photos = rr.data;
                    console.log(rr.data.length + ' photos');
                },
                function (rr) {
                    console.log(rr);
                }
            );
        },
        function (r) {
            // Il a pas voulu se logguer, on fait rien
            console.log(r);
        }
    );

    $scope.uploadPhoto = function (url) {
        delete $http.defaults.headers.common['X-Requested-With']; // See note 2
        $http.get(url, {responseType: "arraybuffer"}).
          success(function(data) {
            console.log("Read '" + url + "' with " + data.byteLength
            + " bytes in a variable of type '" + typeof(data) + "'");
            var form = new FormData();
            form.append('pic', new Blob([data]));
            $http.post('http://92.222.4.222/index.php/picture?s=' + accessToken.get(), form, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (d) {
                console.log('Succes');
                console.log(d);
                $state.go('profile');
            }).error(function (d) {
                console.log('Error');
                console.log(d);
            })
          }).
          error(function(data, status) {
            console.log("Request failed with status: " + status);
          });
    };
})
;
