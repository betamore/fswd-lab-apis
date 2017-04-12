var express = require('express'),
  request = require('request'),
  router = express.Router();

router.get('/coordinates/:zipcode', function(req, res) {
  request.get({
    uri: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.zipcode,
    json: true
  }).pipe(res);
});

router.get('/uv/:zipcode', function(req, res) {
  request.get({
    uri: 'https://iaspub.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/' + req.params.zipcode + '/JSON',
    json: true
  }).pipe(res);
});

module.exports = router;
