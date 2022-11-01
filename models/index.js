//DECLARATIONS: USER ----------------
const User = require('./User');
const Post = require('./Post');

//MODEL RELATIONS ================================
//user to post
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

//EXPORT MODEL OBJECT ---------------
module.exports = { User, Post };