var loadMorePostsIsRunning = false;
var getAll = document.querySelectorAll.bind(this);
var mainDiv = document.getElementById("allPosts");
var start = 0;
var end = 5;
var LOAD_AMOUNT = 5;

//first load
window.addEventListener("load", loadContent);

window.onscroll = () => {
    if (window.innerWidth + window.scrollY >= document.body.offsetHeight)
    {
        if (!loadMorePostsIsRunning)
        {
            loadContent();
        }
    }
}
function loadContent()
{
    //console.log(start)
    loadMorePostsIsRunning = true;
    fetch(`/fetch_posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        for (let i = 0; i < data["posts"].length; i++)
        {
            let postContainer = document.createElement("div");
            postContainer.className = "subPosts";
            postContainer.id = `Post${data["posts"][i].id}`;

            //load posts programmatically.
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

            postContainer.appendChild(postHeader);
            postContainer.appendChild(postBody);
            postContainer.appendChild(postDate);
            postContainer.appendChild(heart);

            postContainer.appendChild(OP);
            mainDiv.appendChild(postContainer);
        }
        
        setTimeout(()=>{
            start += LOAD_AMOUNT;
            end += LOAD_AMOUNT;
            loadMorePostsIsRunning = false;
        }, 1500);
    })

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
}

