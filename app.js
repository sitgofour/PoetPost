const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// use cors middleware
// use express middleware
// enable static pages
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//db connection
const connectToDb = async () => {
    return await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
const db = connectToDb();

//db schema/model definition
const Schema = mongoose.Schema;
const postSchema = new Schema({
    user: String,
    post: String,
    date: String,
    voteTotal: Number,
});

// generate post model object
const Post = new mongoose.model("Post", postSchema);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("server is listening...");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get("/posts", async (req, res) => {
    const postsArr = await Post.find();
    res.send(postsArr);
});

//receive new post and send to db function
app.post("/posts", (req, res) => {
    if(postIsValid(req.body)){
        postToDB(req.body)
        .then(doc => res.json(doc))
        .catch(err => console.log(err));
    } else {
        res.status(422);
        res.json({ message: "not a valid post"});
    }
});

//route for incoming twilio post requests
app.post("/post-twilio", (req, res) => {
    console.log("in post-twilio route...")
    
    let resObj = {...req.body};
    console.log(resObj);

    let newPost = {
        user: resObj.From,
        post: resObj.Body
    };
    
    console.log(newPost);

    if(twilioPostIsValid(newPost)) {
        try {
            const mongoResponse = postToDB(newPost);
            console.log(mongoResponse);
        }
        catch(err) {
            console.log("error while posting twilio post to db");
            console.log(err);
        }
    } else {
        console.log("post is not valid");
    }
});

// increments/decrements vote attribute on post 
app.post("/vote", async (req, res) => {
    let targetId = req.body.id;
    if(req.body.direction === "up") {
        const doc = await Post.findByIdAndUpdate({_id: targetId}, { $inc: { voteTotal: 1 } });
        res.send("vote made");
    } else if (req.body.direction === "down") {
        const doc = await Post.findByIdAndUpdate({_id: targetId}, { $inc: { voteTotal: -1 } });
        res.send("vote made");
    } else {
        console.log("neither up or down");
    }

});

//validates post before sending to db
const postIsValid = (req) => {
    return req.name && req.name.toString().trim() !== ""
            &&
           req.post && req.post.toString().trim() !== "";
}

const twilioPostIsValid = (newPost) => {
    return newPost.user && newPost.user.toString().trim() !== ""
            &&
           newPost.post && newPost.post.toString().trim() !== "";
}

// creates new post, updates db
const postToDB = async (newPost) => {
    const post = new Post({
        user: newPost.name,
        post: newPost.post,
        date: new Date().toDateString(),
        voteTotal: 0
    });
    const doc = await post.save();
    return doc;
}


