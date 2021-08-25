let global_palette = palettes[0];
let global_scale = 1;

function reset_values(){
  //override this function in the sketch.js to re-initialize project specific values
}

function reset_drawing(seed){
  //call draw after this if manually refreshing canvas
  canvas_x = base_x*global_scale;
  canvas_y = base_y*global_scale;

  //if no seed supplied, set random seed and pass it
  if(isNaN(seed)){
    seed = Math.round(random()*1000000);
  }
  else{
    seed = int(seed);
  }
  randomSeed(seed);
  input.value(str(seed));

  // gives change for square or rounded edges, this can be overriden within the draw function
  strokeCap(random([PROJECT,ROUND]));
  palette = JSON.parse(JSON.stringify(global_palette));

  return seed;
}

function col_idx(){
  // grab id of current color palette
  return palettes.indexOf(global_palette);
};

function randomize_action(){
  //called by clicking the Randomize button
  window.location.replace("index.html?controls=True&colors=".concat(col_idx()).concat('&scale=').concat(global_scale));
}

function set_seed(){
  //reinitializes the drawing with a specific seed

  //check if requested seed is the same as existing seed
  if(input.value()==getParamValue('seed')){
    return ;
  }

  window.location.replace("index.html?colors=".concat(col_idx()).concat("&controls=true&seed=").concat(input.value()).concat('&scale=').concat(global_scale));
}

function keyTyped() {
  // if text box is focused, and user presses enter, it sends Custom seed
  if (focused) {
    if(keyCode === ENTER){
      set_seed();
    }
  }
}

function seed_scale_button(){
  //creates controls below canvas for displaying/setting seed
  input = createInput("seed");
  input.size(100*global_scale);
  input.position(0,400*global_scale);
  input.id('Seed');
  input.elt.onfocus = function(){focused = true};
  input.elt.onblur = function(){focused = false};
  
  button = createButton("Custom Seed");
  button.mouseClicked(set_seed);
  button.position(100*global_scale, 400*global_scale);
  
  randomize = createButton("Randomize");
  randomize.mouseClicked(randomize_action)
  randomize.position(400*global_scale-randomize.size().width, 400*global_scale);
  
  show_hide_controls();
}

function reduce_array(arr, remove){
  //deletes 'remove' from a given 'arr'
  let index = arr.indexOf(remove);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function show_hide_controls(){
  //hides or shows buttons when canvas is clicked
  if(hidden_controls == true){
    input.show();
    button.show();
    randomize.show();

    hidden_controls = false;
  }
  else{
    input.hide();
    button.hide();
    randomize.hide();
    
    hidden_controls = true;
  }
}

function common_setup(){
  //init globals
  hidden_controls = false;
  save_my_canvas = false;
  //be default, we're making 400px X 400px art
  if (typeof base_x == 'undefined') {
    base_x = 400;
}
  if (typeof base_y == 'undefined'){
    base_y = 400;
  }

  //check for colors or seed values in url
  colors = getParamValue('colors');
  controls = getParamValue('controls');
  seed = getParamValue('seed');
  img_scale = getParamValue('scale');
  img_save = getParamValue('save');

  if(colors != undefined){
    global_palette=palettes[colors];
  }
  if(img_scale != undefined){
    global_scale = img_scale;
  };
  if(img_save != undefined){
    save_my_canvas = true;
  }

  if(controls != undefined){
    hidden_controls = true;
  }

  seed_scale_button();
  reset_drawing(seed);
  reset_values();
  angleMode(DEGREES);

  //handles all common setup code
  cnv = createCanvas(canvas_x, canvas_y);
  cnv.mouseClicked(show_hide_controls);
  
  noLoop();
}

function getParamValue(paramName){
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) 
    {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName) 
            return pArr[1]; //return value
    }
}

function save_drawing(){
  if(save_my_canvas==true){
    color_index = col_idx();
    filename = 'seed_'.concat(str(input.value())).concat('_color_').concat(str(color_index)).concat('_scale_').concat(str(global_scale));
    saveCanvas(filename, 'png');
  }
}

function wrap(force_x, force_y){
  //-x, -y
  if(xPos < 0 && yPos < 0){
    vertex(xPos, yPos);
    endShape();

    xPos = canvas_x;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);

    
    beginShape(shape_type);
    return;
  }

  //-x, +y
  if(xPos < 0 && yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();
    
    xPos = canvas_x;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(shape_type);
    return;
  }

  //+x, +y
  if(xPos > canvas_x && yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();
    
    xPos = 0;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(shape_type);
    return;
  }

  //+x, -y
  if(xPos > canvas_x && yPos < 0){
    vertex(xPos, yPos);
    endShape();
    
    xPos = 0;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(shape_type);
    return;
  }

  //-x
  if(xPos < 0){
    vertex(xPos, yPos);
    endShape();

    xPos = canvas_x;
    yPos = force_num(yPos, force_y);

    beginShape(shape_type);
    return;
  }
  
  //+x
  if(xPos > canvas_x){
    vertex(xPos, yPos);
    endShape();

    xPos = 0;
    yPos = force_num(yPos, force_y);

    beginShape(shape_type);
    return;
  }

  //-y
  if(yPos < 0){
    vertex(xPos, yPos);
    endShape();

    yPos = canvas_y;
    xPos = force_num(xPos, force_x);

    beginShape(shape_type);
    return;
  }
  
  //+y
  if(yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();

    yPos = 0;
    xPos = force_num(xPos, force_x);

    beginShape(shape_type);
    return;
  }
}

function force_num(pos, force){
  if(force !== undefined){
    return force;
  }
  return pos;
}