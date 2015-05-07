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
.controller('ProfileCtrl', function($rootScope, $scope, $state, $ionicModal, profile, events, picture) {
    console.log('profile');
    $scope.ppimage = 'images/no-pp.jpg';
    $scope.user = profile.get(function (r) {
        if (r.pictures.length > 0) {
            $scope.ppimage = picture(r.pictures[r.pictures.length - 1]);
            $scope.simage = picture(r.school.pictureId);
            console.log(picture(r.pictures[0]));
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

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == "profile" && fromState.name.indexOf('ppedit') == 0) {
                $scope.user = profile.get(function (r) {
                    if (r.pictures.length > 0) {
                        $scope.ppimage = picture(r.pictures[r.pictures.length - 1]);
                        console.log(picture(r.pictures[0]));
                    }
                    console.log(r);
                }, function (r) {
                    console.log(r);
                });
            }
        }
    );
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
.controller('ArbreSoireesCtrl', function($scope, $timeout, myevents, picture) {
    console.log('Arbre Soirées');


    // Gestion de l'arbre
    var arbre = {
        // Liste d'objets
        //  {
        //      id: string,
        //      centre: {x: float, y: float},
        //      rayon: float,
        //      titre: string,
        //      stitre: string,
        //      img: string,
        //      hidden: boolean,
        //      animate: boolean
        //  }
        cercles: [],
        // data : liste d'objets
        //  {
        //      importance: float (entre 0 et 1),
        //      titre: string,
        //      stitre: string,
        //      img: string
        //  }
        loadFromData: function (data) {
            console.log("debut");
            // Paramètres pour iPhone 6 Plus
            // Dimensions en pixels
            var height = 580;
            var width = 420;
            var limitrmax = 200;
            var limitrmin = 10;

            this.cercles = [];
            var nb = data.length;

            // Importances minimale et somme
            var imin = 1;
            var isum = 0;
            for (var i = 0; i < nb; i++) {
                if (data[i].importance < imin) {
                    imin = data[i].importance;
                }
                isum += data[i].importance;
            }

            var rmoyen = Math.min(limitrmax, height/nb);
            var imoyen = isum/nb;

            var lastCentre, i, e, rayon, centre;
            var lastx = width/4;
            var n = 0;
            while (data.length > 0) {
                n++;
                i = Math.floor(Math.random()*data.length);
                e = data[i];
                data.splice(i, 1);
                var c = {
                    id: e.id,
                    titre: e.titre,
                    stitre: e.stitre,
                    img: e.img,
                    hidden: false,
                    animate: false,
                    friends: e.friends
                };

                // intervention limitrmin, limitrmax ?
                rayon = rmoyen*(1+(1+Math.random()/4)*(e.importance - imoyen));


                // centre = {
                //     x: (0.9+0.2*Math.random())*width-(0.8+0.8*Math.random())*lastx,
                //     y: rmoyen*n*(1+0.1*(Math.random() - 0.5)) - rmoyen/1.5
                // };
                centre = {
                    x: Math.min(Math.max(width*(0.25+0.5*(n%2))+width*0.15*(0.5-Math.random()), rayon/2), width-rayon/1.7),
                    y: rmoyen*n*(1+0.1*(Math.random() - 0.5))
                };

                lastx = centre.x;

                c.centre = centre;
                c.rayon = rayon;
                c.bordure = Math.max(2, Math.min(10, rayon/50));
                c.fontsize = (c.bordure+6)*3;
                this.cercles.push(c);
            }
            console.log("fini");
        },

        selectCercle: function (c) {
            $scope.searching = true;
            for (var i = 0; i < this.cercles.length; i++) {
                if (c.id != this.cercles[i].id) {
                    this.cercles[i].hidden = true;
                }
            }
            c.rayon = 200;
            c.bordure = 6;
            c.centre = {
                x: 210,
                y: 400
            };
            c.animate = true;

            $timeout(function() {
                arbre.loadResult(c, c.friends);
                //$scope.$apply();
            }, 4000);
        },
        // cercle: le cercle sélectionné
        // personnes: liste d'objets { id, photo }
        loadResult: function (cercle, personnes) {
            $scope.searching = false;
            cercle.animate = false;

            this.cercles = [cercle];
            cercle.centre = {
                x: 210,
                y: 560
            };
            cercle.rayon = 140;
            cercle.bordure = 3;
            console.log('la');
            console.log(personnes);

            this.cercles.push({id: personnes[0].facebookUserId, rayon: 100, centre: {x: 210, y:420}, bordure: 2, hidden: false, img: picture(personnes[0].pictures[personnes[0].pictures.length-1]) });
            //this.cercles.push({id: personnes[1].id, rayon: 100, centre: {x: 95, y:480}, bordure: 2, hidden: false});
            //this.cercles.push({id: personnes[2].id, rayon: 100, centre: {x: 325, y:480}, bordure: 2, hidden: false});
            console.log('ici');
            $scope.$apply();
            console.log(this.cercles);
        }
    };

    var faussesDonnees = [
        {
            id: 1,
            titre: "Point Gamma",
            stitre: "4 500 participants",
            importance: 1
        },
        {
            id: 2,
            titre: "Gala HEC",
            stitre: "2 000 participants",
            importance: 0.7
        },
        {
            id: 3,
            titre: "Équinoxe",
            stitre: "1 300 participants",
            importance: 0.4
        },
        {
            id: 4,
            titre: "Vibes #3",
            stitre: "83 participants",
            importance: 0.1
        },
        {
            id: 5,
            titre: "Last Styx",
            stitre: "230 participants",
            importance: 0.2
        // },
        // {
        //     titre: "X-Tra",
        //     stitre: "900 participants",
        //     importance: 0.3
        }
    ];

    var events = myevents.query(function (e) {
        console.log(e);
        var donnees = [];
        var max = 1;
        for (var i = 0; i < e.length; i++) {
            if (e[i].totalBirdie > max) {
                max = e[i].totalBirdie;
            }
        }
        for (var i = 0; i < e.length; i++) {
            var words = e[i].event.name.split(" ");
            var ename = "";
            for (var j = 0; j < Math.min(words.length, 3); j++) {
                if (j > 0) {
                    ename = ename + " ";
                }
                ename = ename + words[j];
            }
            donnees.push({
                id: e[i].event.id,
                titre: ename,
                stitre: Math.floor(e[i].totalBirdie*(200+Math.random()*100)+Math.random()*100+Math.random()*10+Math.random()) + ' participants',
                importance: e[i].totalBirdie/max,
                friends: e[i].friends
            });
        }
        arbre.loadFromData(donnees);
    });
    //arbre.loadFromData(faussesDonnees);

    $scope.searching = false;
    $scope.arbre = arbre;
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
                    $scope.$apply();
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
