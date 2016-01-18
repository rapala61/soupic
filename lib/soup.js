var emitter = require('./pubSub');
var gm = require('gm').subClass({imageMagick: true});
var fs = require('fs');
var Soup = Soup || {};
var Soup = require('../models/soup');

Soup.process = function( originalPath, newPath ) {
  gm()
    .command('composite')
    .in('-gravity','center')
    // .in('-geometry', '+75+100')
    .in(newPath)
    .in('public/img/thesoup.png')
    .toBuffer('PNG',function (err, buffer) {

      if (err) {
        console.log(err);
        res.status(500).end();
      }else {

        Soup.create({
          name: 'test',
          picture: buffer,
          contentType: 'image/png'
        }, function(err, pic) {
          console.log(err);

          // delete file from uploads folder
          fs.unlinkSync(originalPath, function(err) {
            if (err) { console.log('couldnt delete:'+originalPath);}
          });
          fs.unlinkSync(newPath, function(err) {
            if (err) { console.log('couldnt delete:'+newPath);}
          });

          emitter.emit('processed soup', pic);
        });
      }
    });
}

module.exports = Soup;
