let base_prefix = "projects/"
let base_suffix = "/index.html"
let img_scale = 2;

let arts = [
    "Endless_Symmetry",
    "GlowLines",
    "Barcode",
    "Text",
    "Horizontal_Blurbs"
];

let current_id = 0;
let seeds = Array.apply(null, Array(arts.length));
let global_color = 10;

// wait for DOM to be fully loaded before accessing nodes
window.onload = init_func;

function setColor(palette){
    global_color=palette;
    //changes color palette, keeps seeds the same
    element = arts[current_id]
    iframe = document.getElementById(element);
    seed = iframe.contentDocument.getElementById('Seed')['value'];

    addr_req = base_prefix + element + base_suffix + "?colors=" + palette + "&seed=" + seed + "&scale=" + img_scale;
    iframe.setAttribute('src', addr_req);
}

function init_func(){
    //create iframe element for each project in arts
    // arts = shuffle(arts);

    element = arts[current_id]

    var ifrm = document.getElementById("iframe")
    ifrm.setAttribute("src", base_prefix + element + base_suffix  + "?scale=" + img_scale);
    ifrm.setAttribute("id", element);
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

function change_animation(dir){
    element = arts[current_id]
    ifrm = document.getElementById(element);
    seeds[current_id] = ifrm.contentDocument.getElementById('Seed')['value'];

    //get change in id
    current_id += dir

    //wrap around indices
    if (current_id < 0){
        current_id = arts.length-1;
    }
    else if(current_id == arts.length){
        current_id = 0;
    }
    //assign new id and src
    ifrm.id = arts[current_id];

    if(seeds[current_id] != undefined){
        address = base_prefix + arts[current_id] + base_suffix + "?seed=" + seeds[current_id] + "&colors=" + global_color  + "&scale=" + img_scale;
    }
    else{
        address = base_prefix + arts[current_id] + base_suffix + "?colors=" + global_color  + "&scale=" + img_scale;
    }
    ifrm.src = address;
}
