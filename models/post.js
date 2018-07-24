const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  image: { type: Img, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Post', PostSchema)
