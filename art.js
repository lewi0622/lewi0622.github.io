let base_prefix = "projects/"
let base_suffix = "/index.html"

let arts = [
    "Blurbs",
    "Crowd",
    "Stamp_Shapes",
    "Crossy_Blurbs",
    "Drift_Lines",
    "Arcs",
    "Pyramid",
    "Circline",
    "Barbed_Wire",
    "Chunky_Arcs",
    "Mt"
];

// wait for DOM to be fully loaded before accessing nodes
window.onload = init;

function setColor(palette){
    //changes color palette, keeps seeds the same
    arts.forEach(element => {
        iframe = document.getElementById(element);
        seed = iframe.contentDocument.getElementById('Seed')['value'];
        img_scale = 1;

        addr_req = base_prefix.concat(element).concat(base_suffix).concat("?colors=").concat(palette).concat("&seed=").concat(seed).concat("&scale=").concat(img_scale);
        iframe.setAttribute('src', addr_req);
    });
}

function init(){
    //create iframe element for each project in arts
    // arts = shuffle(arts);
    arts.forEach(element => {
        var ifrm = document.createElement("iframe");
        document.getElementById("iframe_parent").appendChild(ifrm);
        // console.log(document.getElementById('defaultCanvas0'))

        ifrm.setAttribute("src", base_prefix.concat(element).concat(base_suffix));
        ifrm.setAttribute("id", element);
        ifrm.style.width = "400px";
        ifrm.style.height = "420px";
        ifrm.style.overflow = "hidden";
        ifrm.setAttribute("scrolling", "no");
    });
}

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}