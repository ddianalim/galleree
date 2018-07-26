const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  // image: { type: Img, required: true },
  // image: { data: Buffer, contentType: String },
  description: { type: String, required: true },
  // users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('Post', PostSchema);
