let base_prefix = "../projects/";
let base_plotter_prefix = "../plotter_projects/";
let base_suffix = "/index.html?controls=false";
//matches default palette in common/utils
let current_palette = 10;

let art_id = 0;
let art_timeout = 5000; //in milliseconds

let arts = all_projects_full_paths;
for(let i=0; i<arts.length-1; i++){
    arts[i]["iframe"] = arts[i]["iframe"].replace("https://lewi0622.github.io", "..")
    arts[i]["iframe"] = arts[i]["iframe"].replace("controls=true", "controls=false");
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
        ifrm.setAttribute("src", arts[i]["iframe"]);
        ifrm.setAttribute("id", "art_"+i);
        ifrm.style.zIndex = i;
        ifrm.setAttribute("scrolling", "no");
    }
    
    //initial 10 second timeout
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
        art_1.setAttribute("src", arts[0]["iframe"]);
    }
    else{
        art_1.style.zIndex = 1;
        art_0.style.zIndex = 0;
        art_0.setAttribute("src", arts[0]["iframe"]);
    }

    window.setTimeout(randomize_art, art_timeout);
}

