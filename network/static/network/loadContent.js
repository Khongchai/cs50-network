var loadMoreListingIsRunning = false;
var getAll = document.querySelectorAll.bind(this);
var mainDiv = document.getElementById("allPosts");
var start = 0;
var end = 5;
var LOAD_AMOUNT = 5;

//first load
window.addEventListener("load", loadContent);


function loadContent()
{
    console.log(start)
    //TODO - fetch_posts not working rn
    loadMoreListingIsRunning = true;
    fetch(`/fetch_posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts)
        for (let i = 0; i < posts["posts"].length; i++)
        {
            let postContainer = document.createElement("div");
            postContainer.className = "subPosts";
            postContainer.id = ["post" + (i + start)];


            //TODO - load posts programmatically.
            let postHeader = document.createElement("h5");
            postHeader.innerHTML = (posts["posts"])[i].postHeader;

            let postBody = document.createElement("p");
            postBody.innerHTML = (posts["posts"])[i].postBody;

            let postDate = document.createElement("small");
            postDate.innerHTML = (posts["posts"])[i].postedOn;

            //Add posted by referencing the poster through "posters" key in JSON

            postContainer.appendChild(postHeader);
            postContainer.appendChild(postBody);
            postContainer.appendChild(postDate);
            mainDiv.appendChild(postContainer);
        }
        
        setTimeout(()=>{
            start += LOAD_AMOUNT;
            end += LOAD_AMOUNT;
            loadMoreListingsIsRunning = false;
        }, 1500);
    })

    
}

