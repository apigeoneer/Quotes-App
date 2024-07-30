const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({
    title: String,
    originalWriter: {type: String, required: false},
    content: {type: String, required: false},
    cover: {type: String, required: false},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;