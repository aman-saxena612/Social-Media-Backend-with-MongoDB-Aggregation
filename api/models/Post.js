const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({

   content: {
      type: String,
      required: true
   },

   createdAt: {
      type: Date,
      default: Date.now
   },

   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      //   required: true
   },
}, { timestamps: true });

module.exports = model('Post', postSchema);
