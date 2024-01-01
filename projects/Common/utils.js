"use strict";
// globals
const project_path = window.location.pathname.split('/')
let project_name = project_path[project_path.length-2];
let canvas_x, canvas_y, cnv;
let file_saved;

let num_frames, capturer, capture_state, seed;
//control variables
let seed_input, scale_box, control_height, control_spacing, hidden_controls, color_sel, color_div;
let btLeft, btRight, button, reset_palette, randomize, auto_scale, reset_parameters, btSave, radio_filetype;

const PALETTE_ID_DEFAULT = MUTEDEARTH;

//if a project doesn't supply an array of suggested palettes, we use the default
let global_palette_id = PALETTE_ID_DEFAULT;
let global_palette, palette, working_palette, suggested_palettes;

let global_scale = 1;
let multiplier_changed = false;
let cut = false;
let bleed = false;
let bleed_val = 0.25; //quarter inch bleed
let bleed_border;
const DPI_DEFAULT = 300;
let dpi = DPI_DEFAULT;
let full_controls = false;
let in_iframe = window.location !== window.parent.location;
let type;
let redraw = false;

//gui vars
let gui_created = false;
let redraw_reason;
var gui;
let gui_params = [];
let gui_collapsed = false;

//color picker vars
let picker, picker_popper;
let swatches = [];
let pickers = [];

//blend modes 
let modes;

window.onload = (event) => {
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
};

function common_setup(size_x=400, size_y=400, renderer=P2D){ 
  //init globals
  file_saved = false;
  capture_state = "init"

  //midi.js initiate connection
  update_devices();

  //set up CCapture, override num_frames in setup/draw if necessary
  num_frames = capture_time*fr;
  capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
  //set framerate
  if(!capture) frameRate(fr);

  //init globals
  type="png"; //default file type for P2D and WEBGL
  const stored_file_type = protected_session_storage_get("fileType");
  if(renderer == SVG || stored_file_type == "svg"){//override stored values by setting renderer
    type = "svg";
    renderer = SVG;
    protected_session_storage_set("fileType", type);
  }

  hidden_controls = true;

  setParams(size_x, size_y); //base_x and base_y globals are init here
  seed_scale_button(base_y);
  seed = reset_drawing(seed, base_x, base_y);

  //call gui_values every time, parameterize handles whether to create, overwrite, or ignore new vals
  //needs to be called before noLoop and gui.addGlobals, needs to be called after the seed is set
  gui_values();

  if(!full_controls){
    // disable right clicks 
    document.oncontextmenu = function() { 
      return false; 
    };
    //suppress unnecessary errors and speed up drawing time
    p5.disableFriendlyErrors = true; // disables FES
  }
  else{
    //declare gui before noLoop is extended in p5.gui.js
    if(!gui_created){
      gui = createGui('Parameters');
      if(redraw_reason != "gui" || redraw==false){
        gui.addGlobals(...gui_params);
      }
      add_gui_event_handlers();
      gui_created = true;
    }
  }
  // add dice and slashes if necessary
  attach_icons();
  // collapse or reposition param
  retrieve_gui_settings();

  angleMode(DEGREES);

  // const svg_redraw = redraw && type == 'svg'
  if(!redraw) cnv = createCanvas(canvas_x, canvas_y, renderer);
  else resizeCanvas(canvas_x, canvas_y, true);
  frameCount = 0; //with animations, this needs to be one of the last things changed

  //shift position to center canvas if base is different than 400
  if(base_x<=400) cnv.position((400*global_scale-canvas_x)/2, 0);
  
  // gives change for square or rounded edges, this can be overriden within the draw function
  if(renderer != WEBGL) strokeCap(random([PROJECT,ROUND]));

  //set palette
  change_default_palette();

  //add the palette colors here because the palette only just got defined 
  show_palette_colors();

  if(!redraw || redraw_reason == "url"){
    //post details
    message_details();

    //add listener for save messgae
    catch_save_message();
  }

  //Assists with loading on phones and other pixel dense screens
  pixelDensity(1)

  //store first url with full params even if they aren't provided
  const auto = getParamValue('scale') == undefined;
  if(!redraw) window.history.replaceState({}, "", build_current_url(auto)); 

  if(gif || animation) loop(); 
  //else necessary when redrawing timed pieces
  else noLoop();
}

function setParams(size_x, size_y){
  //get params from url and set necessary globals
  const controls = getParamValue('controls');
  seed = getParamValue('seed');
  const img_scale = getParamValue('scale');
  const add_bleed = getParamValue('bleed');
  const add_cut = getParamValue('cut');
  const set_dpi = getParamValue('dpi');

  //If seed isn't specified, but one exists in the box, resize w/same seed
  if(seed == undefined && document.getElementById("Seed")){
    seed = document.getElementById("Seed").value;
  }

  full_controls = (controls == "full" || location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "127.0.0.2") && (controls!="false");
  if((controls != undefined && controls != "false") || full_controls){
    hidden_controls = false;
  }

  //add param for blend mode, add blendMode(modes[blend_mode]); to draw code
  //https://p5js.org/reference/#/p5/blendMode
  modes = [
    BLEND, //0
    ADD, //1
    DARKEST, //2 
    LIGHTEST, //3
    DIFFERENCE, //4
    EXCLUSION, //5
    MULTIPLY, //6
    SCREEN, //7
    REPLACE, //8
    REMOVE, //9
    OVERLAY, //10
    HARD_LIGHT, //11
    SOFT_LIGHT, //12
    DODGE, //13
    BURN, //14
    SUBTRACT //15
  ];
  globalThis.base_x = size_x;
  globalThis.base_y = size_y;

  if(type == "svg"){
    parameterize("svg_width", size_x/96, 1, 30, 0.05, false);
    parameterize("svg_height", size_y/96, 1, 30, 0.05, false);
    globalThis.base_x = svg_width*96;
    globalThis.base_y = svg_height*96;
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
  const ids = ["Bt Left", "Seed", "Bt Right", "Custom Seed", "Reset Palette", "Color Select", "Randomize", "Color Boxes"]
  const full_ids = ["Auto Scale", "Scale Box", "Reset Parameters", "Save", "File Type"]

  control_height = 20*global_scale;
  control_spacing = 5*global_scale;

  if(!redraw){
    //declare unchanging properties
    //START OF TOP ROW
    //left/right buttons for easy seed nav
    btLeft = createButton('<');
    btLeft.mouseClicked(set_seed);
    btLeft.id('Bt Left')

    //creates controls below canvas for displaying/setting seed
    seed_input = createInput("seed");
    seed_input.style("text-align", "right");
    seed_input.id('Seed');

    //left/right buttons for easy seed nav
    btRight = createButton('>');
    btRight.mouseClicked(set_seed);
    btRight.id('Bt Right');

    //custom seed button
    button = createButton("Custom Seed");
    button.mouseClicked(set_seed);
    button.id('Custom Seed')

    if(!in_iframe){
    //reset palette button
    reset_palette = createButton("Reset Palette");
    reset_palette.mouseClicked(()=>{
      //check if stored_palette exists
      const pal = window.localStorage.getItem(palette_names[global_palette_id]);
      if(pal != null){
        window.localStorage.removeItem(palette_names[global_palette_id]);
        redraw_reason = "picker";
        redraw_sketch();
      }
    });
    reset_palette.id('Reset Palette');
    }

    //randomize button
    randomize = createButton("Randomize");
    randomize.mouseClicked(set_seed);
    randomize.id('Randomize');

    //START OF SECOND ROW
    //color palette select
    color_sel = createSelect();
    palette_names.forEach(name => {
      if(!exclude_palette.includes(name) || full_controls){
        color_sel.option(name);
      }
    });
    color_sel.selected(palette_names[col_idx()]);
    color_sel.changed(set_seed);
    color_sel.id('Color Select');

    //color boxes
    color_div = document.createElement("div");
    color_div.id = "Color Boxes";
    document.body.appendChild(color_div);

    //radio control for png/svg
    radio_filetype = createRadio();
    radio_filetype.option("png");
    radio_filetype.option("svg");
    radio_filetype.selected(type);
    radio_filetype.changed(set_file_type);
    radio_filetype.id("File Type");

    //------------------------ CUTOFF FOR FULL CONTROLS ------------------------
    //START OF THIRD ROW
    //autoscale button calls url minus any scaler
    auto_scale = createButton('Autoscale');
    auto_scale.mouseClicked(set_seed);
    auto_scale.id("Auto Scale");

    //scale text box
    scale_box = createInput('');
    scale_box.id("Scale Box");

    //reset parameters button
    reset_parameters = createButton("Reset Parameters");
    reset_parameters.mouseClicked(clear_params);
    reset_parameters.id("Reset Parameters");

    //save button
    btSave = createButton("Save");
    btSave.mouseClicked(save_drawing);
    btSave.id("Save")
  }

  //resize for given global scale
  //START OF TOP ROW
  //left/right buttons for easy seed nav
  btLeft.size(20*global_scale, control_height);
  btLeft.position(0, base_y*global_scale);

  //creates controls below canvas for displaying/setting seed
  seed_input.size(55*global_scale, control_height-6);
  seed_input.position(btLeft.size().width,base_y*global_scale);

  //left/right buttons for easy seed nav
  btRight.size(20*global_scale, control_height);
  btRight.position(seed_input.size().width + seed_input.position().x, base_y*global_scale);

  //custom seed button
  button.size(90*global_scale, control_height)
  button.position(btRight.size().width + btRight.position().x + control_spacing, base_y*global_scale);

  if(!in_iframe){
    //reset palette button
    reset_palette.size(90*global_scale, control_height)
    reset_palette.position(button.size().width + button.position().x + control_spacing, base_y*global_scale);
  }

  //randomize button
  randomize.size(80*global_scale, control_height);
  randomize.position(400*global_scale-randomize.size().width, base_y*global_scale);

  //START OF SECOND ROW
  //color palette select
  color_sel.position(0, base_y*global_scale+control_height);
  color_sel.size(120*global_scale, control_height);

  //file type radio control
  radio_filetype.size(80*global_scale, control_height);
  radio_filetype.position(400*global_scale-radio_filetype.size().width, base_y*global_scale + control_height);

  //------------------------ CUTOFF FOR FULL CONTROLS ------------------------
  //START OF THIRD ROW
  //autoscale button calls url minus any scaler
  auto_scale.position(0, base_y*global_scale + control_height*2);
  auto_scale.size(70*global_scale, control_height)

  //scale text box
  scale_box.position(auto_scale.size().width+control_spacing, base_y*global_scale+control_height*2)
  scale_box.size(30*global_scale, 18*global_scale);
  scale_box.value(global_scale);

  //reset parameters button
  reset_parameters.position(scale_box.position().x+scale_box.size().width+control_spacing, base_y*global_scale+control_height*2);
  reset_parameters.size(130*global_scale, control_height);

  //save button
  btSave.size(70*global_scale, control_height);
  btSave.position(400*global_scale-70*global_scale, base_y*global_scale+control_height*2);

  //style all ctrls
  ids.concat(full_ids).forEach(id => {
    const elem = document.getElementById(id)
    if(elem){
      elem.style.fontSize = str(12*global_scale) + 'px';
    }
  });

  show_hide_controls(ids, hidden_controls);
  show_hide_controls(full_ids, !full_controls);
}

function reset_drawing(seed, base_x, base_y){
  //call draw after this if manually refreshing canvas
  canvas_x = round(base_x*global_scale);
  canvas_y = round(base_y*global_scale);

  //if no seed supplied, set random seed and pass it
  if(isNaN(seed)){
    seed = Math.round(random()*1000000);
  }
  else{
    seed = int(seed);
  }
  randomSeed(seed);
  noiseSeed(seed);
  seed_input.value(str(seed));

  return seed;
}

function col_idx(){
  //returns the integer value of the current palette
  return palette_names.indexOf(color_sel.value());
}

window.onpopstate = function(e){
  //captures the back/forward browser buttons to move between history states without reloading the page
  redraw_reason = "url";
  if(e.state) redraw_sketch();
};


function build_current_url(auto){
  let base_url = "index.html?colors=" + String(col_idx());
  base_url += "&controls="
  if(getParamValue("controls") != undefined) base_url += getParamValue("controls");
  else if(full_controls) base_url += "full";
  else base_url += "false";
  base_url+= "&seed=" + seed_input.value();
  if(bleed){base_url+='&bleed=' + String(bleed_val)};
  if(dpi != DPI_DEFAULT){base_url+= "&dpi="+String(dpi)};
  if(cut){base_url += '&cut=' + String(cut)};

  if(!auto) base_url += "&scale=" + scale_box.value();

  return base_url;
}


function set_seed(e){
  let event_id;
  if(e == undefined) event_id = "";
  else event_id = e.srcElement.id;

  if(event_id == "Bt Right") seed_input.value(int(seed_input.value())+1);
  else if(event_id == "Bt Left") seed_input.value(int(seed_input.value())-1);
  else if (event_id == "Randomize") seed_input.value(Math.round(random()*1000000));

  //refreshes the drawing with new settings
  //check if any changes have ocurred
  const same_seed = seed_input.value()==getParamValue('seed');
  const same_scale = scale_box.value()==find_cnv_mult();
  const same_palette = col_idx()==int(getParamValue('colors'));
  if(same_seed && same_scale && same_palette && event_id != "Auto Scale") return;

  const auto = event_id == "Auto Scale" || (getParamValue('scale') == undefined  && same_scale);
  let base_url = build_current_url(auto);
  
  //using pushState allows for changing the url, and then redrawing without needing to reload the page
  window.history.pushState({}, "", base_url);
  redraw_reason = "url";
  if(!same_palette) redraw_reason = "palette";
  redraw_sketch();
}

function keyTyped(e) {
  // user presses enter, it sends Custom seed and custom scale
  const event_id = e.srcElement.id;
  if(keyCode === ENTER && (event_id == "Seed" || event_id == "Scale Box")){
    set_seed(e); //pass thru event details
  }
}

function set_file_type(e){
  //radio button changed
  const val = radio_filetype.value();
  protected_session_storage_set("fileType", val);
  //hard refresh of window with current url values
  window.location.href = window.location.href;
}


function show_palette_colors(){
  //can't be called in the seed_scale_button function because palette can be undefined at that point
  if(redraw_reason == "palette"){
    //delete existing 
    let existing_pickers = document.getElementsByClassName("lw-ref");
    for(let i=existing_pickers.length-1; i>=0; i--) existing_pickers[i].remove();
  
    let existing_poppers = document.getElementsByClassName("alwan lw-popper");
    for(let i=existing_poppers.length-1; i>=0; i--) existing_poppers[i].remove();
    //generate swatches for current palette
    swatches = [];
    pickers = [];
  }
  if(!redraw || redraw_reason == "palette"){
    for(let i=0; i<palette.length; i++){
      swatches.push('rgb(' + global_palette[i][0] + ',' + global_palette[i][1] + ',' + global_palette[i][2] + ',' + map(global_palette[i][3],0,255, 0,1) + ')');
    }
  }
  else{
    palette.forEach((c,idx) => {
      //set button colors to match palette after initial draw
      pickers[idx].setColor('rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + map(c[3],0,255, 0,1) + ')');
    });
  }

  let start_pos = color_sel.position().x + color_sel.size().width;
  palette.forEach((c, idx) => {
    if(!redraw || redraw_reason == "palette"){
      let color_picker = document.createElement("div");
      color_picker.id = "color_picker" + idx;
      color_div.appendChild(color_picker);
    }

    color_div.style.position = "absolute";
    color_div.style.left = start_pos+control_spacing+"px";
    color_div.style.top = color_sel.position().y+"px"
    color_div.style.width = control_height+"px";
    color_div.style.height = control_height+"px";

    if(!redraw || redraw_reason == "palette"){
      //color picker code, ref https://github.com/SofianChouaib/alwan
      const alwan = new Alwan('#color_picker'+idx, {
        id: "picker_"+idx,
        theme: 'light',
        toggle: true,
        popover: true,
        preset: true,
        color: 'rgb(' + palette[idx][0] + ',' + palette[idx][1] + ',' + palette[idx][2] + ',' + map(palette[idx][3],0,255, 0,1) + ')',
        format: 'rgb',
        singleInput: false,
        inputs: {
          rgb: true,
          hex: true,
          hsl: true,
        },
        opacity: true,
        preview: true,
        copy: true,
        swatches: swatches
      });
      pickers.push(alwan);

      picker_popper = document.getElementById("picker_"+idx);
      //custom event listener because the colorpicker events are shit
      picker_popper.addEventListener("mouseup", color_changed);
      picker_popper.addEventListener("touchend", color_changed);

    }
    picker = document.getElementById("color_picker"+idx);
    picker.style.position = "absolute";
    picker.style.left = control_height*idx*1.1 + "px";
    picker.style.top = control_height*.05+"px"
    picker.style.width = control_height*.9+"px";
    picker.style.height = control_height*.9+"px";
    picker.style.border = floor(1.5*global_scale) + 'px solid black' //rgb(' + 0 + ',' + 0 + ',' + 0 + ')'
  });

  //disable color picker buttons if in iframe
  if(in_iframe){
    const color_buttons = document.getElementsByClassName("lw-ref");
    color_buttons.forEach(btn => btn.disabled = true);
  }
}

function reduce_array(arr, remove){
  let rm_idx = -1;
  //if remove is an array
  if(typeof(remove)=='object'){
    //check for color object
    if(remove.levels != undefined){
      arr.every((e, idx) => {
        if(arrayEquals(e.levels,remove.levels)){
          rm_idx = idx;
          return false;
        }
        else return true;
      });
    }
    else{
      arr.every((e, idx) => {
        if(arrayEquals(e,remove)){
          rm_idx = idx;
          return false;
        }
        else return true;
      });
    }
  }
  else{
    //if remove is not an array
    rm_idx = arr.indexOf(remove);
  }
  if (rm_idx > -1) {
    arr.splice(rm_idx, 1);
  }
  else{
    print("Unable to reduce array. Arr: ", arr, "Item to Remove: ", remove);
  }
}

function show_hide_controls(arr, hide){
  arr.forEach(ctrl => {
    const elem = document.getElementById(ctrl)
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
  let bleed_name = '';
  let dpi_name = '';
  let cut_name = '';
  if(bleed != false){
    bleed_name = '_bleed_' + str(bleed_val);
    if(cut != false){
      cut_name = '_cut_true';
    }
  };
  if(dpi != DPI_DEFAULT) dpi_name = "_dpi_"+str(dpi);
  let scale_text = round(global_scale*1000)/1000; //round to nearest 1000th place
  scale_text = str(scale_text).replace(".", "_");
  const filename = str(project_name) + '_seed_' + str(seed_input.value()) + '_colors_' + str(col_idx()) + '_scale_' + scale_text + bleed_name + dpi_name + cut_name;
  if(type == 'svg'){
    //create ids for each color in the order they're drawn for use by vpype
    let canvas_elem = document.getElementById("defaultCanvas0");
    let path_elems = canvas_elem.getElementsByTagName("path");
    let stroke_colors = {};
    let primary_id = 0.00001; // up to 99,999 lines per color
    path_elems.forEach(e => {
      const stroke_color = String(e.getAttribute("stroke"));
      if(stroke_color in stroke_colors) stroke_colors[stroke_color] = stroke_colors[stroke_color] + 0.00001;
      else{
        stroke_colors[stroke_color] = primary_id;
        primary_id++;
      }
      e.id = Math.round(100000 * stroke_colors[stroke_color])/100000;//round to avoid floating point addition errors
    });

    save(filename);
  }
  else saveCanvas(filename, type);
  file_saved = true;
}

function global_draw_start(clear_cnv=true){
  if(clear_cnv) clear(); //should be false for some animating pieces
  //called from top of Draw to start capturing, requires CCapture
  if(capture && capture_state == "init"){
    capturer.start();
    capture_state = "start";
  }

  //if creating a gif of different designs, re-randomize palette from suggested palettes and rerandomize gui values
  if(gif && !animation){
    noiseSeed(floor(random(10000))); //randomize noise seed

    change_default_palette(); //redo suggested palettes
    gui_values(); //redo parameterizations
  }
  // if(gif || animation){
  //   redraw = true; //I believe these two lines exist to not prompt capturer.start() multiple times
  //   redraw_reason = "gif";
  // }

  // if(type != 'svg') blendMode(modes[blend_mode]); // blend mode param for all designs
  
  bleed_border = apply_bleed();
}

function global_draw_end(){
  apply_cutlines(bleed_border);
  capture_frame();
}


function capture_frame(){ 
  if(capture){
    if(capture_state != "stop"){
      capturer.capture(document.getElementById("defaultCanvas0"));
      capture_state = "capture";
      
      if(frameCount-1 == num_frames || !isLooping()){
        capturer.stop();
        capture_state = "stop";
        capturer.save();
      } 
    }
    if(capture_state == "stop") noLoop(); //CCapture executes an extra loop every time
  }
}

//background functions
function bg(remove, force){
  let c;
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
    
    const total_canvas_x = canvas_x + bleed_border*2;
    const total_canvas_y = canvas_y + bleed_border*2;
    resizeCanvas(total_canvas_x, total_canvas_y);

    //move origin to within bleed lines
    translate((total_canvas_x-canvas_x)/2, (total_canvas_y-canvas_y)/2);

    return bleed_border;
  }
}

function get_invert_stroke(x, y){
  // gets color at pixel x,y. Aboslute coordinates because the get function is some shit
  let c = get(x, y)

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
    strokeWeight(1*global_scale);
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
  let color_match=true;
  let c;
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
  const r = random(255);
  const g = random(255);
  const b = random(255);
  const a = 255;
  return(color(r,g,b,a))
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function gui_changed(){
  redraw_reason = "gui";
  redraw_sketch();
}

function clear_params(){
  //deletes all parameter values from session storage and calls redraw
  //retrieve gui values
  const gui_containers = document.getElementsByClassName("qs_container");
  gui_containers.forEach(container => {
      //check if variable exists in local storage
    let gui_label = container.getElementsByClassName("qs_label")[0];
    gui_label = gui_label.textContent.split(": ");
    const stored_name = project_name + "_" + gui_label[0];
    let stored_variable = sessionStorage.getItem(stored_name);
    if(stored_variable != null) sessionStorage.removeItem(stored_name);
  });

  clearMIDIvalues();

  redraw_reason = "window";
  clear_gui();
  redraw_sketch();
}

function color_changed(e){
  setTimeout(() =>{
    // search for nearest element with id = 'picker_*' wildcard
    const picker = e.target.closest("[id^='picker_']");
    let picker_id = picker.id;

    //check to see if the color has changed
    const picker_values = picker.getElementsByClassName("lw-label")
    const picker_color = [];
    for(let i=0; i<picker_values.length; i++){
      let val = picker_values[i].getElementsByClassName("alwan__input")[0].value;
      if(i==3) val = map(val, 0,1, 0,255);
      picker_color.push(parseInt(val));
    }
   
    picker_id = picker_id.replace("picker_","");
    picker_id = parseInt(picker_id);

    //check if picker color is different from existing color
    if(!arrayEquals(picker_color, palette[picker_id])){
      palette[picker_id] = picker_color;
      window.localStorage.setItem(palette_names[global_palette_id], JSON.stringify(palette));
      redraw_reason = "picker";
      redraw_sketch();
    }
  }, 10)
}

function windowResized(e) {
  snap_gui_to_window();
  if((getParamValue('scale') == undefined && find_cnv_mult() != global_scale)){
    redraw_reason = "window";
    clear_gui();
    redraw_sketch();
  }
}

function clear_gui(){
  let gui_elem = document.getElementsByClassName("qs_main")[0];
  if(gui_elem !== undefined){
    gui_elem.remove();
  }
  gui_created = false;
}

function redraw_sketch(){
  if(gif && animation && (redraw_reason == "gui" || redraw_reason == "midi")){
    gui_values();
    attach_icons();
    return;
  }
  redraw = true;
  setup();
  draw();
}

function change_default_palette(){
  //if no suggested palette, use the default palette
  let palette_id= PALETTE_ID_DEFAULT;
  let colors = getParamValue('colors');
  let suggested_palette_id;
  if(suggested_palettes !== undefined){
    if(suggested_palettes.length>0) suggested_palette_id = random(suggested_palettes);
  }

  if(redraw && redraw_reason != "palette"){
    if(gif && !animation) palette_id = suggested_palette_id; //if capturing a gif of still noLoop designs, and it's redrawing, get new palette
    else palette_id = global_palette_id;
  }
  //if not redraw, get palette from url
  else if(colors != undefined){
    //is the color given within the palettes range
    if(!isPositiveIntegerOrZero(colors) || parseInt(colors)>palettes.length){
      colors = PALETTE_ID_DEFAULT;
    }
    palette_id = parseInt(colors);
  }
  //if no url palette, grab the suggested palette
  else if(suggested_palette_id !== undefined){
    palette_id = suggested_palette_id;
  }

  global_palette_id = palette_id;
  global_palette = palettes[global_palette_id];
  //check if local storage
  let stored_palette;
  try{
    stored_palette = window.localStorage.getItem(palette_names[global_palette_id]);
  }
  catch(err){
    console.log("Local storage is being blocked by a 3rd party application");
    stored_palette = undefined;
  }
  if(stored_palette != undefined) palette = JSON.parse(stored_palette);
  else palette = JSON.parse(JSON.stringify(global_palette));
  color_sel.selected(palette_names[global_palette_id]);

  refresh_working_palette();
}

function refresh_working_palette(){
  working_palette = JSON.parse(JSON.stringify(palette));
}

function find_cnv_mult(){
  //for SVG work, set scale to 1 to maintain css units of 1px = 1/96inch
  if(type == "svg") return 1;

  let size_x = max(400, base_x); //because we center within a 400x400 canvas for things smaller than 400
  let size_y = base_y;
  if(!hidden_controls) size_y += 40;
  if(full_controls) size_y += 20;//space for second row of controls, the extra 3 is make sure no vertical scrollbar

  const x_mult = Math.round((windowWidth/size_x)*1000)/1000; //find multiplier based on the x dimension  
  const y_mult = Math.round((windowHeight/size_y)*1000)/1000; //find multipler based on the y dimension

  let smaller_multiplier = min(x_mult, y_mult);  //find the smaller mult
  
  //constrain between 1 and 12
  smaller_multiplier = constrain(smaller_multiplier, 1, 12);

  //get a mult that will give an even number of whole pixels for the x dimension
  if(round(size_x*smaller_multiplier) % 2 != 0) smaller_multiplier = (round(size_x*smaller_multiplier)-1)/size_x; //-1 so that the canvas is always slightly smaller than the window

  //canvas_x and canvas_y rounded later on

  //check for change in multiplier due to gui param changes
  multiplier_changed = redraw_reason == 'gui' && smaller_multiplier != global_scale

  return smaller_multiplier;
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
  const loc = window.location.pathname;
  const dir = loc.substring(0, loc.lastIndexOf('/'));
  const message = JSON.stringify({
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
      var palette = palette_names[global_palette_id];
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

function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

function protected_session_storage_get(name){
  try{ return sessionStorage.getItem(name); }
  catch(err){
    console.log("Cannot access session storage to get item, probably an ad blocker issue");
    return null;
  }
}

function protected_session_storage_set(name, val){
  try{
    sessionStorage.setItem(name, val);
  }
  catch(err){
    console.log("Cannot access session storage to set item, probably an ad blocker issue");
  }
}

function parameterize(name, val, min, max, step, scale, midi_channel){
  if(scale == undefined || scale != true) scale=false;
  if(midi_channel == undefined) midi_channel = false;

  if(midi_channel){
    const channel_name = give_grid_chanel_name(midi_channel);
    const channel_value = protected_session_storage_get(channel_name);
    if(channel_value != null){
      val = map(channel_value, 0, 127, min, max); //midi vals go from 0 to 127
      val = round(val/step)*step; //coerce to nearest step val
    }
  }
  //check if variable exists in local storage
  const stored_name = project_name + "_" + name;
  let stored_variable = protected_session_storage_get(stored_name);

  if(stored_variable != null){
    stored_variable = JSON.parse(stored_variable);
    if(redraw_reason == 'gui' || redraw_reason == 'gif'){
      //retrieve gui values
      for(const control_name in gui.prototype._controls){
        if(control_name == name){
          //save to storage
          let new_value = gui.prototype._controls[name].getValue();
          if(stored_variable.scale) new_value = new_value/global_scale;
          if((!multiplier_changed || name == "base_x" || name == "base_y") && name != "blend_mode"){
            //don't freeze params that change due to multiplier changing. Multiplier changed only happens when base_x, base_y change
            if(new_value != stored_variable.val && abs(new_value - stored_variable.val) >= stored_variable.step) stored_variable.frozen = true; 
          }
          stored_variable.val = new_value;
          stored_variable.min = min;
          stored_variable.max = max;
          stored_variable.step = step;
          stored_variable.scale = scale;
          protected_session_storage_set(stored_name, JSON.stringify(stored_variable));
        }
      }
    }
    else{
      //if frozen take stored values, otherwise, use values as given
      if(full_controls && stored_variable.frozen){
        //retrieve locally stored values
        name = stored_variable.name;
        val = stored_variable.val;
        min = stored_variable.min;
        max = stored_variable.max;
        step = stored_variable.step;
        scale = stored_variable.scale;
      }
      else{
        // if not frozen store new values
        protected_session_storage_set(stored_name, JSON.stringify({
          name: name,
          val: val,
          min: min, 
          max: max,
          step: step,
          scale: scale,
          frozen: false
        }));
      }
    }
  }
  else{
    protected_session_storage_set(stored_name, JSON.stringify({
      name: name,
      val: val,
      min: min, 
      max: max,
      step: step,
      scale: scale,
      frozen: false
    }));
  }

  if(scale){
    val = val*global_scale;
    min = min*global_scale;
    max = max*global_scale;
    step = step*global_scale;
  }
  //create parameters for gui creation, not supposed to use eval for security reasons, but it's just soo much easier in this case
  //if variables don't already exist, create them
  if(!eval("typeof " + name + "!== 'undefined'")){
    //build string if array
    if(Array.isArray(val)){
      let val_string = JSON.stringify(val);
      eval('globalThis.' + name +" = " + val_string);
    }
    else eval('globalThis.' + name +" = " + val);

    if(min != undefined) eval('globalThis.' + name + "Min =" + min);
    if(max != undefined) eval('globalThis.' + name +"Max =" + max);
    if(step != undefined) eval('globalThis.' + name +"Step =" + step);

    gui_params.push(name);
  }
  //if variables do exist, apply new values
  else{
    //if redraw reason is gui, let p5.gui handle the new values
    if(redraw_reason == "window" || redraw_reason == "gif" || redraw_reason == "midi" || redraw_reason == "url"){
      eval(name + "=" + val);
      if(min != undefined) eval(name + "Min =" + min);
      if(max != undefined) eval(name +"Max =" + max);
      if(step != undefined) eval(name +"Step =" + step);

      //force update gui with new values
      if(gui !== undefined){
        gui.prototype._controls[name].control.min = String(min);
        gui.prototype._controls[name].control.max = String(max);
        gui.prototype._controls[name].control.step = String(step);
        gui.prototype._controls[name].setValue(val);
      }
    }
  }
}


function attach_icons(){
  // finds param gui and creates dice icon and slashes to indicate unfrozen/frozen/disabled
  //Dice icon attribution
  //<a href="https://www.flaticon.com/free-icons/dice" title="dice icons">Dice icons created by Freepik - Flaticon</a>

  //find div class dice and remove them and re-add them
  let to_remove = document.getElementsByClassName("dice");
  for (let i = to_remove.length - 1; i >= 0; --i) {
    to_remove[i].remove();
  }

  const gui_containers = document.getElementsByClassName("qs_container");
  gui_containers.forEach(container => {
    let gui_label = container.getElementsByClassName("qs_label")[0];
    if(gui_label == undefined){
      //check if checkbox
      gui_label = container.getElementsByClassName("qs_checkbox_label")[0];
      
      if(gui_label == undefined){
        //otherwise post error with container
        print("cannot find label in control: ", container);
      }
    }
    let label_content = gui_label.textContent.split(": ");
    const stored_name = project_name + "_" + label_content[0];
    let stored_variable = protected_session_storage_get(stored_name);

    if(stored_variable != null){
      let param = JSON.parse(stored_variable);
      let div = document.createElement('div');
      div.className = "dice";

      //append dice image
      let dice = document.createElement('img');
      dice.src = "/images/dice.png";
      dice.style = "height: 25px; position: relative; z-index: 0;";
      //if dice clicked, apply slash
      dice.addEventListener('click', (e)=>{
        let slash = create_slash(stored_name, param);
        e.target.parentElement.appendChild(slash);
        param.frozen = true;
        protected_session_storage_set(stored_name, JSON.stringify(param));
      });

      div.appendChild(dice);

      if(param.frozen){
        //append red slash
        div.appendChild(create_slash(stored_name, param));
      }
      
      gui_label.appendChild(div);
    }
  })
}

function create_slash(name, data){
  let slash = document.createElement('img');
  slash.id = "slash";
  slash.src = "/images/red_slash_up.svg";
  slash.style = "height: 25px;position: relative;z-index: 1; right: 25px;";
  //if slash clicked, remove slash
  slash.addEventListener('click', (e)=>{
    e.target.remove();
    data.frozen = false;
    protected_session_storage_set(name, JSON.stringify(data))
  });
  return slash;
}

function snap_gui_to_window(){
  //checks if param is outside of window bounds, and brings it inside, also stores position
  const gui_container = document.getElementsByClassName("qs_main")[0];
  const rect = gui_container.getBoundingClientRect();

  //snap GUI Params to inside window
  if(rect.x < 0) rect.x = 0;
  else if(rect.x + rect.width > window.innerWidth) rect.x = window.innerWidth - rect.width;
  if(rect.y < 0) rect.y = 0;
  else if(rect.y + rect.height > window.innerHeight) rect.y = window.innerHeight - rect.height;

  gui.setPosition(rect.x, rect.y);

  protected_session_storage_set("gui_loc", JSON.stringify(rect));
}

function add_gui_event_handlers(){
  //extend _endDrag function
  let old_endDrag = gui.prototype._endDrag;
  function new_endDrag(event){
    old_endDrag(event);
    
    snap_gui_to_window();
  }
  gui.prototype._endDrag = new_endDrag;

  const gui_title_bar = document.getElementsByClassName("qs_title_bar")[0];
  gui_title_bar.addEventListener("dblclick", gui_dblclick);
}

function gui_dblclick(){
  const prev_gui_collapsed_state = gui_collapsed;
  //toggle gui collapsed status
  gui_collapsed = !gui_collapsed;
  protected_session_storage_set("gui_collapsed", JSON.stringify(gui_collapsed));
  if(prev_gui_collapsed_state && !gui_collapsed) attach_icons(); 
}

function retrieve_gui_settings(){
  if(!full_controls) return;
  // retrieve gui collapsed status and location
  let stored_loc = protected_session_storage_get("gui_loc");
  let collapsed = protected_session_storage_get("gui_collapsed");
  if(stored_loc == null && collapsed == null) return;

  if(stored_loc != null){
    stored_loc = JSON.parse(stored_loc); 
    gui.setPosition(stored_loc.x, stored_loc.y);
  }

  snap_gui_to_window();

  if(collapsed != null){
    collapsed = JSON.parse(collapsed);
    //recollapse new gui if previously collapsed
    if(collapsed && !redraw){
      gui.prototype._doubleClickTitle();
      gui_collapsed = true;
    }
  }
}


//SVG feTurbulence filter
function feTurbulence(baseFrequency, numOctaves, filter_scale){
  //good values for wobbly lines is 0.05, 3, 2

  //check if filter exists, if so delete and remake
  if(document.getElementById("turb") != null){
    document.getElementById("turb").remove();
  }
  let filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id","turb");
  
  let feTurbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
  feTurbulence.setAttribute("type", "turbulence");
  feTurbulence.setAttribute("baseFrequency", str(baseFrequency));
  feTurbulence.setAttribute("numOctaves", str(numOctaves));
  feTurbulence.setAttribute("result", "turblence");

  let feDisplacementMap = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
  feDisplacementMap.setAttribute("in2", "turbulence");
  feDisplacementMap.setAttribute("in", "SourceGraphic");
  feDisplacementMap.setAttribute("scale", str(filter_scale));
  feDisplacementMap.setAttribute("xChannelSelector", "R");
  feDisplacementMap.setAttribute("yChannelSelector", "G");

  //find svg tag
  let svg_defs = document.getElementsByTagName("defs")[0];
  filter.appendChild(feTurbulence);
  filter.appendChild(feDisplacementMap);
  svg_defs.appendChild(filter);
  let g_tag = document.getElementsByTagName("g")[0];
  g_tag.setAttribute("filter", "url(#turb)");
}

function bezier_arc_controls(xc, yc, x1, y1, x4, y4){
  //returns bezier control points creating an arc based on two points and the center of the circle
  //https://stackoverflow.com/questions/734076/how-to-best-approximate-a-geometrical-arc-with-a-bezier-curve
  const ax = x1 - xc;
  const ay = y1 - yc;
  const bx = x4 - xc;
  const by = y4 - yc;
  const q1 = ax * ax + ay * ay;
  const q2 = q1 + ax * bx + ay * by;
  const k2 = (4/3) * (sqrt(2 * q1 * q2) - q2) / (ax * by - ay * bx);

  const x2 = xc + ax - k2 * ay;
  const y2 = yc + ay + k2 * ax;
  const x3 = xc + bx + k2 * by;                                 
  const y3 = yc + by - k2 * bx;
  return [x2, y2, x3, y3];
}


function nTimes(func, arg, n) {
  //perform func n times on arg. i.e. sin(sin(sin(theta))): nTimes(sin, theta, 3)
  let returnValue = arg;

  for (let i = 0; i < n; i++) {
    returnValue = func(returnValue)
 }

  return returnValue;
}

function draw_open_type_js_path_p5_commands(path){  
  //Draw a path from the opentype.js lib. expects path to be generated using func font.getpath
  for (let cmd of path.commands) {
    if (cmd.type === 'M') { //move to
      beginShape();
      vertex(cmd.x, cmd.y);
    } 
    else if (cmd.type === 'L')vertex(cmd.x, cmd.y); //line to
    else if (cmd.type === 'C') bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y); // bezier to 
    else if (cmd.type === 'Q') quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y); //quadratic to
    else if (cmd.type === 'Z') endShape(CLOSE); // close shape
  } 
}


function set_linear_gradient(colors, start_x, start_y, end_x, end_y, style){
  //equally add color stops for all provided colors, apply to fill or stroke style
  const gradient = drawingContext.createLinearGradient(start_x, start_y, end_x, end_y);
  const step_size = 1/(colors.length-1);
  for(let i=0; i<colors.length; i++){
    let c = colors[i];
    if(c == undefined) continue; //can use an undefined 
    //check if provided color is a color object or just an array
    if(c["mode"] == undefined) c = color(c);
    if(c["mode"] == undefined) continue; //if you can't convert it to a color, continue with the rest
    gradient.addColorStop(i*step_size, c);
  }
  if(style == "fill") drawingContext.fillStyle = gradient;
  else drawingContext.strokeStyle = gradient;
}