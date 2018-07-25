const express = require('express');
const router = express.Router();

const auth = require('./helpers/auth');
const Room = require('../models/post');

// Posts index
router.get('/', auth.requireLogin, (req, res, next) => {
  Post.find({users: res.locals.currentUserId}).populate('posts').exec(function(err, posts) {
    if (err) {
      console.error(err);
    }
    res.render('posts/index', { trips: trips, events: events });
  });
});

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('posts/new');
});

// Posts show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  // TODO
});

// Posts update
router.post('/:id', auth.requireLogin, (req, res, next) => {
  // TODO
});

// Posts create
router.post('/', auth.requireLogin, (req, res, next) => {
  // TODO
});

module.exports = router;
