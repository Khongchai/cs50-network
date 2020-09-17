var loadMoreListingIsRunning = false;
var getAll = document.querySelectorAll.bind(this);
var mainDiv = document.getElementById("mainDiv");
var start = 0;
var end = 4;
const LOAD_AMOUNT = 5;

//first load
document.addEventListener("DOMContentLoaded", () => {
    loadContent();
});

//load on scroll


function loadContent()
{
    //TODO - fetch_posts not working rn
    loadMoreListingIsRunning = true;
    fetch(`/fetch_posts?start=${start}&${end}`)
    .then(response => response.json())
    .then(posts => {
        for (let i = 0; i < posts.length; i++)
        {
            let postContainer = document.createElement("div");
            postContainer.id = ["post" + (i + start)];

            //TODO - load posts programmatically.
        }
        
        setTimeout(()=>{
            start += LOAD_AMOUNT;
            end += LOAD_AMOUNT;
            loadMoreListingsIsRunning = false;
        }, 1500);
    })
    
}