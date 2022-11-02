//DECLARATIONS: router, model object ----------------------
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//COMMENt ROUTES: /api/comments ==========================
//get all comments: /api/comments/
router.get('/', (req, res) => {
    Comment.findAll()
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
//get all comments on Post: /api/comments/:postid
router.get('/:postid', (req, res) =>{
    Comment.findAll({
        where: { post_id: req.params.postid }
    })
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No comment found with this id!' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

//create comment: /api/comments/
router.post('/', (req, res) => {
    //check if user loggedIn
    if (req.session.loggedIn) {
        Comment.create({
            comment_text: req.body.comment_text,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    } else {
        //if not loggedIn send message
        res.status(404).json({ message: 'User not logged in' });
        return;
    }
});

//delete comment: /api/comments/:id
router.delete('/:id', (req, res) => {
    Comment.destroy({ 
        where: { id: req.params.id }
    })
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No comment found with this id!' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

//EXPORT ROUTER -------------------------------
module.exports = router;