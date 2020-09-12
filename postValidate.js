
//validates post before sending to db
const postIsValid = (req) => {
    return req.name && req.name.toString().trim() !== ""
            &&
           req.post && req.post.toString().trim() !== "";
}

const twilioPostIsValid = (newPost) => {
    return newPost.name && newPost.name.toString().trim() !== ""
            &&
           newPost.post && newPost.post.toString().trim() !== "";
}

module.exports = {
    postIsValid: postIsValid,
    twilioPostIsValid: twilioPostIsValid
}
