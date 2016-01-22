var express         = require( 'express' ),
    router          = express.Router(),
    multer          = require('multer'),
    upload          = multer({ dest: 'uploads/' }),
    Soup            = require('../models/soup'),
    User            = require('../models/user'),
    PicIngredient   = require('../lib/picIngredient'),
    SoupPic         = require('../lib/soup'),
    emitter         = require('../lib/pubSub'),
    FileValidation  = require('../lib/validateFileUpload'),
    AuthHelper      = require('../lib/authHelper');

router.use( AuthHelper.middleWare.loadUserFromSession );

router.get('/', function( req, res, next ) {
  res.render('index', { title: 'Nice soup', user: req.user });
});

router.get('/login', AuthHelper.middleWare.loginUser)
router.get('/profile', AuthHelper.middleWare.requireLogin, function( req, res, next ) {
  res.render('profile', { title: 'Nice soup', user: req.user });
});
router.get('/logout', function( req, res, next ) {
  req[AuthHelper.sessionName].reset();
  req.user = undefined;
  res.redirect('/');
});

router.post('/login', AuthHelper.middleWare.loginUser);
router.post('/signup', function( req, res, next ) {
  var newUser = new User( req.body.user );
  newUser.save(function(err, dbUser) {

    // TODO: handle this erros
    console.log(err, dbUser);

    if (!err) {
      AuthHelper.loginUser( dbUser );
      res.redirect('/login');
    }else {
      res.redirect('/');
    }
  });
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
