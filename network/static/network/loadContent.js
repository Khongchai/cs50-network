//var getAll = document.querySelectorAll.bind(this);
var mainDiv = document.getElementById("allPosts");
var LOAD_AMOUNT = 5;
var start = 0;
var end = 5;
var submitButton = document.getElementById("submitButton");

function loadContent(page)
{
    fetch(`/fetch_posts?start=${start}&end=${end}&page=${page}`)
    .then(response => response.json())
    .then(data => {
        fillPosts(data);
        start += LOAD_AMOUNT
        end += LOAD_AMOUNT
    })
}  

function addLikes(postID)
{
    fetch("/increment_likes", {
        method: "POST",
        body: postID
    })
    .then(response => response.json())
    .then(data => 
    {
        document.getElementById(`heart${postID}`).innerHTML = data.newLikes;
    })
}

function followUser(posterID)
{
    let buttonsOnThisUserPost = document.querySelectorAll(`.followUserButtons[posterID=${CSS.escape(posterID)}]`);
    fetch("/follow_user", {
        method: "POST",
        body: posterID
    })
    .then(response =>{
        if (response.status === 204)
        {
            buttonsOnThisUserPost.forEach((button) => {
                if (button.innerHTML == "Follow User")
                {
                    button.innerHTML = "Unfollow User";
                }
                else
                {
                    button.innerHTML = "Follow User";
                }
            })
        }
    })
    
}

function fillPosts(data)
{
    for (let i = 0; i < data["posts"].length; i++)
    {
        //id of OP
        let posterID = data["posts"][i].postedBy_id;

        //id of people the current user is following
        let usersFollowedID = data["usersFollowedID"];

        let postContainer = document.createElement("div");
        postContainer.className = "subPosts";
        postContainer.id = `${data["posts"][i].id}`;
        postContainer.onclick = () => {
            let postColor = window.getComputedStyle(postContainer).getPropertyValue("background-color");
            goToPost(postContainer.id, postColor);
        }

        let leftDiv = document.createElement("div");
        let rightDiv = document.createElement("div");
        leftDiv.className = "LeftDivs";
        rightDiv.className = "RightDivs";

        let followButton = setButtonText(posterID, usersFollowedID);
        followButton.addEventListener("click", function(event){
            event.stopPropagation();
            followUser(posterID);
            
            
        });
        
        let postHeader = document.createElement("h5");
        postHeader.innerHTML = (data["posts"])[i].postHeader;

        let postBody = document.createElement("p");
        postBody.innerHTML = (data["posts"])[i].postBody;

        let postDate = document.createElement("small");
        postDate.innerHTML = (data["posts"])[i].postedOn;
    
        let OP = document.createElement("h6");
        OP.innerHTML = `Posted by ${data["posters"][i]}`;

        let heart = document.createElement("h5");
        heart.style.width = "fit-content";
        heart.addEventListener("click", (e) => {
            e.stopPropagation();
            addLikes(data["posts"][i].id)
        });
        heart.innerHTML = `<span class="pointerCursor">&#10084;</span> 
                            <span id="heart${data["posts"][i].id}" >${data["posts"][i].likes} </span>`;

        leftDiv.appendChild(postHeader);
        leftDiv.appendChild(postBody);
        leftDiv.appendChild(postDate);
        leftDiv.appendChild(heart);
        leftDiv.appendChild(OP);
        rightDiv.appendChild(followButton);


        postContainer.appendChild(leftDiv);
        postContainer.appendChild(rightDiv);

        mainDiv.appendChild(postContainer);
    }

}

function setButtonText(posterID, userFollowedID)
{
    let followButton = document.createElement("button");
    followButton.setAttribute("posterID", posterID);
    if (userFollowedID.includes(posterID))
    {
        followButton.innerHTML = "Unfollow User"
    }
    else
    {
        followButton.innerHTML = "Follow User";
    }
    followButton.className = "btn btn-primary";
    followButton.classList.add("followUserButtons");
    return followButton
}

function goToPost(postID, postColor)
{
    //TODO show user an overlay page where they can leave comments
    fetch(`/user_info?postID=${parseInt(postID)}`)
    .then(response => response.json())
    .then(data => {
        let overlayBG = document.createElement("div");
        overlayBG.id = "overlay";
        overlayBG.onclick = function()
        {
            overlayBG.remove();
        }
        
        let editPostBG = document.createElement("div");
        editPostBG.id = "editPostBG";
        editPostBG.style.backgroundColor = postColor;
        editPostBG.className = "HideScroll";
        editPostBG.onclick = (event) => {event.stopPropagation()};

        let postHeader = document.createElement("h3");
        postHeader.className = "headerComment";
        let postBody = document.createElement("p");
        postBody.className = "bodyComment";
        let postedBy = document.createElement("h6");
        postedBy.className = "posterComment";
        
        postHeader.innerHTML = data.postHeader;
        postBody.innerHTML = data.postBody;
        postedBy.innerHTML = `Posted by: ${data.postedBy}`;

        let comments = document.createElement('div');
        if (data.commentsOnThisPost.length > 0)
        {
            data.commentsOnThisPost.forEach(comment => {
                let commentContainer = document.createElement('div');
                let commenter = document.createElement("h5");
                commenter.innerHTML = `${comment.commentedBy} said:`;
                let commentBody = document.createElement('p');
                commentBody.style.marginBottom = 0;
                commentBody.innerHTML = comment.commentBody;
                let date = document.createElement("p");
                date.innerHTML = `${comment.commentedWhen}`;
                date.style.marginBottom = "1.6 rem";
                date.style.fontSize = "10px";
                date.className = "bodyComment";

                commentContainer.appendChild(commenter);
                commentContainer.appendChild(commentBody);
                commentContainer.appendChild(date);
                comments.appendChild(commentContainer)
            });
        }
        else
        {
            comments.innerHTML = "No comments yet";
        }

///////////////////////////////////////////////////////////////////////

        let addComments = document.createElement("div");
        let comment = document.createElement("form");
        comment.onsubmit = (e) => {
            e.preventDefault();
            addComment(commentField.value, postID);
        }
        let commentField = document.createElement("textarea");
        commentField.className = "inputSize";
        let submitButton = document.createElement("input");

        comment.method = "POST";

        commentField.type = "text";
        commentField.name = "newComment";
        submitButton.type = "submit";
        submitButton.value = "Post Commet";
        submitButton.className = "btn btn-primary";

        comment.appendChild(commentField);
        comment.appendChild(submitButton);
        addComments.appendChild(comment);

/////////////////////////////////////////////////////////////////

        editPostBG.appendChild(postHeader);
        editPostBG.appendChild(postBody);
        editPostBG.appendChild(postedBy);
        editPostBG.appendChild(comments);
        editPostBG.appendChild(addComments);
        overlayBG.appendChild(editPostBG);
        mainDiv.appendChild(overlayBG);
    });


}

function addComment(newComment, postID)
{
    
    const csrftoken = getCookie('csrftoken');
    const request = new Request(
        "/add_comment",
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {
        method: "POST",
        body: JSON.stringify({"newComment": newComment, "postID": postID}),
        mode: "same-origin"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//BIG TODO
//Deploy this somewhere




