'use strict';
angular.module('jour-nuit-services', [])
.factory('checkEmail', ['$resource', function($resource) {
    return $resource('http://92.222.4.222/index.php/profile');
 }]);
