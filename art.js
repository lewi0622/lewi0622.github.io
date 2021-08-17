//list of links for art
// let base_url = "https://preview.p5js.org/lewi0622/embed/"
let base_prefix = "projects/"
let base_suffix = "/index.html"

let arts = [
    "Blurbs",
    "Blurbs_Larger",
    "Stamp_Shapes",
    "Crossy_Blurbs",
    "Drift_Lines"
]

// wait for DOM to be fully loaded before accessing nodes
window.onload = init;

function init(){
    //create iframe element for each project in arts
    arts.forEach(element => {
        var ifrm = document.createElement("iframe");
        document.getElementById("iframe_parent").appendChild(ifrm);

        ifrm.setAttribute("src", base_prefix.concat(element).concat(base_suffix));
        ifrm.setAttribute("id", element);
        ifrm.style.width = "400px";
        ifrm.style.height = "420px";
        ifrm.style.overflow = "hidden";
        ifrm.setAttribute("scrolling", "no");
    });
}