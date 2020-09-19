//first load
window.addEventListener("load", ()=>{loadContent("Following")});

window.onscroll = (e) => {
    if (window.innerWidth + window.scrollY >= document.body.offsetHeight)
    {
        if (!loadMorePostsIsRunning)
        {
            loadContent("Following");
        }
    }
}