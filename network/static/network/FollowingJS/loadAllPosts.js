//first load
window.addEventListener("load", ()=>{loadContent("All Posts")});

window.onscroll = (e) => {
    if (window.innerWidth + window.scrollY >= document.body.offsetHeight)
    {
        loadContent("All Posts");
    }
}