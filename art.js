let base_prefix = "projects/"
let base_suffix = "/index.html"

let arts = [
    "Blurbs",
    "Crowd",
    "Crossy_Blurbs",
    "Drift_Lines",
    "Arcs",
    "Pyramid",
    "Circline",
    "Barbed_Wire",
    "Chunky_Arcs",
    "Mt",
    "Scribbles",
    "Suns",
    "Sun",
    "Triangle_Stripes",
    "Birds",
    "City"
];

// wait for DOM to be fully loaded before accessing nodes
window.onload = init;

function setColor(palette){
    //changes color palette, keeps seeds the same
    arts.forEach(element => {
        iframe = document.getElementById(element);
        seed = iframe.contentDocument.getElementById('Seed')['value'];
        img_scale = 1;

        addr_req = base_prefix + element + base_suffix + "?colors=" + palette + "&seed=" + seed + "&scale=" + img_scale;
        iframe.setAttribute('src', addr_req);
    });
}

function init(){
    //create iframe element for each project in arts
    arts = shuffle(arts);
    arts.forEach(element => {
        var ifrm = document.createElement("iframe");
        document.getElementById("iframe_parent").appendChild(ifrm);

        ifrm.setAttribute("src", base_prefix + element + base_suffix);
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