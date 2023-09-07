let base_prefix = "../projects/";
let base_plotter_prefix = "../plotter_projects/";
let base_suffix = "/index.html?controls=false";
//matches default palette in common/utils
let current_palette = 10;

let art_id = 0;
let art_timeout = 10000; //10 seconds

let plotter_arts = [
    "Whiplash_Animated"
];

let arts = [
    "90s",
    "Alhambra/Square_Stars",
    "Analog_Planet",
    "Angel_Hair_Pasta",
    "Arcs",
    "Bacterium",
    "Barbed_Wire",
    "Birds",
    "Blurbs",
    "BrushStrokes",
    "Calligraphy",
    "Cat_Flows",
    "Chunky_Arcs",
    "Circle_Grids",
    "Circle_to_Square",
    "Circline",
    "City",
    "Cloudy_Day",
    "Color_Stacks",
    "Crossy_Blurbs",
    "Crowd",
    "Depth_Charge",
    "Desert_Drive",
    "Drift_Lines",
    "Endless_Symmetry",
    "Enlarging_Squares",
    "Escaping_Gasses",
    "Fine_Symmetry",
    "Floral_Wallpaper",
    "Flower",
    "Gas_Spiral",
    "Glitter_Stacks",
    "Kaleidoscope",
    "Kingly",
    "Letter_to_the_Editor",
    "Mt",
    "Neon_God",
    "Origami",
    "Paper_Bouquet",
    "Pasta",
    "Perlin_Landscape",
    "Perlin_Swirl",
    "Pixel_Pollock",
    "Psychedelic_Ball",
    "Pyramid",
    "Scrambled_Matrix",
    "Scribbles",
    "Sliding_Triangles",
    "Spiral_Depths",
    "Stained_Glass",
    "Starburst",
    "Sun",
    "Suns",
    "Swimmers",
    "Symmetry",
    "Tree",
    "Triangle_Stripes",
    "Venetian_Blinds",
    "Worm_Symmetry"
];
for(let i=0; i<arts.length; i++){
    arts[i] = base_prefix + arts[i] + base_suffix;
}
for(let i=0; i<plotter_arts.length; i++){
    arts.push(base_plotter_prefix + plotter_arts[i] + base_suffix);
}

// wait for DOM to be fully loaded before accessing nodes
window.onload = init_page;

function init_page(){
    //create iframe elements for two z-stacked pieces
    arts = shuffle(arts);
    for(let i=0; i<2; i++){
        var ifrm = document.createElement("iframe");
        document.getElementById("iframe_parent").appendChild(ifrm);
        ifrm.setAttribute("frameBorder", "0");
        ifrm.setAttribute("src", arts[i]);
        ifrm.setAttribute("id", "art_"+i);
        console.log(window.innerWidth, window.innerHeight);
        ifrm.style.width = window.innerWidth + "px";
        ifrm.style.height = window.innerHeight + "px";
        ifrm.style.background = "#FFFFFF";
        ifrm.style.display = "block";
        ifrm.style.zIndex = i;
        ifrm.style.position = "absolute";
        ifrm.setAttribute("scrolling", "no");
    }
    
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
    //swap between the two arts using zIndex
    arts = shuffle(arts);
    let art_0 = document.getElementById("art_0");
    let art_1 = document.getElementById("art_1");
    if(art_0.style.zIndex == 0){
        art_0.style.zIndex = 1;
        art_1.style.zIndex = 0;
        art_1.setAttribute("src", arts[0]);
    }
    else{
        art_1.style.zIndex = 1;
        art_0.style.zIndex = 0;
        art_0.setAttribute("src", arts[0]);
    }

    window.setTimeout(randomize_art, art_timeout);
}

