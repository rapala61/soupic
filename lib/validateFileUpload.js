var mime = require('mime-types');
var _ = require('underscore');

var FileValidation = FileValidation || {};

FileValidation.validFormats = [
      'jpeg', 'jpg', 'png', 'bmp'
    ];

FileValidation.isValid = function( file ) {
  var valid = false;
  var ext = mime.extension( file.mimetype );
  return _.contains( FileValidation.validFormats, ext );
}

module.exports = FileValidation;
