let base_prefix = "projects/"
let base_suffix = "/index.html?controls=true"
//matches default palette in common/utils
let current_palette = 10;

let art_id = 0;
let art_timeout = 5000;

let arts = [
    "Analog_Planet",
    "Arcs",
    "Barbed_Wire",
    "Birds",
    "Blurbs",
    "BrushStrokes",
    "Chunky_Arcs",
    "Circline",
    "City",
    "Color_Stacks",
    "Crossy_Blurbs",
    "Crowd",
    "Drift_Lines",
    "Escaping_Gasses",
    "Flower",
    "Gas_Spiral",
    "Glitter_Stacks",
    "Kaleidoscope",
    "Mt",
    "Neon_God",
    "Pasta",
    "Psychedelic_Ball",
    "Pyramid",
    "Scrambled_Matrix",
    "Scribbles",
    "Sliding_Triangles",
    "Spiral_Depths",
    "Stained_Glass",
    "Sun",
    "Suns",
    "Symmetry",
    "Tree",
    "Triangle_Stripes"
];

// wait for DOM to be fully loaded before accessing nodes
window.onload = init_page;

function setColor(palette){
    //changes color palette, keeps seeds the same
    current_palette = palette;
    arts.forEach(element => {
        iframe = document.getElementById(element);
        seed = iframe.contentDocument.getElementById('Seed')['value'];

        addr_req = base_prefix + element + base_suffix + "&colors=" + palette + "&seed=" + seed;
        iframe.setAttribute('src', addr_req);
    });
}

function init_page(){
    //create iframe element for each project in arts
    arts = shuffle(arts);
    arts.forEach(element => {
        var ifrm = document.createElement("iframe");
        var col = document.createElement("div");
        var div = document.createElement("div");

        col.appendChild(div);
        div.appendChild(ifrm);
        document.getElementById("iframe_parent").appendChild(col);

        col.setAttribute("class", "col-sm-auto");

        div.setAttribute("class", "embed-responsive embed-responsive-1by1");
        div.style.width = "400px";

        ifrm.setAttribute("class", "embed-responsive-item");
        ifrm.setAttribute("src", base_prefix + element + base_suffix);
        ifrm.setAttribute("id", element);
        ifrm.style.width = "400px";
        ifrm.style.height = "420px";
        ifrm.style.overflow = "hidden";
        ifrm.setAttribute("scrolling", "no");
    });    
    
    //initial 5 second timeout
    window.setTimeout(randomize_art, art_timeout);
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

function randomize_art(){
    //auto-randomize every second
    if(document.getElementById('flexCheckChecked').checked){
        current_art = document.getElementById(arts[art_id%arts.length]);
        addr_req = base_prefix + current_art.id + base_suffix + "?colors=" + current_palette + "&controls=true";
        current_art.setAttribute('src', addr_req);
        art_id++
    }
    //change to every second timeout
    art_timeout = 1000;
    window.setTimeout(randomize_art, art_timeout);
}

