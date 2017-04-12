var angular = require('angular'),
    moment = require('moment'),
    lodash = require('lodash');

angular.module('fswd.ngMap', [])
  .directive('ngMap', function() {
    function link(scope, element) {
      var myMap;

      function initMap() {
        var options = {
          center: new google.maps.LatLng(39.2723739, -76.6123883),
          zoom: 8,
          mapTypeId: 'roadmap'
        };

        myMap = new google.maps.Map(element[0], options);
      }

      initMap()

      scope.$watch('marker', function(newMarker) {
        if(newMarker) {
          newMarker.setMap(myMap);
        }
      });
    }

    return {
      restrict: 'A',
      link: link,
      scope: {
        marker: '='
      }
    }
  }).
  controller('NgMapCtrl', function($q, ngMapSvc) {
    var self = this,
        iconMap = {
          green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          yellow: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        };

    self.marker;

    self.addMarker = function() {
      var coordCall = ngMapSvc.getCoordinates(self.zipcode),
          uvCall = ngMapSvc.getUv(self.zipcode, self.hour);

      $q.all([coordCall, uvCall]).then(function([ coords, uv ]) {
        self.createMarker(coords, uv);
      });
    };

    self.createMarker = function(coords, uv) {
      self.marker = new google.maps.Marker({
        position: coords,
        icon: determineColor(uv)
      });
    };

    function determineColor(uv) {
      if(uv <= 2) {
        return iconMap.green;
      }else if(uv >= 6) {
        return iconMap.red;
      }

      return iconMap.yellow;
    }
  })
  .service('ngMapSvc', function($http) {

    this.getCoordinates = function(zipcode) {
      return $http.get('/apis/coordinates/' + zipcode).then(function(res) {
        var coordinates = res.data.results[0].geometry.location;

        return coordinates;
      });
    }

    this.getUv = function(zipcode, hour) {
      return $http.get('apis/uv/' + zipcode).then(function(res) {
        var theHour = _.isEmpty(hour) ? moment().hour() : _.toNumber(hour);

        var uv = _.find(res.data, function(x) {
          if(moment(x.DATE_TIME, 'MMM/DD/YYYY hh a').hour() === theHour) {
            return true;
          }

          return false;
        });

        return uv.UV_VALUE;
      });
    }
  });

module.exports = angular.module('fswd.ngMap');
