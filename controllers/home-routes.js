// This file will contain all of the user-facing routes
// ie the homepage and login

const router = require('express').Router();

router.get('/', (req, res) => {
    // res.render = specifies which template we want to use
    res.render('homepage', {
        // taking a single post object and pass it to the homepage.handlebars template
        // each property on the object (id, post, title, etc) becomes avail in the template using hb {{}} syntax
        id: 1,
        post_url: 'https://handlebarsjs.com/guide/',
        title: 'Handlbars Docs',
        created_at: new Date(),
        vote_count: 10,
        comments: [{}, {}],
        user: {
            username: 'test_user'
        }
    });
});

module.exports = router;