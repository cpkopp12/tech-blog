//DECLARATIONS: router, model object --------------------------
const router = require('express').Router();
const { User, Post } = require('../../models');

//POST ROUTES =================================================
// get all posts: /api/posts/
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_text'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['id', 'username']
            }
            //ADD COMMENTS
        ]
    })
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get post by id: /api/posts/:id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'title', 'post_text'],
        include: [
            {
                model: User,
                attributes: ['id', 'username']
            }
            //ADD COMMENTS
        ]
    })
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

})

// create post: /api/posts/
router.post('/', (req, res) => {
    //check if session exists first
    if (req.session.loggedIn) {
        Post.create({
            title: req.body.title,
            post_text: req.body.post_text,
            //use session for user_id
            user_id: req.session.user_id
        })
            .then(dbData => res.json(dbData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        //if not logged in send message
        res.status(404).json({ message: 'User not logged in' });
        return;
    }
});

//update post: /api/posts/:id
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: { id: req.params.id }
        }
    )
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete post: /api/posts/:id
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: { id: req.params.id }
    })
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//EXPORT ROUTER ------------------------------------
module.exports = router;