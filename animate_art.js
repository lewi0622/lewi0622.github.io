let base_prefix = "projects/"
let base_suffix = "/index.html"

let arts = [
    "GlowLines",
    "Barcode",
    "Text",
    "Horizontal_Blurbs"
];

let current_id = 0;
let seeds = Array.apply(null, Array(arts.length));
let global_color = 10;

// wait for DOM to be fully loaded before accessing nodes
window.onload = init;

function setColor(palette){
    global_color=palette;
    //changes color palette, keeps seeds the same
    element = arts[current_id]
    iframe = document.getElementById(element);
    seed = iframe.contentDocument.getElementById('Seed')['value'];
    img_scale = 1;

    addr_req = base_prefix + element + base_suffix + "?colors=" + palette + "&seed=" + seed + "&scale=" + img_scale;
    iframe.setAttribute('src', addr_req);
}

function init(){
    //create iframe element for each project in arts
    arts = shuffle(arts);

    element = arts[current_id]
    var ifrm = document.createElement("iframe");
    var carousel_item = document.createElement("div");
    var col = document.createElement("div");
    var row = document.createElement("div");
    var div = document.createElement("div");

    carousel_item.appendChild(row);
    row.appendChild(col)
    col.appendChild(div);
    div.appendChild(ifrm);
    document.getElementById("iframe_parent").appendChild(carousel_item);

    carousel_item.setAttribute("class", "carousel-item active");
    col.setAttribute("class", "col-sm-auto");
    row.setAttribute("class", "row justify-content-md-center")

    div.setAttribute("class", "embed-responsive embed-responsive-1by1");
    div.style.width = "400px";

    ifrm.setAttribute("class", "embed-responsive-item");
    ifrm.setAttribute("src", base_prefix + element + base_suffix);
    ifrm.setAttribute("id", element);
    ifrm.style.width = "400px";
    ifrm.style.height = "420px";
    ifrm.style.overflow = "hidden";
    ifrm.setAttribute("scrolling", "no");
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
        address = base_prefix + arts[current_id] + base_suffix + "?seed=" + seeds[current_id] + "&colors=" + global_color;
    }
    else{
        address = base_prefix + arts[current_id] + base_suffix + "?colors=" + global_color;
    }
    ifrm.src = address;
}
