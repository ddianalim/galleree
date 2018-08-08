const express = require('express');
const auth = require('./helpers/auth');
const Post = require('../models/post');
const User = require('../models/user');

const multer = require('multer');
const Upload = require('s3-uploader');

const router = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
      console.log(file)
      let extArray = file.mimetype.split("/");
      let ext = extArray[extArray.length - 1];
      cb(null, Date.now() + "." + ext);
  }
});

const upload = multer({ storage });

let client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'images/',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    original: true,
    versions: true
  },
  versions: [{}]
});

// Delete Posts
router.delete('/:id', auth.requireLogin, (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).then(() => {
    return res.redirect('/posts');
  }).catch((err) => {
    console.log(err.message);
  });

  console.log(req.params.id);
})

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

router.post('/', upload.single('picUrl'), (req, res) => {
    let post = new Post(req.body);
    post.users.push(req.session.userId);

    console.log(req.file)
    if (req.file) {
          client.upload(req.file.path, {}, function (err, versions, meta) {
            if (err) {
                console.log("Error after uploading - ", err)
                return res.status(400).send({ err: err });
            }
            post.picUrl = versions[0].url;
              Post.create(post).then(() => {
                return res.redirect('/posts');
              }).catch((err) => {
                console.log(err.message);
              });
          });
    }
    else{
        Post.create(post).then(() => {
          console.error("Post created, but image cannot be uploaded");
          return res.redirect('/posts');
        });
    }
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

// Posts view (Shareable link)
router.get('/:id/view', (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if(err) { console.error(err) };

    res.render('posts/view', { post: post });
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

module.exports = router;
