var express = require('express');
var mongoose = require('mongoose');

var SoupSchema = mongoose.Schema({
  name: { type: String },
  url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model( 'Soup', SoupSchema );
