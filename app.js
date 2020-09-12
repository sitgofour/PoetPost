const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Post } = require("./database.js");
const { postIsValid, twilioPostIsValid } = require("./postValidate.js");
const { twilioPostToDB, postToDB } = require("./dbFunctions.js");

// ***************************************
// MIDDLEWARE
// ***************************************

// use cors middleware
// use express middleware
// enable static pages
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// ***************************************



// ***************************************
// ROUTES
// ***************************************

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
    let resObj = {...req.body};
    let newPost = {
        name: resObj.From,
        post: resObj.Body
    };
    if(twilioPostIsValid(newPost)) {
        twilioPostToDB(newPost)
        .then(doc => res.json(doc))
        .catch(err => console.log(err));
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





