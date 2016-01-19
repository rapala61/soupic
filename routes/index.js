var express = require( 'express' );
var router  = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var Soup = require('../models/soup');
var PicIngredient = require('../lib/picIngredient');
var SoupPic = require('../lib/soup');
var emitter = require('../lib/pubSub');

router.get('/', function( req, res, next ) {
  res.render('index', {title: 'Nice soup'});
});

// router.get('/pics/:id', function( req, res, next ) {
//   Soup.findById(req.params.id, function(err, soup) {
//     console.log(err);
//     // res.attachment();
//     res.set('Content-Type', soup.contentType);
//     res.send(soup.picture);
//   });
// });

router.post('/pics', upload.single('file'), function( req, res, next ) {
  if ( req.file ) {
    emitter.once('processed pic', function(originalPath, newPath) {
      SoupPic.process(originalPath, newPath);
    });
    emitter.once('processed soup', function( soup ) {
      res.json( {url: soup.url} );
    });
    PicIngredient.process( req.file );
  }else {
    res.status(422).end();
  }
});

module.exports = router;
