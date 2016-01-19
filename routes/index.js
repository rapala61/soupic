var express = require( 'express' );
var router  = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var Soup = require('../models/soup');
var PicIngredient = require('../lib/picIngredient');
var SoupPic = require('../lib/soup');
var emitter = require('../lib/pubSub');
var FileValidation = require('../lib/validateFileUpload');

router.get('/', function( req, res, next ) {
  res.render('index', {title: 'Nice soup'});
});

router.post('/pics', upload.single('file'), function( req, res, next ) {
  var valid = false;
  if ( req.file ) {
    valid = FileValidation.isValid(req.file);

    if (!valid) {
      res.json({
        error: 422,
        msg: 'Only the following extensions are supported: ' + FileValidation.validFormats.join(', ') + '.'
      }).end();
    }else {
      emitter.once('processed pic', function(originalPath, newPath) {
        SoupPic.process( originalPath, newPath );
      });
      emitter.once('processed soup', function( soup ) {
        res.json({
          url: soup.url
        });
      });
      PicIngredient.process( req.file );
    }
  }else {
    res.json({
      error: 422,
      msg: 'Missing the picture ingredient!'
    });
  }
});

module.exports = router;
