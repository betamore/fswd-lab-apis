
var angular = require('angular');

angular.module("fswd", [require('./fswd/registration').name, require('./fswd/ngMap').name, require('angular-route/index')])

angular.bootstrap(document, ['fswd']);
