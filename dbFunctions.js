const { Post } = require("./database.js");


const twilioPostToDB = async (newPost) => {
    try {
        const doc = await postToDB(newPost);
        return doc;
    }
    catch(err) {
        console.log(`Error while posting to db from Twilio: ${err}`);
    }
}

// creates new post, updates db
const postToDB = async (newPost) => {    
    try {
        const post = await new Post({
            user: newPost.name,
            post: newPost.post,
            date: new Date().toDateString(),
            voteTotal: 0
        });
        const doc = await post.save();
        return doc;
    }
    catch(err) {
        console.log(`Error while posting to db: ${err}`);
    }
}

module.exports = {
    twilioPostToDB: twilioPostToDB,
    postToDB: postToDB
}