import express from 'express';

var router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { postID } = req.query;
        if (!postID) {
            return res.status(400).json({ status: "error", error: "postID required" });
        }

        const comments = await req.models.Comment.find({ post: postID });
        const commentData = comments.map((comment) => ({
            id: comment._id,
            username: comment.username,
            comment: comment.comment,
            created_date: comment.created_date,
        }));

        res.json(commentData);
    } catch (err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})

router.post('/', async (req, res) => {
    let session = req.session;
    
    try {
        // user logged in? 401 error
        if (!session.isAuthenticated) {
            return res.status(401).json({"status": "error", error: "not logged in"});
        }

        // new comment
        const { postID, newComment } = req.body;

        if (!postID || !newComment) {
            return res.status(400).json({ status: "error", error: "missing postID or comment" });
        }

        const comment = new req.models.Comment({
            username: session.account.username,
            comment: newComment,
            post: postID,
            created_date: new Date()
        });

        await comment.save();
    } catch (err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})

export default router;