var express = require('express'),
router = express.Router();

router.get("/", function(req, res) {
  res.render('index');
});

router.use('/users', require('./routes/users'));
router.use('/apis', require('./routes/apis'));

router.get('/partials/:template', function(request, response) {
  response.render('partials/' + request.params.template);
});

router.get('/api-playground', function(req, res) {
  res.render('api-playground');
});

module.exports = router;
