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

function followUser(userID)
{
    //implement follow user
    console.log(userID);
}

function fillPosts(data)
{
    for (let i = 0; i < data["posts"].length; i++)
    {
        let postContainer = document.createElement("div");
        postContainer.className = "subPosts";
        postContainer.id = `Post${data["posts"][i].id}`;

        let leftDiv = document.createElement("div");
        let rightDiv = document.createElement("div");
        leftDiv.className = "LeftDivs";
        rightDiv.className = "RightDivs";

        let followButton = document.createElement("button");
        followButton.innerHTML = "Follow User";
        followButton.className = "btn btn-primary";
        followButton.addEventListener("click", ()=>{
            followUser(data["posts"][i].postedBy_id);
        })

        let postHeader = document.createElement("h5");
        postHeader.innerHTML = (data["posts"])[i].postHeader;

        let postBody = document.createElement("p");
        postBody.innerHTML = (data["posts"])[i].postBody;

        let postDate = document.createElement("small");
        postDate.innerHTML = (data["posts"])[i].postedOn;
    
        let OP = document.createElement("h6");
        OP.innerHTML = `Posted by ${data["posters"][i]}`;

        let heart = document.createElement("h5");
        heart.addEventListener("click", () => {
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
    


