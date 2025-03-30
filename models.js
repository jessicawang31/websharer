import mongoose from "mongoose";
// import models from './models.js';

let models = {};

main() 
async function main() {
    // add own connectionn
    await mongoose.connect('mongodb+srv://info441:info441@cluster0.5jmgs.mongodb.net/websharer?retryWrites=true&w=majority&appName=Cluster0');
    console.log("connected!");

    const postSchema = new mongoose.Schema({
        username: String,
        url: String,
        description: String,
        likes: [String],
        created_date: Date
    })

    models.Post = mongoose.model('Post', postSchema);

    const commentSchema = new mongoose.Schema({
        username: String,
        comment: String, 
        post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
        created_date: Date
    })
    models.Comment = mongoose.model('Comment', commentSchema);

    console.log("mongoose models created");

    const userInfoSchema = new mongoose.Schema({
        username: String,
        email: String, 
        fun_fact: String
    })
    models.UserInfo = mongoose.model('UserInfo', userInfoSchema);

    console.log("mongoose models created");

}

export default models;