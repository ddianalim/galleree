const express = require('express');
const auth = require('./helpers/auth');
const Post = require('../models/post');

const router = express.Router();


// Posts index
router.get('/', auth.requireLogin, (req, res, next) => {
  Post.find({}, 'title', function(err, posts) {
    if(err) {
      console.error(err);
    } else {
      res.render('posts/index', { posts: posts });
    }
  });
});

// router.get('/', auth.requireLogin, (req, res, next) => {
//   Trip.find({users: res.locals.currentUserId}).populate('events').sort({ date: -1}).exec(function(err, trips) {
//     if (err) {
//       console.error(err);
//     }
//     res.render('trips/index', { trips: trips, events: events });
//   });
// });

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('posts/new');
});

// Posts show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if(err) { console.error(err) };

    res.render('posts/show', { post: post });
  });
});

// Posts edit
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if(err) { console.error(err) };

    res.render('posts/edit', { post: post });
  });
});

// Posts update
router.post('/:id', auth.requireLogin, (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if(err) { console.error(err) };

    res.redirect('/posts/' + req.params.id);
  });
});

// Posts create
router.post('/', auth.requireLogin, (req, res, next) => {
  let post = new Post(req.body);

  post.save(function(err, post) {
    if(err) { console.error(err) };

    return res.redirect('/posts');
  });
});

module.exports = router;
