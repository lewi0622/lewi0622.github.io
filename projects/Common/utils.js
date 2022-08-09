// "use strict";
// globals
let num_frames, capturer, hidden_controls, color_sel;

const PALETTE_ID_DEFAULT = MUTEDEARTH;
let global_palette_id = PALETTE_ID_DEFAULT;
let global_palette;

let global_scale = 1;
let cut = false;
let bleed = false;
let bleed_val = 0.25; //quarter inch bleed
const DPI_DEFAULT = 300;
let dpi = DPI_DEFAULT;
let full_controls = false;
let type;
let redraw = false;

function common_setup(gif=false, renderer=P2D, base_x=400, base_y=400){
  //override shuffle with func that uses Math.random instead of p5.js random
  over_ride_shuffle();

  //check for different base size
  if(typeof sixteen_by_nine !== "undefined"){
    if(sixteen_by_nine){
      base_x = 450;
      base_y = 800;
    }
  }

  //set up CCapture, override num_frames in setup/draw if necessary
  num_frames = capture_time*fr;
  capturer = new CCapture({format:'png', name:String(fr), framerate:fr});

  //set framerate
  if(!capture){
    frameRate(fr);
  }

  //init globals
  if(renderer == P2D){
    type="png";
  }
  else if(renderer == SVG){
    type="svg";
  }
  hidden_controls = true;

  setParams();
  seed_scale_button(base_y);
  seed = reset_drawing(seed, base_x, base_y);

  if(!full_controls){
    // disable right clicks 
    document.oncontextmenu = function() { 
      return false; 
    };
    //suppress unnecessary errors and speed up drawing time
    p5.disableFriendlyErrors = true; // disables FES
  }
  angleMode(DEGREES);

  cnv = createCanvas(canvas_x, canvas_y, renderer);
  
  //shift position to center canvas if base is different than 400
  if(base_x<=400 && base_y<=400){
    cnv.position((400*global_scale-canvas_x)/2, (400*global_scale-canvas_y)/2);
  }
  
  // gives change for square or rounded edges, this can be overriden within the draw function
  strokeCap(random([PROJECT,ROUND]));

  if(!gif){ noLoop(); }
  //else necessary when redrawing timed pieces
  else{ loop();}

  //set palette
  change_default_palette();

  //add the palette colors here because the palette only just got defined 
  show_palette_colors();

  if(!redraw){
    //post details
    message_details();

    //add listener for save messgae
    catch_save_message();
  }

  //Assists with loading on phones and other pixel dense screens
  pixelDensity(1)
}

function over_ride_shuffle(){
  //to correct for palette lengths altering 'random' behavior 
  var origShuffle = shuffle;
  shuffle = function(array, standardize=false, len=50) {
    //override p5js shuffle
    if(standardize){
      while(array.length<len){
        array.push([""]);
      }
    }
    //call original shuffle function
    array = origShuffle(array);

    return array.filter(a => !arrayEquals(a, [""]));
  }
}

function setParams(){
  //get params from url and set necessary globals

  let colors = getParamValue('colors');
  if(colors != undefined){
    if(!isPositiveIntegerOrZero(colors) || parseInt(colors)>palettes.length){
      colors = PALETTE_ID_DEFAULT;
    }
    global_palette=palettes[parseInt(colors)];
  };
  
  controls = getParamValue('controls');
  seed = getParamValue('seed');
  img_scale = getParamValue('scale');
  add_bleed = getParamValue('bleed');
  add_cut = getParamValue('cut');
  set_dpi = getParamValue('dpi');

  //If seed isn't specified, but one exists in the box, resize w/same seed
  if(seed == undefined && document.getElementById("Seed")){
    seed = document.getElementById("Seed").value;
  }

  full_controls = controls == "full" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if(controls != undefined || full_controls){
    hidden_controls = false;
  }

  if(img_scale != undefined){
    global_scale = float(img_scale);
  }
  else{
    //get scale based on window size
    global_scale = find_cnv_mult();
  }

  if(add_bleed != undefined){
    if(add_bleed.toLowerCase() != 'false'){
      bleed = true;
      if(!isNaN(add_bleed)){
        bleed_val = float(add_bleed);
      }
    }
  };
  if(add_cut != undefined){
    if(add_cut.toLowerCase() != 'false'){
      cut = true;
    }
  };
  if(set_dpi != undefined && !isNaN(set_dpi)){
    dpi = int(set_dpi);
  };
}

function getParamValue(paramName){
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) 
    {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName) 
            return pArr[1].replace(/%20/g, " "); //return value
    }
}

function seed_scale_button(base_y){
  let ids = ["Bt Left", "Seed", "Bt Right", "Custom Seed", "Color Select", "Randomize", "Color Boxes"]
  full_ids = ["Auto Scale", "Scale Box", "Save"]
  remove_controls(ids);
  remove_controls(full_ids);

  control_height = 20*global_scale;
  control_spacing = 5*global_scale;

  //START OF TOP ROW
  //left/right buttons for easy seed nav
  btLeft = createButton('<')
  btLeft.size(20*global_scale, control_height);
  btLeft.position(0, base_y*global_scale);
  btLeft.mouseClicked(function() {
    input.value(int(input.value())-1);
    set_seed();
  });
  btLeft.id('Bt Left')

  //creates controls below canvas for displaying/setting seed
  input = createInput("seed");
  input.size(55*global_scale, control_height-6);
  input.position(btLeft.size().width,base_y*global_scale);
  input.style("text-align", "right");
  input.id('Seed');

  //left/right buttons for easy seed nav
  btRight = createButton('>')
  btRight.size(20*global_scale, control_height);
  btRight.position(input.size().width + input.position().x, base_y*global_scale);
  btRight.mouseClicked(function() {
    input.value(int(input.value())+1);
    set_seed();
  });
  btRight.id('Bt Right');
  
  //custom seed button
  button = createButton("Custom Seed");
  button.mouseClicked(set_seed);
  button.size(90*global_scale, control_height)
  button.position(btRight.size().width + btRight.position().x + control_spacing, base_y*global_scale);
  button.id('Custom Seed')

  //randomize button
  randomize = createButton("Randomize");
  randomize.mouseClicked(() => {
    input.value(Math.round(random()*1000000));
    set_seed();
  })
  randomize.size(80*global_scale, control_height);
  randomize.position(400*global_scale-randomize.size().width, base_y*global_scale);
  randomize.id('Randomize')

  //START OF SECOND ROW
  //color palette select
  color_sel = createSelect();
  color_sel.position(0, base_y*global_scale+control_height);
  color_sel.size(120*global_scale, control_height);
  palette_names.forEach(name => {
    if(!exclude_palette.includes(name)){
      color_sel.option(name);
    }
  });
  color_sel.selected(palette_names[col_idx()]);

  color_sel.changed(set_seed);
  color_sel.id('Color Select')

  //color boxes
  color_div = document.createElement("div");
  color_div.id = "Color Boxes";
  document.body.appendChild(color_div);
  start_pos = color_sel.position().x + color_sel.size().width;

  //------------------------ CUTOFF FOR FULL CONTROLS ------------------------
  //START OF THIRD ROW
  //autoscale button calls url minus any scaler
  auto_scale = createButton('Autoscale');
  auto_scale.mouseClicked(() => {
    let base_url = "index.html?controls=full&colors=" + String(col_idx());
    base_url+= "&seed=" + getParamValue("seed");
    if(bleed){base_url+='&bleed=' + String(bleed_val)};
    if(dpi != DPI_DEFAULT){base_url+= "&dpi="+String(dpi)};
    if(cut){base_url += '&cut=' + String(cut)};
    window.location.replace(base_url);
  })
  auto_scale.position(0, base_y*global_scale + control_height*2);
  auto_scale.size(70*global_scale, control_height)
  auto_scale.id("Auto Scale")

  //scale text box
  scale_box = createInput('');
  scale_box.position(auto_scale.size().width+control_spacing, base_y*global_scale+control_height*2)
  scale_box.size(30*global_scale, 17*global_scale);
  scale_box.value(global_scale);
  scale_box.id("Scale Box")

  //save button
  btSave = createButton("Save");
  btSave.mouseClicked(save_drawing);
  btSave.size(70*global_scale, control_height);
  btSave.position(400*global_scale-70*global_scale, base_y*global_scale+control_height*2);
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
  //returns the integer value of the current palette
  return palette_names.indexOf(color_sel.value());
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
    elem = document.getElementById(ctrl);
    if(elem){
      elem.remove();
    }
  });
}

function show_palette_colors(){
  //can't be called in the seed_scale_button function because palette can be undefined at that point
  global_palette.forEach(c => {
    let box_bg = document.createElement("div");
    box_bg.style.position = "absolute";
    box_bg.style.left = start_pos+control_spacing+"px";
    box_bg.style.top = color_sel.position().y+"px"
    box_bg.style.width = control_height+"px";
    box_bg.style.height = control_height+"px";
    box_bg.style.backgroundColor = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')'

    let color_box = document.createElement("div");
    color_box.style.position = "absolute";
    color_box.style.left = start_pos+control_spacing+control_height*.05+"px";
    color_box.style.top = color_sel.position().y+control_height*.05+"px"
    color_box.style.width = control_height*.9+"px";
    color_box.style.height = control_height*.9+"px";
    color_box.style.backgroundColor = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'
  
    color_div.appendChild(box_bg);
    color_div.appendChild(color_box);
    start_pos += control_height*1.25;
  });
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

function save_drawing(){
  //get project name
  var project_name = window.location.pathname.split('/')[2];
  var cut_name = '';
  var bleed_name = '';
  if(bleed != false){
    bleed_name = '_bleed_' + str(bleed_val);
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

function capture_frame(capture){
  if (capture){
    capturer.capture(document.getElementById("defaultCanvas0"));
    if(frameCount-1 == num_frames){
      capturer.stop();
      capturer.save();
      noLoop();
    } 
  }
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
  const offset = canvas_y/r - 1;
  strokeWeight(offset*r);
  arc(canvas_x/2, canvas_y/2, canvas_y+(offset-1)*r, canvas_y+(offset-1)*r, 0, 360);
}


//bleed and cutline related functions
function apply_bleed(){
  // at vital print, bleed should be 0.25"
  //if bleed, resize based on size and dpi params, translate
  if(bleed){
    let bleed_border = dpi*bleed_val;
    
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

function apply_cutlines(bleed_border){
  //draw cutlines, pop before this is called
  if(bleed_border != undefined && cut){
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

function gen_n_colors(n){
  let colors = [];
  while(colors.length < n){
    const c = compare_colors(colors);
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
    redraw = true;
    setup();
    draw();
  }
}

function change_default_palette(){
  let palette_id;
  //if color is specified in URL, use that, otherwise use the provided palette_id
  if(redraw){
    palette_id = global_palette_id;
  }
  else if(getParamValue("colors") != undefined){
    palette_id = getParamValue("colors");
  }
  else if(typeof suggested_palette !== 'undefined'){
    palette_id = suggested_palette;
  }
  else{
    palette_id = PALETTE_ID_DEFAULT;
  }
  global_palette_id = palette_id;
  global_palette = palettes[global_palette_id];
  palette = JSON.parse(JSON.stringify(global_palette));
  color_sel.selected(palette_names[global_palette_id]);
}

function find_cnv_mult(){
  //a value of 401 makes it so a horizontal scroll bar never appears
  let base_x = 401;
  let base_y = 440;
  if(full_controls){
    //space for second row of controls, the extra 3 is make sure no vertical scrollbar
    base_y += 23;
  }
  //finds smallest multipler
  const x_mult = Math.round((windowWidth/base_x)*1000)/1000;
  const y_mult = Math.round((windowHeight/base_y)*1000)/1000;
  if(x_mult<y_mult){
    return constrain(x_mult, 1, 12);
  }
  else{
    return constrain(y_mult, 1, 12);
  }

}

function indexOfMin(arr) {
  // returns index of smallest value in a given array
  if (arr.length === 0) {
      return -1;
  }

  let min = arr[0];
  let minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
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

function message_details(){
  //post messgae for squarespce consumption
  var loc = window.location.pathname;
  var dir = loc.substring(0, loc.lastIndexOf('/'));
  message = JSON.stringify({
    design: dir,
    seed: seed,
    palette: palette_names[global_palette_id]
  })
  window.parent.postMessage(message, '*')
}

function catch_save_message(){
  window.addEventListener("message", (event) =>{
    if(event.data == "Save"){
      var loc = window.location.pathname;
      var dir = loc.substring(0, loc.lastIndexOf('/'));
      var palette = palette_names[default_palette];

      //send message back to parent with data URL and name
      window.parent.postMessage(JSON.stringify({
        key:[dir,seed,palette].join("_"),
        imgURL: cnv.elt.toDataURL()
      }), '*');
    }
  })
}

function isPositiveIntegerOrZero(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const num = Number(str);

  if (Number.isInteger(num) && num >= 0) {
    return true;
  }

  return false;
}

function RGBA_to_HSBA(r,g,b,a){
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100, a];
}