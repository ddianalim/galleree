const express = require('express');
const auth = require('./helpers/auth');
const Post = require('../models/post');
const User = require('../models/user');
var multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  // Removed so we don't save on server-side
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads/');
  // },
  filename: function (req, file, cb) {
      // TODO Look into edge cases
      let extArray = file.mimetype.split("/");
      let ext = extArray[extArray.length - 1];
      cb(null, Date.now() + "." + ext);
  }
});

const upload = multer({ storage });
const Upload = require('s3-uploader');

let client = new Upload('', {
  aws: {
    path: 'folder/',
    region: 'us-west-1',
    acl: 'public-read',
    accessKeyId: '',
    secretAccessKey: ''
  },
  cleanup: {
    versions: true,
    original: true
  }
});

// Posts index
router.get('/', auth.requireLogin, (req, res, next) => {
  Post.find({users: res.locals.currentUserId}).sort({ date: -1 }).exec(function(err, posts) {
    if(err) {
      console.error(err);
    } else {
      res.render('posts/index', { posts: posts });
    }
  });
});

// Posts new
router.get('/new', auth.requireLogin, (req, res, next) =>{
  User.findById(req.params.userId, function(err, post) {
    if(err) { console.error(err);}

    res.render('posts/new');
  });
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
    if (err) { console.error(err); }

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
// router.post('/', auth.requireLogin, (req, res, next) => {
//   let post = new Post(req.body);
//
//   post.users.push(req.session.userId);
//
//   post.save(function(err, post) {
//     if(err) { console.error(err) };
//
//     return res.redirect('/posts');
//   });
// });

router.post('/', auth.requireLogin, upload.single('picUrl'), (req, res) => {
    let post = new Post(req.body);
    post.users.push(req.session.userId);
    console.log("Pushed user")

    let imageArray = ['picThumb', 'picUrl', 'picSquare', 'picMobile'];
    if (req.file) {
          console.log("entered if")
          client.upload(req.file.path, {}, function (err, versions, meta) {
            if (err) {
                return res.status(400).send({ err: err });
            }
            // Iterate through imageArray and add them to respective columns
            for(let i = 0; i < imageArray.length; i++){
                post[imageArray[i]] = versions[i].url;
            }

              post.save(function(err, post) {
                if(err) { console.error(err) };

                return res.redirect('/posts');
              });
            // model.Post.create(post).then(() => {
            //   req.flash('success', 'Post created');
            //   res.redirect('/posts');
            // });
        });
    }
});

module.exports = router;
