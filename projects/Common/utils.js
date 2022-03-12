let global_palette = palettes[10];
let global_scale = 1;
let global_bleed = 0.25; //quarter inch bleed

function reset_values(){
  //override this function in the sketch.js to re-initialize project specific values
}

function reset_drawing(seed, base_x, base_y){
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

  palette = JSON.parse(JSON.stringify(global_palette));

  return seed;
}

function col_idx(){
  // grab id of current color palette
  return palettes.indexOf(global_palette);
};

function randomize_action(){
  //called by clicking the Randomize button
  window.location.replace("index.html?controls=True&colors=" + col_idx() + '&scale=' + scaler.value() + '&bleed=' + bleed + '&cut=' + cut);
}

function set_seed(){
  //reinitializes the drawing with a specific seed

  //check if requested seed is the same as existing seed
  if(input.value()==getParamValue('seed') && scaler.value()==getParamValue('scale') && save_my_canvas==false){
    return ;
  }

  window.location.replace("index.html?colors=" + col_idx() + "&controls=true&seed=" + input.value() + '&scale=' + scaler.value() + '&bleed=' + bleed + '&cut=' + cut + '&save=' + save_my_canvas);
}

function keyTyped() {
  // if text box is focused, and user presses enter, it sends Custom seed
  if (focused) {
    if(keyCode === ENTER){
      updateValue();
      set_seed();
    }
  }
}

function seed_scale_button(base_x, base_y){
  //creates controls below canvas for displaying/setting seed
  input = createInput("seed");
  input.style('font-size', str(10*global_scale) + 'px');
  input.size(AUTO, 14*global_scale);
  input.position(0,base_y*global_scale);
  input.id('Seed');
  
  //custom seed button
  button = createButton("Custom Seed");
  button.mouseClicked(set_seed);
  button.style('font-size', str(10*global_scale) + 'px');
  button.size(90*global_scale, 20*global_scale)
  button.position(100*global_scale, base_y*global_scale);

  //left/right buttons for easy seed nav
  btLeft = createButton('<')
  btLeft.style('font-size', str(10*global_scale) + 'px');
  btLeft.size(20*global_scale, 20*global_scale);
  btLeft.position(200*global_scale, base_y*global_scale);
  btLeft.mouseClicked(decSeed);
  btRight = createButton('>')
  btRight.style('font-size', str(10*global_scale) + 'px');
  btRight.size(20*global_scale, 20*global_scale);
  btRight.position(220*global_scale, base_y*global_scale);
  btRight.mouseClicked(incSeed);
  
  //randomize button
  randomize = createButton("Randomize");
  randomize.mouseClicked(randomize_action)
  randomize.style('font-size', str(10*global_scale) + 'px');
  randomize.size(70*global_scale, 20*global_scale);
  randomize.position(base_x*global_scale-70*global_scale, base_y*global_scale);

  //scale slider is taken as scale value when randomize/custom seed are clicked
  scaler = createSlider(1, 12, global_scale, 1);
  scaler.position(0, base_y*global_scale+20*global_scale);
  scaler.size(100*global_scale, 10*global_scale);
  scaler.input(sliderChange);

  //scale text box
  scale_box = createInput('');
  scale_box.style('font-size', str(10*global_scale) + 'px');
  scale_box.position(100*global_scale, base_y*global_scale+20*global_scale)
  scale_box.size(30*global_scale, 20*global_scale);
  scale_box.value(scaler.value());

  //save button
  btSave = createButton("Save");
  btSave.mouseClicked(saveClicked)
  btSave.style('font-size', str(10*global_scale) + 'px');
  btSave.size(70*global_scale, 20*global_scale);
  btSave.position(base_x*global_scale-70*global_scale, base_y*global_scale+20*global_scale);

  //list of all ctrls for easy show/hide
  ctrls = [input, button, randomize, scaler, scale_box, btSave, btLeft, btRight];
  show_hide_controls();
}
function decSeed(){
  input.value(int(input.value())-1);
  set_seed();
}
function incSeed(){
  input.value(int(input.value())+1);
  set_seed();
}
function updateValue(){
  //if the textbox is updated, update the slider
  scaler.value(scale_box.value())
}
function sliderChange(){
  //if the slider is changed, update the textbox
  scale_box.value(scaler.value());
}
function saveClicked(){
  save_my_canvas = true;
  updateValue();
  set_seed();
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
    for(const ctrl of ctrls){
      ctrl.show();
    }

    hidden_controls = false;
  }
  else{
    for(const ctrl of ctrls){
      ctrl.hide();
    }

    hidden_controls = true;
  }
}

function common_setup(gif=false, renderer=P2D, base_x=400, base_y=400){
  //init globals
  hidden_controls = false;
  save_my_canvas = false;
  bleed = false;
  cut = false;
  dpi = 300;
  size = {};

  setParams();
  seed_scale_button(base_x, base_y);
  seed = reset_drawing(seed, base_x, base_y);
  reset_values();
  angleMode(DEGREES);

  cnv = createCanvas(canvas_x, canvas_y, renderer);
  cnv.mouseClicked(pass_parent);
  
  // gives change for square or rounded edges, this can be overriden within the draw function
  strokeCap(random([PROJECT,ROUND]));

  if(!gif){
    noLoop();
  }
  //checking if this helps mobile performance
  pixelDensity(1)
}

function setParams(){
  //get all params if they exist
  colors = getParamValue('colors');
  controls = getParamValue('controls');
  seed = getParamValue('seed');
  img_scale = getParamValue('scale');
  img_save = getParamValue('save');
  add_bleed = getParamValue('bleed');
  add_cut = getParamValue('cut');
  set_dpi = getParamValue('dpi');

  if(colors != undefined){
    global_palette=palettes[colors];
  };
  if(img_scale != undefined){
    global_scale = int(img_scale);
  };
  if(img_save != undefined && str(img_save).toLowerCase() != 'false'){
    save_my_canvas = true;
  };
  if(controls != undefined){
    hidden_controls = true;
  };
  if(add_bleed != undefined){
    if(add_bleed.toLowerCase() != 'false'){
      bleed = float(add_bleed);
      global_bleed = bleed;
    }
  };
  if(add_cut != undefined){
    if(add_cut.toLowerCase() != 'false'){
      cut = true;
    }
  };
  if(set_dpi != undefined){
    dpi = set_dpi;
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

function save_drawing(type='png'){
  if(save_my_canvas==true){
    //get project name
    var project_name = window.location.pathname.split('/')[2];
    var cut_name = '';
    var bleed_name = '';
    if(bleed != false){
      bleed_name = '_bleed_' + str(global_bleed);
      if(cut != false){
        cut_name = 'cut';
      }
    };
    filename = str(project_name) + '_seed_' + str(input.value()) + '_color_' + str(col_idx()) + '_scale_' + str(global_scale) + bleed_name + cut_name;
    if(type == 'svg'){
      save(filename)
    }
    else{
      saveCanvas(filename, type);
    }
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
function bg(remove, force){
  if(force !== undefined){
    c = force;
  }
  else{
    c = random(palette);
  }
  background(c);
  if(remove == true){
    reduce_array(palette, c);
  };
  return c;
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

function bg_drants(x_divs, y_divs){
  // create divisions of canvas in x_divs, y_divs with various colors
  
  return;
}

//cutout features
function cutoutCircle(r){
  //pop before calling cutout
  //good from canvas_y/2 to canvas_y/...anything
  offset = canvas_y/r - 1;
  strokeWeight(offset*r);
  arc(canvas_x/2, canvas_y/2, canvas_y+(offset-1)*r, canvas_y+(offset-1)*r, 0, 360);
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
  //draw cutlines, pop before this is called
  if(bleed_border != undefined && cut == true){
    push();
    strokeWeight(1);
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

//pass window message
function pass_parent(){
  show_hide_controls();
  // window.parent.postMessage(window.location.pathname+"?controls=True&seed="+seed, window.parent.location.href);
}

function noise_matrix(rect_width, rect_height, step, rotate, reverse, min, max, pow, seed, shape){
  //creates a matrix of noise going from more likely to less. Use rotate to swap i/j. Use reverse to change noise density sides
  if(rotate==true){
    [rect_width, rect_height] = [rect_height, rect_width];
  }
  if(rotate==undefined){
    rotate=false;
  }
  if(reverse==undefined){
    reverse=false;
  }
  if(min==undefined){
    min=0;
  }
  if(max==undefined){
    max=1;
  }
  if(pow==undefined){
    pow=1;
  }
  if(seed==undefined){
    seed=0;
  }
  if(shape==undefined){
    shape=random(['square', 'circle'])
  }

  for(let i=0; i<rect_width; i+=step){
    chance = constrain(Math.pow(i/rect_width, pow), min, max);
    if(reverse==true){
      chance = 1-chance;
    }
    
    for(let j=0; j<rect_height; j+=step){
      push();
      pixel_c = random(palette);
      fill(pixel_c);

      if(rotate == true){
        translate(j, i);
      }
      else{
        translate(i, j);
      }
      if(noise((i+1)*(j+1)+seed)>chance){
        if(shape=='square'){
          square(0,0,random(step/2, step*2));
        }
        else if(shape=='circle'){
          circle(step/2, step/2 ,random(step/2, step*2));
        }
      }
      pop();
    }
  }
}

