let base_prefix = "projects/"
let base_suffix = "/index.html"

let arts = [
    "Blurbs",
    "Blurbs_Larger",
    "Stamp_Shapes",
    "Crossy_Blurbs",
    "Drift_Lines",
    "Arcs"
]

// wait for DOM to be fully loaded before accessing nodes
window.onload = init;

function setColor(palette){
    //changes color palette, keeps seeds the same
    arts.forEach(element => {
        iframe = document.getElementById(element);
        seed = iframe.contentDocument.getElementById('Seed')['value'];

        addr_req = base_prefix.concat(element).concat(base_suffix).concat("?colors=").concat(palette).concat("&seed=").concat(seed);
        iframe.setAttribute('src', addr_req);

    });
}

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
