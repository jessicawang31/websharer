import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';


//TODO: Add handlers here
router.post('/', async (req, res) => {
    let session = req.session;

    try {
        // user logged in? 401 error
        if (!session.isAuthenticated) {
            return res.status(401).json({"status": "error", error: "not logged in"});
        }

        // new post
        const newPost = new req.models.Post({
            username: session.account.username,
            url: req.body.url,
            description: req.body.description,
            likes: [],
            created_date: new Date()
        })
        await newPost.save();

        res.json({"status": "success"});
    
    } catch(err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
});

router.get('/', async function(req, res, next) {
    try {
        // get usernames
        let username = req.query.username;
        let filterUsers;
        // if the user is logged in 
        if (username) {
            // filterUsers = await req.models.Post.find({ username: username });
            filterUsers = {username: req.query.username};
        // } else {
        //     filterUsers = await req.models.Post.find();
        }

        // get all posts
        const allPosts = await req.models.Post.find(filterUsers);

        let postData = await Promise.all(
            allPosts.map(async post => { 
                try{
                    const htmlPreview = await getURLPreview(post.url);
                    return {username: post.username, htmlPreview: htmlPreview, description: post.description, likes: post.likes, id: post.id, created_date: post.created_date};
                }catch(err){
                    // TODO: return error message
                    console.log(err);
                    res.status(500).json({"status": "error", "error": err});
                }
            })
        );
        res.json(postData);
    } catch(err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})


// like
router.post('/like', async (req, res) => {
    let session = req.session;

    try {
        // user logged in? 401 error
        if (!session.isAuthenticated) {
            return res.status(401).json({"status": "error", error: "not logged in"});
        }

        // find post by postID
        const post = await req.models.Post.findById(req.body.postID);
        if (!post.likes.includes(session.account.username)) {
            post.likes.push(session.account.username);
            await post.save();
        }

        res.json({"status": "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})

// unlike
router.post('/unlike', async (req, res) => {
    let session = req.session;

    try {
        // user logged in? 401 error
        if (!session.isAuthenticated) {
            return res.status(401).json({"status": "error", error: "not logged in"});
        }

        // find post by postID
        const post = await req.models.Post.findById(req.body.postID);
        if (post.likes.includes(session.account.username)) {
            post.likes = post.likes.filter(username => username != session.account.username);
            await post.save();
        }

        res.json({"status": "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})

// delete
router.delete('/', async (req, res) => {
    let session = req.session;

    try {
        // user logged in? 401 error
        if (!session.isAuthenticated) {
            return res.status(401).json({"status": "error", error: "not logged in"});
        }

        // find post by postID
        const post = await req.models.Post.findById(req.body.postID);
        if (post.username != session.account.username) {
            return res.status(401).json({"status": "error", error: "you can only delete your own posts"});
        }

        let userId = req.body.postID;
        await req.models.Comment.deleteMany({post: userId});
        await req.models.Post.deleteOne({_id: userId});
        res.json({"status": "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})

export default router;