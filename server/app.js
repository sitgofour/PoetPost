const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

//db connection
const connectToDb = async () => {
    return await mongoose.connect("mongodb://localhost/rankChat", {
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
    upVotes: Number,
    downVotes: Number
});
const Post = new mongoose.model("Post", postSchema);

//use cors middleware
//use express middleware
app.use(cors());
app.use(express.json());


app.listen(3000, () => {
    console.log("server is listening...");
});

app.get("/", (req, res) => {
    res.send("hit the root route bro");
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

app.post("/vote", async (req, res) => {
    let targetId = req.body.id;
    if(req.body.direction === "up") {
        const doc = await Post.findByIdAndUpdate({_id: targetId}, { $inc: { upVotes: 1 } });
        console.log(doc);
    } else if (req.body.direction === "down") {
        const doc = await Post.findByIdAndUpdate({_id: targetId}, { $inc: { downVotes: 1 } });
        console.log(doc);
    } else {
        console.log("neither up nor down");
    }

});

//validates post before sending to db
const postIsValid = (req) => {
    return req.name && req.name.toString().trim() !== ""
            &&
           req.post && req.post.toString().trim() !== "";
}

const postToDB = async (newPost) => {
    const post = new Post({
        user: newPost.name,
        post: newPost.post,
        date: new Date().toDateString(),
        upVotes: 0,
        downVotes: 0
    });
    const doc = await post.save();
    return doc;
}


const updateVotes = (id, direction) => {
    if(direction === "up") {
    //Post.find( { upVotes: { $eq: id } } )

    } else {
    //Post.find( { downVotes: { $eq: id } } )

    }
    console.log("updated!");
}