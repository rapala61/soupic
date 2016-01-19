var emitter = require('./pubSub');
var gm = require('gm').subClass({imageMagick: true});
var fs = require('fs');
var SoupDish = SoupDish || {};
var Soup = require('../models/soup');
var AWS = require('aws-sdk');
var crypto = require('crypto');

SoupDish.generateNameHash = function( name ) {
  return crypto.createHash('md5').update(name).digest('hex');
}

SoupDish.generateUrl = function( key ) {
  return 'https://s3-'+process.env.AWS_REGION+'.amazonaws.com/'+process.env.AWS_BUCKET+process.env.AWS_PREFIX+'/'+key
}

SoupDish.process = function( originalPath, newPath ) {
  var randomSoup = Math.floor(Math.random()*3)+1;

  gm()
    .command('composite')
    .in('-gravity','center')
    // .in('-geometry', '+75+100')
    .in(newPath)
    .in('public/img/thesoup'+randomSoup+'.png')
    .toBuffer('PNG',function (err, buffer) {

      if (err) {
        console.log(err);
        res.status(500).end();
      }else {

        var nameHash = SoupDish.generateNameHash(newPath);
        var s3 = new AWS.S3({ region: process.env.AWS_REGION});
        s3.putObject({
          ACL: 'public-read',
          Bucket: process.env.AWS_BUCKET+process.env.AWS_PREFIX,
          Key: nameHash,
          Body: buffer,
          ContentType: 'image/png'
        }, function(err, data) {
          console.log('Successfully uploaded package.');
          console.log(err, data, process.env.AWS_BUCKET);

          Soup.create({
            name: nameHash,
            url: SoupDish.generateUrl( nameHash )
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
        });
      }
    });
}

module.exports = SoupDish;
