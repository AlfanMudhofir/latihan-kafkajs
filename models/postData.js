const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    description: String,
});

module.exports = mongoose.model('post', PostSchema);