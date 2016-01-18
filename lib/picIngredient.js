var emitter = require('./pubSub');
var worker = require('child_process').exec;
var PicIngredient = PicIngredient || {};

PicIngredient.process = function( file ) {
  var newPicName = file.path + '_new.png';

  // random number between 30 and 70
  var randomSpread = Math.floor(Math.random() * 41) + 30;
  var command = [
      'convert',
      file.path, //input
      '-resize', '175',

      // Makes it look like its part of the soup
      ' \\( +clone -alpha extract -virtual-pixel black -spread 65 -blur 1x1 -threshold ' +randomSpread+ '% -spread 1 -blur 0x.7 \\)',
      '-alpha off -compose Copy_Opacity -composite',

      // Makes it a circle
      '-alpha set \\( +clone -distort DePolar 0 -virtual-pixel HorizontalTile -background None -distort Polar 0 \\)',
      '-compose Dst_In -composite -trim +repage',
      newPicName  //output
    ];
  var commandString = command.join(' ');

  worker( commandString, function(err, stdout, stderr) {
    emitter.emit('processed pic', file.path, newPicName);
  });
}

module.exports = PicIngredient;
