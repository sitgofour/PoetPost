console.log("new script attached...");

// html element selectors
const form = document.querySelector(".post-form");
const postsDiv = document.querySelector(".posts-wrapper");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formContent = new FormData(form);
    const newPost = {
        name: formContent.get("username"),
        post: formContent.get("post")
    }
    newPostToDB(newPost);    
});

const postsUrl = "http://localhost:3000/posts";
const updateUrl = "http://localhost:3000/vote";
const newPostToDB = async (newPost) => {
    try {
        await fetch(postsUrl, {
            method: "POST",
            body: JSON.stringify(newPost),
            headers: {
                "Content-Type": "application/json"
            }
        });
        queryAllPosts()
    }
    catch {
        console.log("error while posting");
    }
}

const queryAllPosts = async () => {
    const posts = await fetch(postsUrl);
    console.log(posts);
    const postsArr = await posts.json();
    console.log(postsArr);
    displayAllPosts(postsArr);
}

const displayAllPosts = (postsArr) => {
    //sort posts by votes, then iterate and display
    // const rankedPosts = sortByVotes(postsArr);
    // for(let post of rankedPosts)...

    postsDiv.innerHTML = "";

    const sortedPosts = sortPosts(postsArr);

    for(let post of sortedPosts) {
        //create wrapper elements for post elements
        let newPost = document.createElement("div");
        let voteDiv = document.createElement("div");
        let postContent = document.createElement("div");

        //create html elements for username, post, and date
        let user = document.createElement("h4");
        user.textContent = post.user;

        let postText = document.createElement("p");
        postText.textContent = post.post;

        let postDate = document.createElement("h5");
        postDate.textContent = post.date;

        postContent.appendChild(user);
        postContent.appendChild(postText);
        postContent.appendChild(postDate);

        //create html elements for upvotes and downvotes

        let voteTotal = document.createElement("p");
        voteTotal.innerText = post.voteTotal;

        let upButton = document.createElement("button");
        upButton.innerText = "up";
        upButton.addEventListener("click", castVote(post._id, "up"));

        let downButton = document.createElement("button");
        downButton.innerText = "down";
        downButton.addEventListener("click", castVote(post._id, "down"));

        
        voteDiv.appendChild(upButton);
        voteDiv.appendChild(voteTotal);
        voteDiv.appendChild(downButton);

        newPost.appendChild(postContent);
        newPost.appendChild(voteDiv);

        //Determine post background color based on voteTotal
        const bgColorClass = selectBgColor(post.voteTotal); 

        //adding relevant css classes for styling
        voteDiv.classList.add("vote-div");
        postContent.classList.add("post-content");
        newPost.classList.add("post-div");
        console.log(`"${bgColorClass}"`);
        newPost.classList.add(bgColorClass);

        upButton.classList.add("vote-button");
        downButton.classList.add("down-button");

        //append new post div to div wrapper element
        postsDiv.appendChild(newPost);
    }
}
//returns onClick function with enclosed reference to postID
const castVote = (postId, direction) => {
    return function() {
        fetch(updateUrl, {
            method: "POST",
            body: JSON.stringify({
                id: postId,
                direction: direction
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.text())
        .then(data => {
            if(data === "vote made") {
                queryAllPosts();
            }
        })
        // .then(data => console.log(data))
        .catch(err => console.log(err)) 
    }   
}

const sortPosts = (arr) => {
    return arr.sort((a,b) => (a.voteTotal <= b.voteTotal) ? 1 : -1);
}

const selectBgColor = (voteTotal) => {
    let bgColor = "";
    switch (true){
        case voteTotal > 40:
            bgColor = "green-3";
            break;
        case voteTotal > 30:
            bgColor = "green-2";
            break;
        case voteTotal > 20:
            bgColor = "green-1";
            break;
        case voteTotal > 10:
            bgColor = "yellow-1";
            break;
        case voteTotal > 0:
            bgColor = "yellow-2";
            break;
        case voteTotal > -10:
            bgColor = "orange-1";
            break;
        case voteTotal > -20:
            bgColor = "orange-2";
            break;
        case voteTotal > -30:
            bgColor = "red-1";
            break;
        case voteTotal > -40:
            bgColor = "red-2";
            break;
        case voteTotal > -Infinity:
            bgColor = "red-3";
            break;
        default: 
            bgColor = "default-bg";
            break;
    }
    console.log(bgColor);
    return bgColor;
}


//shows posts when page loads
queryAllPosts();
