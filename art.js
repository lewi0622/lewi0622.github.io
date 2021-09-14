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
    "City",
    "Flower",
    "Escaping_Gasses",
    "Gas_Spiral"
];

// wait for DOM to be fully loaded before accessing nodes
window.onload = init;

//selector event listener
window.addEventListener('message', handleMessage, false);
function handleMessage(event) {
    //suppress relaunching modal if already visible
    if($('#exampleModal').is(':visible')){return;}

    //update iframe src to event data
    $('#modal_iframe').attr('src', event.data);
    $('#exampleModal').modal('show');

    //get modal size after show
    var modal_width = $('#exampleModal').width();
    var modal_height = $('#exampleModal').height();
    if(modal_height>modal_width){
        limiter = modal_width;
    }
    else{
        limiter = modal_height;
    };
    scale = Math.floor(limiter/400);
    if(scale==0){scale=1;};

    ifrm = document.getElementById("modal_iframe");
    ifrm.style.width = String(scale*400)+"px";
    ifrm.style.height = String(scale*(420))+"px";
    ifrm.style.overflow = "hidden";
    ifrm.setAttribute("scrolling", "no");

    ifrm.setAttribute("src", event.data+"&scale="+scale);
    console.log(ifrm);
}

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
        ifrm.style.height = "400px";
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