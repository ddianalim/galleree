const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  picUrl: { type: String, required: true },
  description: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  date: { type: String, created: Date}
});

module.exports = mongoose.model('Post', PostSchema);
