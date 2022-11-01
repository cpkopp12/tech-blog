//DECLARATIONS: router, model object --------------------------
const router = require('express').Router();
const { User } = require('../../models');

//ROUTES: /api/users =====================
//get all users: /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password']}
    })
        .then(dbData => res.json(dbData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get user by id: /api/users/:id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exlcude: ['password'] },
        where: { id: req.params.id }
        //GET POSTS ONCE MODEL set up
    })
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//post user: /api/users/
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbData => {
            //save session for newly created user
            //session vars: user_id, username, loggedIn=true
            req.session.save(() => {
                req.session.user_id = dbData.id;
                req.session.username = dbData.username;
                req.session.loggedIn = true;
                //confirm res
                res.json(dbData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// LOGIN LOGOUT ------------------------------------
//user login: /api/users/login
router.post('/login', (req,res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbData => {
            if (!dbData) {
                res.status(400).json({ message: 'No user with that email address!' });
                return;
            }
            //valid password, boolean
            const vPW = dbData.checkPassword(req.body.password);
            if (!vPW) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }
            //save session: user_id, username, loggedin=true
            req.session.save(() => {
                req.session.user_id = dbData.id;
                req.session.username = dbData.username;
                req.session.loggedIn = true;
                //confirm res
                res.json({ user: dbData, message: 'You are now logged in!' });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//user logout: /api/logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
//-------------------------------------

//update user: /api/users/:id
router.put('/:id', (req,res) => {
    User.update(req.body, {
        individualHooks: true,
        where: { id: req.params.id }
    })
        .then(dbData => {
            if (!dbData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete user: /api/users/:id
router.delete('/:id', (req, res) => {
    User.destroy({
        where: { id: req.params.id }
    })
        .then(dbData =>{
            if (!dbData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//EXPORT ROUTER -----------------------------
module.exports = router;