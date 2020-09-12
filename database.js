const mongoose = require("mongoose");

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

module.exports = {
    Post: Post,
    connectToDb: connectToDb
}