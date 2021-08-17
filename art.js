//list of links for art
let base_url = "https://preview.p5js.org/lewi0622/embed/"

let arts = [
    "yvw22BQc-",
    "Em9UDZvvp",
    "ZuBk6qIJh",
    "c2i--pjEk"
]

window.onload = init;

function init(){
    arts.forEach(element => {
    var ifrm = document.createElement("iframe");
    document.getElementById("iframe_parent").appendChild(ifrm);

    ifrm.setAttribute("src", base_url.concat(element));
    ifrm.setAttribute("id", element);
    ifrm.style.width = "400px";
    ifrm.style.height = "420px";
    ifrm.style.overflow = "hidden";
    ifrm.setAttribute("scrolling", "no");
    });
}