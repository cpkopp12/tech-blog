//DECLARATIONS: USER ----------------
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

//MODEL RELATIONS ================================
//user to post
User.hasMany(Post, {
    foreignKey: 'user_id'
});
//post to user
Post.belongsTo(User, {
    foreignKey: 'user_id'
});
//comment to user
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
//comment to post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
//user to comment
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
//post to comment
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});


//EXPORT MODEL OBJECT ---------------
module.exports = { User, Post, Comment };