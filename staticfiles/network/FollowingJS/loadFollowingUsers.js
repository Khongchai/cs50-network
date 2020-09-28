//first load
window.addEventListener("load", ()=>{loadContent("FollowingUsers")});

window.onscroll = (e) => {
    if (window.innerWidth + window.scrollY >= document.body.offsetHeight)
    {
        loadContent("FollowingUsers");
    }
}