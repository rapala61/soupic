var express = require('express');
var mongoose = require('mongoose');

var SoupSchema = mongoose.Schema({
  name: { type: String },
  picture: { type: Buffer },
  contentType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model( 'Soup', SoupSchema );
