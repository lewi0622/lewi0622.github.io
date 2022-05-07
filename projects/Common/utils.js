let palette_names = [
  "Sage and Citrus", "Beach Day", "Cotton Candy", "Bumblebee", "Minty",
  "Game Day", "Birds of Paradise", "Deathloop", "Summertime", "Southwest", "Muted Earth",
  "Nursery", "60s", "Oasis", "Supperware", "Jazz Cup"];
let exclude_palette = ["Minty", "Deathloop"]
let default_palette = 10;
let global_palette;
let global_scale = 1;
let global_bleed = 0.25; //quarter inch bleed
let full_controls = false;
let type;

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

  return seed;
}

function col_idx(){
  return palette_names.indexOf(color_sel.value())
}

function set_seed(){
  //reinitializes the drawing with a specific seed

  //check if requested seed is the same as existing seed
  if(input.value()==getParamValue('seed') && scale_box.value()==getParamValue('scale') && col_idx()==getParamValue('colors')){
    return ;
  }

  //check if no scale in url, and if no change in scale
  if(getParamValue('scale') == undefined && find_cnv_mult() == float(scale_box.value())){
    window.location.replace("index.html?colors=" + col_idx() + "&controls=" + getParamValue("controls") + "&seed=" + input.value() + '&bleed=' + bleed + '&cut=' + cut);
  }
  else{
    window.location.replace("index.html?colors=" + col_idx() + "&controls=" + getParamValue("controls") + "&seed=" + input.value() + "&scale=" + scale_box.value() + '&bleed=' + bleed + '&cut=' + cut);
  }

}

function keyTyped() {
  // if text box is focused, and user presses enter, it sends Custom seed
  if (focused) {
    if(keyCode === ENTER){
      set_seed();
    }
  }
}

function remove_controls(arr){
  arr.forEach(ctrl => {
    elem = document.getElementById(ctrl)
    if(elem){
      elem.remove();
    }
  });
}


function seed_scale_button(base_y){
  ids = ["Seed", "Custom Seed", "Color Select", "Randomize"]
  full_ids = ["Auto Scale", "Scale Box", "Bt Left", "Bt Right", "Save"]
  remove_controls(ids);
  remove_controls(full_ids);

  control_height = 20*global_scale;
  control_spacing = 5*global_scale;

  //creates controls below canvas for displaying/setting seed
  input = createInput("seed");
  input.size(80*global_scale, control_height - 7*global_scale);
  input.position(0,base_y*global_scale+global_scale);
  input.id('Seed');
  
  //custom seed button
  button = createButton("Custom Seed");
  button.mouseClicked(set_seed);
  button.size(90*global_scale, control_height)
  button.position(input.size().width + control_spacing, base_y*global_scale);
  button.id('Custom Seed')

  //color palette select
  color_sel = createSelect();
  color_sel.position(button.position().x + button.size().width + control_spacing, base_y*global_scale);
  color_sel.size(135*global_scale, control_height);
  palette_names.forEach(name => {
    if(!exclude_palette.includes(name)){
      color_sel.option(name);
    }
  });
  if(colors != undefined){
    color_sel.selected(palette_names[colors]);
  }

  color_sel.changed(set_seed);
  color_sel.id('Color Select')

  //randomize button
  randomize = createButton("Randomize");
  randomize.mouseClicked(function (){
    input.value(Math.round(random()*1000000));
    set_seed();
  })
  randomize.size(400*global_scale - (color_sel.position().x + color_sel.size().width + control_spacing), control_height);
  randomize.position(color_sel.position().x + color_sel.size().width + control_spacing, base_y*global_scale);
  randomize.id('Randomize')

  //------------------------ CUTOFF FOR FULL CONTROLS ------------------------
  //autoscale button calls url minus any scaler
  auto_scale = createButton('Autoscale');
  auto_scale.mouseClicked(function (){
    window.location.replace("index.html?controls=True&colors=" + col_idx() + '&bleed=' + bleed + '&cut=' + cut + "&seed=" + getParamValue("seed"));
  })
  auto_scale.position(0, base_y*global_scale + control_height);
  auto_scale.size(70*global_scale, control_height)
  auto_scale.id("Auto Scale")


  //scale text box
  scale_box = createInput('');
  scale_box.position(auto_scale.size().width+control_spacing, base_y*global_scale+control_height)
  scale_box.size(30*global_scale, 17*global_scale);
  scale_box.value(global_scale);
  scale_box.id("Scale Box")

  //left/right buttons for easy seed nav
  btLeft = createButton('<')
  btLeft.size(20*global_scale, control_height);
  btLeft.position(scale_box.size().width + scale_box.position().x +control_spacing, base_y*global_scale + control_height);
  btLeft.mouseClicked(function() {
    input.value(int(input.value())-1);
    set_seed();
  });
  btLeft.id('Bt Left')
  btRight = createButton('>')
  btRight.size(20*global_scale, control_height);
  btRight.position(btLeft.size().width + btLeft.position().x, base_y*global_scale + control_height);
  btRight.mouseClicked(function() {
    input.value(int(input.value())+1);
    set_seed();
  });
  btRight.id('Bt Right')

  //save button
  btSave = createButton("Save");
  btSave.mouseClicked(save_drawing);
  btSave.size(70*global_scale, control_height);
  btSave.position(400*global_scale-70*global_scale, base_y*global_scale+control_height);
  btSave.id("Save")

  //style all ctrls
  ids.concat(full_ids).forEach(id => {
    elem = document.getElementById(id)
    if(elem){
      elem.style.fontSize = str(12*global_scale) + 'px';
    }
  });

  show_hide_controls(ids, hidden_controls);
  show_hide_controls(full_ids, !full_controls);
}

function reduce_array(arr, remove){
  //deletes 'remove' from a given 'arr'
  let index = arr.indexOf(remove);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function show_hide_controls(arr, hide){
  arr.forEach(ctrl => {
    elem = document.getElementById(ctrl)
    if(elem){
      if(hide){
        elem.style.visibility = "hidden"
      }
      else{
        elem.style.visibility = "visible"
      }
    }
  });
}

function common_setup(gif=false, renderer=P2D, base_x=400, base_y=400){
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
    full_controls=true;
  }
  global_scale = find_cnv_mult();

  //init globals
  if(renderer == P2D){
    type="png";
  }
  else if(renderer == SVG){
    type="svg";
  }
  hidden_controls = true;
  bleed = false;
  cut = false;
  dpi = 300;

  setParams();
  seed_scale_button(400);
  seed = reset_drawing(seed, base_x, base_y);
  angleMode(DEGREES);
  change_default_palette(default_palette);

  cnv = createCanvas(canvas_x, canvas_y, renderer);
  
  //shift position to center canvas if base is different than 400
  cnv.position((400*global_scale-canvas_x)/2, (400*global_scale-canvas_y)/2);
  
  // gives change for square or rounded edges, this can be overriden within the draw function
  strokeCap(random([PROJECT,ROUND]));

  if(!gif){
    noLoop();
  }
  else{
    loop();
  }
  //Assists with loading on phones and other pixel dense screens
  pixelDensity(1)
}

function setParams(){
  //get all params if they exist
  colors = getParamValue('colors');
  controls = getParamValue('controls');
  full_controls = controls == "full" || full_controls;
  seed = getParamValue('seed');
  img_scale = getParamValue('scale');
  add_bleed = getParamValue('bleed');
  add_cut = getParamValue('cut');
  set_dpi = getParamValue('dpi');

  if(seed != undefined && seed != "undefined"){
    //strips out whitespace %20 characters from seed
    seed = seed.replace(/%20/g, "")
  }
  else if(document.getElementById("Seed")){
    seed = document.getElementById("Seed").value;
  }
  if(colors != undefined){
    global_palette=palettes[colors];
  };
  if(img_scale != undefined){
    global_scale = float(img_scale);
  }

  if(controls != undefined || full_controls){
    hidden_controls = false;
  }
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

function save_drawing(){
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


function capture_start(capture){
  //called from top of Draw to start capturing, requires CCapture
  if(capture && frameCount==1) capturer.start();
}

function capture_frame(capture, num_frames){
  if (capture){
    capturer.capture(document.getElementById("defaultCanvas0"));
    if(frameCount-1 == num_frames){
      capturer.stop();
      capturer.save();
      noLoop();
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
  // gets color at pixel x,y. Aboslute coordinates because the get function is some shit
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

function gen_n_colors(n){
  colors = [];
  while(colors.length < n){
    c = compare_colors(colors);
    colors.push(c);
  }
  return colors;
}

function compare_colors(arr){
  //compares new color to arr of colors to generate a random color for an arbitrary number of layers for saxi
  if(arr.length == 0){
    return generate_color();
  }
  color_match=true;
  while(color_match){
    c = generate_color();
    arr.forEach(element => {
      if(element == c){
        color_match = true;
      }
      else{
        color_match = false;
      }
    });
  }
  return c;
}

function generate_color(){
  //generates random color with full alpha value
  r = random(255)
  g = random(255)
  b = random(255)
  a = 255
  return(color(r,g,b,a))
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function windowResized() {
  if(getParamValue('scale') == undefined && find_cnv_mult() != global_scale){
    setup();
    draw();
  }
}

function change_default_palette(palette_id){
  if(getParamValue('colors') != undefined){
    palette_id = int(getParamValue('colors'));
  }
  default_palette = palette_id;
  global_palette = palettes[palette_id];
  palette = [...global_palette];
  color_sel.selected(palette_names[default_palette]);
}

function find_cnv_mult(){
  let base_x = 400;
  let base_y = 420;
  if(full_controls){
    //space for second row of controls, the extra 1 is make sure no scrollbar
    base_y += 21;
  }
  //finds smallest multipler
  x_mult = Math.round((windowWidth/base_x)*1000)/1000;
  y_mult = Math.round((windowHeight/base_y)*1000)/1000;
  if(x_mult<y_mult){
    return constrain(x_mult, 1, 12);
  }
  else{
    return constrain(y_mult, 1, 12);
  }

}

function indexOfMin(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var min = arr[0];
  var minIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] < min) {
          minIndex = i;
          min = arr[i];
      }
  }
  return minIndex;
}

function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }
  return maxIndex;
}