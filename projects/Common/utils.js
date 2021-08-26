let global_palette = palettes[0];
let global_scale = 1;
let global_bleed = 0.25; //quarter inch bleed

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
  noiseSeed(seed);
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
  input.style('font-size', str(10*global_scale).concat('px'))
  input.size(AUTO, 14*global_scale);
  input.position(0,400*global_scale);
  input.id('Seed');
  
  input.elt.onfocus = function(){focused = true};
  input.elt.onblur = function(){focused = false};
  
  button = createButton("Custom Seed");
  button.mouseClicked(set_seed);
  button.style('font-size', str(10*global_scale).concat('px'))
  button.size(90*global_scale, 20*global_scale)
  button.position(100*global_scale, 400*global_scale);
  
  randomize = createButton("Randomize");
  randomize.mouseClicked(randomize_action)
  randomize.style('font-size', str(10*global_scale).concat('px'))
  randomize.size(70*global_scale, AUTO)
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
  bleed = false;
  dpi = 300;
  size = {};

  //be default, we're making 400px X 400px art
  if (typeof base_x == 'undefined') {
    base_x = 400;
}
  if (typeof base_y == 'undefined'){
    base_y = 400;
  }

  setParams();
  seed_scale_button();
  reset_drawing(seed);
  reset_values();
  angleMode(DEGREES);

  //handles all common setup code
  cnv = createCanvas(canvas_x, canvas_y);
  cnv.mouseClicked(show_hide_controls);
  
  noLoop();
}

function setParams(){
  //get all params if they exist
  colors = getParamValue('colors');
  controls = getParamValue('controls');
  seed = getParamValue('seed');
  img_scale = getParamValue('scale');
  img_save = getParamValue('save');
  add_bleed = getParamValue('bleed');
  set_dpi = getParamValue('dpi');
  sizeX = getParamValue('sizeX');
  sizeY = getParamValue('sizeY');

  if(colors != undefined){
    global_palette=palettes[colors];
  };
  if(img_scale != undefined){
    global_scale = img_scale;
  };
  if(img_save != undefined){
    save_my_canvas = true;
  };
  if(controls != undefined){
    hidden_controls = true;
  };
  if(add_bleed != undefined){
    bleed = true;
  };
  if(set_dpi != undefined){
    dpi = set_dpi;
  };
  if(sizeX != undefined){
    size.x = int(sizeX);
  };
  if(sizeY != undefined){
    size.y = int(sizeY);
  };
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


//background functions
function bg(remove){
  bg = random(palette);
  background(bg);
  if(remove == true){
    reduce_array(palette, bg);
  };
};
function bg_vertical_strips(strips){
  push();
  noStroke();
  translate(-canvas_x/2, -canvas_y/2)
  for(let i=0; i<strips; i++){
    fill(random(palette));
    rect(0, 0, canvas_x*2, canvas_y*2);
    if(i==0){
      translate(canvas_x/2,0);
    }
    translate(floor(canvas_x/strips), 0);
  }
  pop();
}

function bg_horizontal_strips(strips){
  push();
  noStroke();
  translate(-canvas_x/2, -canvas_y/2)
  for(let i=0; i<strips; i++){
    fill(random(palette));
    rect(0, 0, canvas_x*2, canvas_y*2);
    if(i==0){
      translate(0,canvas_y/2);
    }
    translate(0, floor(canvas_y/strips));
  }
  pop();
}

function bg_center_ellipse(){
  bg();
  push();
  noStroke();
  fill(random(palette));
  ellipse(canvas_x/2, canvas_y/2, canvas_x, canvas_y);
  pop();
}

//bleed and cutline related functions
function apply_bleed(){
  // at vital print, bleed should be 0.25"
  //if bleed, resize based on size and dpi params, translate
  if(bleed&&dpi){
    bleed_border = dpi*global_bleed;
    
    total_canvas_x = canvas_x + bleed_border*2;
    total_canvas_y = canvas_y + bleed_border*2;
    resizeCanvas(total_canvas_x, total_canvas_y);

    //move origin to within bleed lines
    translate((total_canvas_x-canvas_x)/2, (total_canvas_y-canvas_y)/2);

    return bleed_border;
  }
}

function get_invert_stroke(x, y){
  // gets color at pixel x,y. Aboslue coordinates because the get function is some shit
  c = get(x, y)

  //transparent case
  if(c[3]==0){
    c=[0, 0, 0, 255];
  }
  else{
    // inverts a given RGB value
    c[0] = 255 - c[0]; //R
    c[1] = 255 - c[1]; //G
    c[2] = 255 - c[2]; //B
    c[3] = 255; //alpha
  }

  stroke(c);
}

function apply_cutlines(){
  //draw cutlines
  if(bleed_border != undefined){
    push();
    //move coords back to upper left because get function uses absolute coords
    translate(-bleed_border, -bleed_border)
    //upper left going clockwise.
    get_invert_stroke(0, bleed_border);
    line(0, bleed_border, bleed_border/2, bleed_border);
    get_invert_stroke(bleed_border, 0);
    line(bleed_border, 0, bleed_border, bleed_border/2);
    //upper right
    get_invert_stroke(width-bleed_border, 0);
    line(width-bleed_border, 0, width-bleed_border, bleed_border/2);
    get_invert_stroke(width-1, bleed_border);
    line(width-1, bleed_border, width-bleed_border/2, bleed_border);
    //lower right
    get_invert_stroke(width-1, height- bleed_border);
    line(width-1, height- bleed_border, width-bleed_border/2, height-bleed_border);
    get_invert_stroke(width-bleed_border, height-1);
    line(width-bleed_border, height-1, width-bleed_border, height-bleed_border/2);
    //lower left
    get_invert_stroke(bleed_border, height-1);
    line(bleed_border, height-1, bleed_border, height-bleed_border/2);
    get_invert_stroke(0, height-bleed_border);
    line(0, height-bleed_border, bleed_border/2, height-bleed_border);

    pop();
  }
}