var express = require('express');
var mongoose = require('mongoose');

var SoupSchema = mongoose.Schema({
  name: { type: String },
  url: { type: String },
  user: { type: mongoose.Schema.ObjectId }
}, { timestamps: true });

module.exports = mongoose.model( 'Soup', SoupSchema );
