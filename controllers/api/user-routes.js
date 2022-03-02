const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

// GET /api/users - All Users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1 - Returns 1 user based on req.params.id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
            model: Post,
            attributes: [
                'id',
                'title',
                'post_url',
                'created_at'
            ]
            },
            {
                model: Comment, // so we can see on which posts the user commented
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts' // when we query user we can see which posts a user created/voted on
            }
        ]
    })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users - Create a user
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        // want to make sure the session is created before we send the response back
        // so we are wrapping the variables in a call back
        // this sesssion will initiate the creation of the session and then run the call back function once complete
        req.session.save(() => {
            // this gives easy access to the user's user_id and username
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true; // Boolean describing whether or not the user is logged in

            res.json(dbUserData);
        });
    })
});

// POST - login into user account
router.post('/login', (req, res) => {
    // Query Operation
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(400).json({ message: 'No user with that email address!' });
                return;
            }
            // Verify user
            const validPassword = dbUserData.checkPassword(req.body.password);
            if(!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }

            req.session.save(() => {
                // declare session variables
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;
            
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// Logout - destroy th4e session variables and reset the cookies
router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end(); // send a 204 code after the session has been successfully destroyed
        });
    }
    else {
        res.status(404).end();
    }
});

// PUT /api/users/1 - update exisiting data
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1 - DELETE a user from the db
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;