'use strict';
angular.module('jour-nuit-services', [])
.factory('accessToken', function() {
    var access_token = undefined;
    return {
        'get': function () {
            return access_token;
        },
        'set': function (s) {
            access_token = s;
        }
    };
 })
.factory('checkEmail', ['$resource', 'accessToken', function($resource, accessToken) {
    return $resource('http://92.222.4.222/index.php/profile', {s: accessToken.get()});
 }])
.factory('register', ['$resource', 'accessToken', function($resource, accessToken) {
    return $resource('http://92.222.4.222/index.php/register', {s: accessToken.get()});
}])
.factory('profile', ['$resource', 'accessToken', function($resource, accessToken) {
    return $resource('http://92.222.4.222/index.php/profile/:id', {s: accessToken.get(), id: '@id'});
}])
.factory('events', ['$resource', 'accessToken', function($resource, accessToken) {
    return $resource('http://92.222.4.222/index.php/events/:id', {s: accessToken.get(), id: '@id'});
}])
 ;
