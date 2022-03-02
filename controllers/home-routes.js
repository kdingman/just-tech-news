// This file will contain all of the user-facing routes
// ie the homepage and login

const router = require('express').Router();

// Import necessary modules
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post.id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // this will loop and map each Sequelize object into a serialized version of itself
        // saving the results in a new posts array
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // pass as single post object into the homepage template
        res.render('homepage', { posts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    // check for a session and redirect to the homepage if one exists
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // login page doesn't need any variables, so we don't need to pass a second argument to the render() method
    res.render('login');
});


module.exports = router;