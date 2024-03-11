"use strict";
// globals
const project_path = window.location.pathname.split('/')
const project_name = project_path[project_path.length-2];
const parameter_storage_name = project_name + "_gui_params";
let canvas_x, canvas_y, cnv;
let file_saved = false;

const num_frames = capture_time*fr;
let capturer, capture_state;
//control variables
const control_height_base = 20;
const control_spacing_base = 5;
let seed_input, scale_box, color_sel;
let btLeft, btRight, button, reset_palette, randomize, auto_scale, reset_parameters, btSave, radio_filetype, x_size_input, y_size_input, unit_select;

const PALETTE_ID_DEFAULT = MUTEDEARTH;
let global_palette_id = PALETTE_ID_DEFAULT;
let palette, working_palette;
let palette_changed = true;
let picker_changed = false;
let size_changed = false;

let global_scale = 1;
let previous_scale = global_scale;
let multiplier_changed = true;
let controls_param, seed_param, colors_param, scale_param, x_size_px_param, y_size_px_param; //global url parameters
let randomize_time_param; //optional url parameters
let timeout_set = false;
const in_iframe = window.location !== window.parent.location;
let type = 'png';
let redraw = false;

//gui vars
let redraw_reason;
var gui;
const gui_params = {};
let gui_collapsed = false;

//color picker vars
const pickers = [];
function create_pickers(){
  //create all pickers before setup
  const color_div = document.createElement("div");
  color_div.id = "Color Boxes";
  color_div.style.position = "absolute";
  color_div.style.visibility = "hidden";
  document.body.appendChild(color_div);

  const picker_parent = document.createElement("div");
  for(let i=0; i<longest_palette_length; i++){
    picker_parent.id = "picker_parent_" + i;
    color_div.appendChild(picker_parent);

    const alwan = new Alwan("#picker_parent_" + i, {
      id: "picker_"+i,
      disabled: in_iframe
    });
    alwan.on("change", color_changed);
    pickers.push(alwan);
  }
};

function show_hide_pickers(){
  for(let i=0; i<longest_palette_length; i++){
    if(i < palette.length && controls_param != "false") document.getElementById("picker_parent_" + i).style.visibility = "visible";
    else  document.getElementById("picker_parent_" + i).style.visibility = "hidden";
  }
}

function size_pickers(control_height, control_spacing){
  //after seed_scale_button, resize and position color pickers
  const start_pos = color_sel.position().x + color_sel.size().width;
  const color_div = document.getElementById("Color Boxes");
  color_div.style.left = start_pos+control_spacing+"px";
  color_div.style.top = color_sel.position().y+"px"
  color_div.style.width = control_height+"px";
  color_div.style.height = control_height+"px";

  for(let i=0; i<longest_palette_length; i++){
    const picker = document.getElementById("picker_parent_"+i);
    picker.style.position = "absolute";
    picker.style.left = control_height*i*1.1 + "px";
    picker.style.top = control_height*.05+"px"
    picker.style.width = control_height*.9+"px";
    picker.style.height = control_height*.9+"px";
  }
}

function color_pickers(){
  //set color picker colors and swatches
  const swatches = [];
  for(let i=0; i<palette.length; i++){
    swatches.push('rgb(' + palette[i][0] + ',' + palette[i][1] + ',' + palette[i][2] + ',' + palette[i][3]/255 + ')');
  }
  for(let i=0; i<swatches.length; i++){
    const picker = pickers[i];
    picker.setOptions({swatches:swatches});
    if(palette_changed) picker.setColor(swatches[i]);
  }
}

function color_changed(e){
  //event for color pickers changing
  const source_id = e.source.config.id;
  const picker_id = source_id.charAt(source_id.length-1);

  const picker_color = [
    e.source.getColor().r,
    e.source.getColor().g,
    e.source.getColor().b,
    e.source.getColor().a*255
  ];

  picker_changed = true;
  palette[picker_id] = picker_color;
  protected_storage_set(palette_names[global_palette_id], JSON.stringify(palette), "local");
  redraw_sketch();
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", create_pickers);  // Loading hasn't finished yet
else create_pickers(); // `DOMContentLoaded` has already fired

first_time_setup();

function first_time_setup(){
  //url parameters
  if(getParamValue("controls") == undefined) controls_param = build_controls();
  else controls_param = verify_controls(getParamValue("controls"));

  if(getParamValue("seed") == undefined) seed_param = build_seed();
  else seed_param = verify_seed(getParamValue("seed"));

  if(getParamValue("colors") == undefined) colors_param = build_colors();
  else colors_param = verify_colors(getParamValue("colors"));

  if(getParamValue("scale") == undefined) scale_param = build_scale();
  else scale_param = verify_scale(getParamValue("scale"));

  if(getParamValue("x_size_px") == undefined) x_size_px_param = build_size_px();
  else x_size_px_param = verify_size_px(getParamValue("x_size_px"));

  if(getParamValue("y_size_px") == undefined) y_size_px_param = build_size_px();
  else y_size_px_param = verify_size_px(getParamValue("y_size_px"));

  if(getParamValue("randomize_time") == undefined) randomize_time_param =  build_randomize_time();
  else randomize_time_param = verify_randomize_time(getParamValue("randomize_time"));

  if(controls_param != "full"){
    // disable right clicks 
    document.oncontextmenu = function() { 
      return false; 
    };
  }

  //retrieve stored gui_params
  let stored_params = protected_storage_get(parameter_storage_name, "session");
  if(stored_params != null){
    stored_params = JSON.parse(stored_params);
    for(const key in stored_params){
      gui_params[key] = stored_params[key];
    }
  }

}

function build_controls(){
  if(location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "127.0.0.2") return "full";
  else return "false";
}

function verify_controls(val){
  if(val == "false" || val == "true" || val == "full") return val;
  else return build_controls();
}

function build_seed(){
  return String(Math.round(Math.random()*1000000));
}

function verify_seed(val){
  if(!isNaN(val) && Number.isInteger(parseInt(val))) return val;
  else return build_seed();
}

function build_colors(){
  if(typeof suggested_palettes !== 'undefined'){
    if(suggested_palettes.length > 0){
      return String(suggested_palettes[Math.floor(Math.random()*suggested_palettes.length)]); //select random val in suggested palettes
    }
  }
  return String(PALETTE_ID_DEFAULT);
}

function verify_colors(val){
  if(isPositiveIntegerOrZero(val) && parseInt(val)<palettes.length){
     return val;
  }
  else return build_colors();
}

function build_scale(){
  return "auto";
}

function verify_scale(val){
  if(!isNaN(val) && parseFloat(val) > 0) return val;
  else return build_scale();
}

function build_size_px(){
  return "0";
}

function verify_size_px(val){
  if(!isNaN(val) && parseInt(val) > 0) return val;
  else return build_size_px();
}

function build_randomize_time(){
  return -1;
}

function verify_randomize_time(val){
  if(!isNaN(val) && parseFloat(val) > 0) return val;
  else return build_randomize_time();
}

function build_url(){
  let base_url = "index.html?";
  //required
  base_url += "controls=" + controls_param;
  base_url += "&seed=" + seed_param;
  base_url += "&colors=" + colors_param;
  base_url += "&scale=" + scale_param;
  base_url += "&x_size_px=" + x_size_px_param;
  base_url += "&y_size_px=" + y_size_px_param;

  //optional
  if(randomize_time_param > 0) base_url += "&randomize_time=" + randomize_time_param;

  return base_url;
}

function common_setup(size_x=x_size_px_param, size_y=y_size_px_param, renderer=P2D){
  size_x = parseInt(size_x);
  size_y = parseInt(size_y);
  if(size_x <= 0){
    size_x = 400;
    x_size_px_param = "400";
  }
  else if(redraw) size_x = parseInt(x_size_px_param);
  else x_size_px_param = String(size_x);

  if(size_y <= 0){
    size_y = 400;
    y_size_px_param = "400";
  }
  else if(redraw) size_y = parseInt(y_size_px_param);
  else y_size_px_param = String(size_y);

  if(!redraw){
    //replace initial url with one with full params 
    const url = build_url();
    window.history.replaceState({}, "", url); 
  }

  //init globals
  file_saved = false;
  capture_state = "init";

  //set up CCapture, override num_frames in setup/draw if necessary
  capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
  //set framerate
  if(!capture) frameRate(fr);

  //init globals
  const stored_file_type = protected_storage_get("fileType", "session");
  if(renderer == SVG || stored_file_type == "svg"){//override stored values by setting renderer
    type = "svg";
    renderer = SVG;
    protected_storage_set("fileType", type, "session");
  }

  setParams();
  if(scale_param == "auto") global_scale = find_cnv_mult(size_x, size_y);
  else global_scale = parseFloat(scale_param);

  const control_height = control_height_base * global_scale;
  const control_spacing = control_spacing_base * global_scale;

  canvas_x = floor(size_x*global_scale);
  canvas_y = floor(size_y*global_scale);

  const int_seed = parseInt(seed_param);
  randomSeed(int_seed);
  noiseSeed(int_seed);
  pnoise.seed(int_seed);

  seed_scale_button(control_height, control_spacing);
  populate_size_inputs();

  //call gui_values every time, parameterize handles whether to create, overwrite, or ignore new vals
  //needs to be called before noLoop and gui.addGlobals, needs to be called after the seed is set
  gui_values();

  if(controls_param == "full" && !redraw){
    //declare gui before noLoop is extended in p5.gui.js
    gui = createGui('Parameters');
    for(const key in gui_params){
      gui.addGlobals(key);
    }
    add_gui_event_handlers();
    // collapse or reposition param
    retrieve_gui_settings();
  }

  if(!redraw) cnv = createCanvas(canvas_x, canvas_y, renderer);
  else resizeCanvas(canvas_x, canvas_y, true);
  frameCount = 0; //with animations, this needs to be one of the last things changed

  //shift position to center canvas if base is different than 400
  if(size_x<=400) cnv.position((400*global_scale-canvas_x)/2, 0);
  else cnv.position(0,0);
  
  // gives change for square or rounded edges, this can be overriden within the draw function
  if(renderer != WEBGL) strokeCap(random([PROJECT,ROUND]));

  //set palette
  if(!redraw || palette_changed || picker_changed) change_default_palette();
  if(!redraw || palette_changed){
    show_hide_pickers();
    color_pickers();
  }
  if(multiplier_changed || size_changed) size_pickers(control_height, control_spacing);

  if(!redraw){
     //post details
    message_details();

    //add listener for save messgae
    catch_save_message();
  }

  if(!redraw){
    angleMode(DEGREES);

    //Assists with loading on phones and other pixel dense screens
    pixelDensity(1)
  }

  //set randomize timeout function
  if(randomize_time_param > 0 && !timeout_set){
    timeout_set = true;
    setTimeout(function(){
      timeout_set = false;
      randomize_seed();
    }, randomize_time_param * 1000);
  }

  //reset changed flags
  multiplier_changed = false;
  palette_changed = false;
  picker_changed = false;
  size_changed = false;
  redraw_reason = "";
  if(gif || animation) loop(); 
  //else necessary when redrawing timed pieces
  else noLoop();
}

function setParams(){
  seed_param = verify_seed(getParamValue("seed"));
  palette_changed = palette_changed || colors_param != getParamValue("colors");
  colors_param = verify_colors(getParamValue("colors"));
  multiplier_changed = multiplier_changed || scale_param != getParamValue("scale");
  scale_param = verify_scale(getParamValue("scale"));
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

function seed_scale_button(control_height, control_spacing){
  const ids = ["Bt Left", "Seed", "Bt Right", "Custom Seed", "Reset Palette", "Color Select", "Randomize", "Color Boxes"];
  const full_ids = ["Auto Scale", "Scale Box", "Reset Parameters", "X Size Val", "Y Size Val", "Size Units", "Save", "File Type"];

  if(!redraw){
    //declare unchanging properties
    //START OF TOP ROW
    //left/right buttons for easy seed nav
    btLeft = createButton('<');
    btLeft.mouseClicked(previous_seed);
    btLeft.id('Bt Left')

    //creates controls below canvas for displaying/setting seed
    seed_input = createInput("seed");
    seed_input.style("text-align", "right");
    seed_input.id('Seed');

    //left/right buttons for easy seed nav
    btRight = createButton('>');
    btRight.mouseClicked(next_seed);
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
        const pal = protected_storage_get(palette_names[global_palette_id], "local");
        if(pal != null){
          protected_storage_remove(palette_names[global_palette_id], "local");
          palette_changed = true;
          redraw_sketch();
        }
      });
      reset_palette.id('Reset Palette');
    }

    //randomize button
    randomize = createButton("Randomize");
    randomize.mouseClicked(randomize_seed);
    randomize.id('Randomize');

    //START OF SECOND ROW
    //color palette select
    color_sel = createSelect();
    palette_names.forEach(name => {
      if(!exclude_palette.includes(name) || controls_param == "full"){
        color_sel.option(name);
      }
    });
    color_sel.selected(palette_names[current_palette_index()]);
    color_sel.changed(set_seed);
    color_sel.id('Color Select');

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
    reset_parameters = createButton("Reset Params");
    reset_parameters.mouseClicked(clear_params);
    reset_parameters.id("Reset Parameters");

    //size parameters
    x_size_input = createInput();
    x_size_input.style("text-align", "right");
    x_size_input.id('X Size Val');

    y_size_input = createInput();
    y_size_input.style("text-align", "right");
    y_size_input.id('Y Size Val');

    unit_select = createSelect();
    unit_select.option("px");
    unit_select.option("in");
    if(type == "png") unit_select.selected("px");
    else unit_select.selected("in");
    unit_select.changed(populate_size_inputs);
    unit_select.id('Size Units');

    //save button
    btSave = createButton("Save");
    btSave.mouseClicked(save_drawing);
    btSave.id("Save");
  }

  if(!redraw || multiplier_changed || size_changed || redraw_reason == "window"){
    //resize for given global scale
    //START OF TOP ROW
    //left/right buttons for easy seed nav
    btLeft.size(20*global_scale, control_height);
    btLeft.position(0, canvas_y);

    //creates controls below canvas for displaying/setting seed
    seed_input.size(55*global_scale, control_height-6);
    seed_input.position(btLeft.size().width,canvas_y);

    //left/right buttons for easy seed nav
    btRight.size(20*global_scale, control_height);
    btRight.position(seed_input.size().width + seed_input.position().x, canvas_y);

    //custom seed button
    button.size(90*global_scale, control_height)
    button.position(btRight.size().width + btRight.position().x + control_spacing, canvas_y);

    if(!in_iframe){
      //reset palette button
      reset_palette.size(90*global_scale, control_height)
      reset_palette.position(button.size().width + button.position().x + control_spacing, canvas_y);
    }

    //randomize button
    randomize.size(80*global_scale, control_height);
    randomize.position(400*global_scale-randomize.size().width, canvas_y);

    //START OF SECOND ROW
    //color palette select
    color_sel.position(0, canvas_y+control_height);
    color_sel.size(120*global_scale, control_height);

    //file type radio control
    radio_filetype.size(80*global_scale, control_height);
    radio_filetype.position(400*global_scale-radio_filetype.size().width, canvas_y + control_height);

    //------------------------ CUTOFF FOR FULL CONTROLS ------------------------
    //START OF THIRD ROW
    //autoscale button calls url minus any scaler
    auto_scale.position(0, canvas_y + control_height*2);
    auto_scale.size(70*global_scale, control_height)

    //scale text box
    scale_box.position(auto_scale.size().width+control_spacing, canvas_y+control_height*2)
    scale_box.size(30*global_scale, control_height-6);
    scale_box.value(global_scale);

    //reset parameters button
    reset_parameters.position(scale_box.position().x+scale_box.size().width+control_spacing, canvas_y+control_height*2);
    reset_parameters.size(100*global_scale, control_height);

    //size parameters
    x_size_input.position(reset_parameters.position().x+reset_parameters.size().width+control_spacing, canvas_y+control_height*2);
    x_size_input.size(30*global_scale, control_height-6);
    y_size_input.position(x_size_input.position().x+x_size_input.size().width, canvas_y+control_height*2);
    y_size_input.size(30*global_scale, control_height-6);
    unit_select.position(y_size_input.position().x+y_size_input.size().width, canvas_y+control_height*2);
    unit_select.size(40*global_scale, control_height);

    //save button
    btSave.size(50*global_scale, control_height);
    btSave.position(400*global_scale-50*global_scale, canvas_y+control_height*2);

    //style all ctrls
    ids.concat(full_ids).forEach(id => {
      const elem = document.getElementById(id)
      if(elem){
        elem.style.fontSize = str(12*global_scale) + 'px';
      }
    });

    show_hide_controls(ids, controls_param == "false");
    show_hide_controls(full_ids, controls_param != "full");
  }
  seed_input.value(seed_param); //needs to be set every time
}

function populate_size_inputs(){
  if(unit_select.value() == "in"){
    x_size_input.value(parseInt(x_size_px_param)/96);
    y_size_input.value(parseInt(y_size_px_param)/96);
  }
  else{
    x_size_input.value(x_size_px_param);
    y_size_input.value(y_size_px_param);
  }
}

function update_size_params(){
  const x_val = x_size_input.value();
  const y_val = y_size_input.value();
  if(!isNaN(x_val) && parseInt(x_val) > 0){
    x_size_px_param = x_val;
    if(unit_select.value() == "in") x_size_px_param = String(parseInt(x_val) * 96);
  }
  if(!isNaN(y_val) && parseInt(y_val) > 0){
    y_size_px_param = y_val;
    if(unit_select.value() == "in") y_size_px_param = String(parseInt(y_val) * 96);
  }
}

function randomize_seed(){
  seed_input.value(build_seed());
  set_seed();
}

function next_seed(){
  seed_input.value(int(seed_input.value())+1);
  set_seed();
}

function previous_seed(){
  seed_input.value(int(seed_input.value())-1);
  set_seed();
}

function show_hide_controls(arr, hide){
  arr.forEach(ctrl => {
    const elem = document.getElementById(ctrl);
    if(elem){
      if(hide) elem.style.visibility = "hidden";
      else elem.style.visibility = "visible";
    }
  });
}

function current_palette_index(){
  //returns the integer value of the current palette
  return palette_names.indexOf(color_sel.value());
}

window.onpopstate = function(){
  //captures the back/forward browser buttons to move between history states without reloading the page
  redraw_sketch();
};

function set_seed(e){
  let event_id;
  if(e == undefined) event_id = "";
  else event_id = e.srcElement.id;

  update_size_params();
  seed_param = String(seed_input.value());
  colors_param = String(current_palette_index());
  palette_changed = current_palette_index() != int(getParamValue('colors'));
  multiplier_changed = scale_box.value() != find_cnv_mult(canvas_x/global_scale, canvas_y/global_scale);
  size_changed = x_size_px_param != getParamValue("x_size_px") ||  y_size_px_param != getParamValue("y_size_px");
  const auto = event_id == "Auto Scale" || (scale_param == "auto"  && !multiplier_changed);
  
  if(auto) scale_param = build_scale(); 
  else scale_param = scale_box.value();
  
  //using pushState allows for changing the url, and then redrawing without needing to reload the page
  window.history.pushState({}, "", build_url());

  if(event_id == "Color Select"){
    palette_changed = true; //color picker was used
    document.getElementById("Color Select").blur(); //un-focus color select 
  }

  redraw_sketch();
}

function keyTyped(e) {
  // user presses enter, it sends Custom seed and custom scale
  const event_id = e.srcElement.id;
  if(keyCode === ENTER && (event_id == "Seed" || event_id == "Scale Box" || event_id == "X Size Val" || event_id=="Y Size Val")){
    set_seed(e); //pass thru event details
  }
  else if(keyCode == 65) previous_seed(); //A key
  else if(keyCode == 83) randomize_seed();//S key
  else if(keyCode == 68) next_seed();     //D key
}

function set_file_type(){
  //radio button changed
  const val = radio_filetype.value();
  protected_storage_set("fileType", val, "session");
  //hard refresh of window with current url values
  window.location.href = window.location.href;
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
    console.log("Unable to reduce array. Arr: ", arr, "Item to Remove: ", remove);
  }
}

function save_drawing(){
  //get project name
  let scale_text = round(global_scale*1000)/1000; //round to nearest 1000th place
  scale_text = str(scale_text).replace(".", "_");
  const filename = str(project_name) + '_seed_' + str(seed_input.value()) + '_colors_' + str(current_palette_index()) + '_scale_' + scale_text;
  if(type == 'svg')save(filename);
  else saveCanvas(filename, type);
  file_saved = true;
}

function global_draw_start(clear_cnv=true){
  attach_icons(); //attach icons decides whether to add dice and slash or not

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
}

function global_draw_end(){
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
  else c = random(working_palette);
  
  background(c);
  if(remove == true) reduce_array(working_palette, c);
  return c;
};
function bg_vertical_strips(strips){
  push();
  noStroke();
  translate(-canvas_x/2, -canvas_y/2)
  for(let i=0; i<strips; i++){
    fill(random(working_palette));
    rect(0, 0, canvas_x*2, canvas_y*2);
    if(i==0) translate(canvas_x/2,0);
    translate(floor(canvas_x/strips), 0);
  }
  pop();
}

function bg_horizontal_strips(strips){
  push();
  noStroke();
  translate(-canvas_x/2, -canvas_y/2)
  for(let i=0; i<strips; i++){
    fill(random(working_palette));
    rect(0, 0, canvas_x*2, canvas_y*2);
    if(i==0) translate(0,canvas_y/2);
    translate(0, floor(canvas_y/strips));
  }
  pop();
}

function bg_center_ellipse(){
  bg();
  push();
  noStroke();
  fill(random(working_palette));
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
  for(const key in gui_params){
    gui_params[key].frozen = false;
  }

  clearMIDIvalues();
  remove_parameters();

  redraw_reason = "reset_parameters";
  redraw_sketch();
}

function windowResized(e) {
  if(controls_param == "full") snap_gui_to_window();
  if((getParamValue('scale') == "auto" && find_cnv_mult(canvas_x/global_scale, canvas_y/global_scale) != global_scale)){
    redraw_reason = "window";
    redraw_sketch();
  }
}

function redraw_sketch(){
  redraw = true;
  if(gif && animation && (redraw_reason == "gui" || redraw_reason == "midi")){
    gui_values();
    return;
  }
  setup();
  draw();
}

function change_default_palette(){
  global_palette_id = parseInt(colors_param);
  //check if local storage
  const stored_palette = protected_storage_get(palette_names[global_palette_id], "local")
  if(stored_palette != null) palette = JSON.parse(stored_palette);
  else palette = JSON.parse(JSON.stringify(palettes[global_palette_id]));
  color_sel.selected(palette_names[global_palette_id]);

  refresh_working_palette();
}

function refresh_working_palette(){
  working_palette = JSON.parse(JSON.stringify(palette));
}

function find_cnv_mult(size_x, size_y){
  //for SVG work, set scale to 1 to maintain css units of 1px = 1/96inch
  if(type == "svg") return 1;
  size_x = max(400, size_x); //because we center within a 400x400 canvas for things smaller than 400

  if(controls_param == "true") size_y += 40;
  else if(controls_param == "full") size_y += 60;

  size_y += 3; //extra 3 is make sure no vertical scrollbar in all window conifgurations

  const x_mult = Math.round((windowWidth/size_x)*1000)/1000; //find multiplier based on the x dimension  
  const y_mult = Math.round((windowHeight/size_y)*1000)/1000; //find multipler based on the y dimension

  let smaller_multiplier = min(x_mult, y_mult);  //find the smaller mult
  
  //constrain between 1 and 12
  smaller_multiplier = constrain(smaller_multiplier, 1, 12);

  //get a mult that will give an even number of whole pixels for the x dimension
  if(round(size_x*smaller_multiplier) % 2 != 0) smaller_multiplier = (round(size_x*smaller_multiplier)-1)/size_x; //-1 so that the canvas is always slightly smaller than the window

  //canvas_x and canvas_y rounded later on

  //check for change in multiplier due to gui param changes
  multiplier_changed = smaller_multiplier != global_scale
  if(multiplier_changed) previous_scale = global_scale;
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
    seed: seed_param,
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
        key:[dir,seed_param,palette].join("_"),
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

function protected_storage_get(name, type){
  try{ 
    if(type == "session") return sessionStorage.getItem(name);
    else if(type == "local") return localStorage.getItem(name); 
    else console.log("storage type not properly specified");
  }
  catch(err){
    console.log("Cannot access " + type + " storage to set item, probably an ad blocker issue");
    return null;
  }
}

function protected_storage_set(name, val, type){
  try{
    if(type == "session") sessionStorage.setItem(name, val);
    else if(type == "local") localStorage.setItem(name, val);
    else console.log("storage type not properly specified");
  }
  catch(err){
    console.log("Cannot access " + type + " storage to set item, probably an ad blocker issue");
  }
}

function protected_storage_remove(name, type){
  try{
    if(type == "session") sessionStorage.removeItem(name);
    else if(type == "local") localStorage.removeItem(name);
    else console.log("storage type not properly specified");
  }
  catch(err){
    console.log("Cannot access " + type + " storage to set item, probably an ad blocker issue");
  }
}

window.onunload = function(){save_parameters()}

//create separate overwrite gui function

function save_parameters(){
  //called from onunload event when the page changes
  protected_storage_set(parameter_storage_name, JSON.stringify(gui_params), "session");
}

function remove_parameters(){
  //when Reset Parameters
  protected_storage_remove(parameter_storage_name, "session");
}


function parameterize(name, val, min, max, step, scale, midi_channel){
  if(scale == undefined || scale != true) scale=false;
  if(midi_channel == undefined) midi_channel = false;

  if(midi_channel){
    const channel_name = give_grid_chanel_name(midi_channel);
    const channel_value = protected_storage_get(channel_name, "session");
    if(channel_value != null){
      val = map(channel_value, 0, 127, min, max); //midi vals go from 0 to 127
      val = round(val/step)*step; //coerce to nearest step val
    }
  }
  if(redraw && controls_param == "full"){
    for(const control_name in gui.prototype._controls){
      if(control_name != name) continue;
  
      let gui_val = gui.prototype._controls[name].getValue();
      if(redraw_reason == "gui"){
        if(!multiplier_changed){
          if(scale) gui_val = gui_val/global_scale;
          //don't freeze params that change due to multiplier changing or rounding errors. Multiplier changed only happens when size_x, size_y change
          if(val != gui_val && abs(val - gui_val) >= step) gui_params[name].frozen = true;
        }
        if(gui_params[name].frozen) val = gui_val;
      }
      else if(gui_params[name].frozen){
        val = gui_val;
        if(scale && multiplier_changed) val = val/previous_scale;
        else if(scale && !multiplier_changed) val = val/global_scale;
      }
    }
  }

  if(gui_params[name] == undefined){
    gui_params[name] = { //store pre-scaled value if it doesn't exist
      value:val,
      min:min,
      max:max,
      step:step,
      scale:scale,
      frozen:false
    };
  }
  else{
    if(!redraw && gui_params[name].frozen) val = gui_params[name].value; //retrieve stored value
    gui_params[name].value = val;
    gui_params[name].min = min;
    gui_params[name].max = max;
    gui_params[name].step = step;
    gui_params[name].scale = scale;
  }

  if(scale){
    val = val*global_scale;
    min = min*global_scale;
    max = max*global_scale;
    step = step*global_scale;
  }

  //writes/overwrites global params for p5.gui to use
  create_global_parameters(name, val, min, max, step);
}

function create_global_parameters(name, val, min, max, step){
  //if gui is reason for redrawing, let p5.gui handle the values directly
  if(redraw_reason != "gui"){
    //create or overwrite all globals
    if(Array.isArray(val)){
      let val_string = JSON.stringify(val);
      eval('globalThis.' + name +" = " + val_string);
    }
    else eval('globalThis.' + name +" = " + val);

    if(min != undefined) eval('globalThis.' + name + "Min =" + min);
    if(max != undefined) eval('globalThis.' + name +"Max =" + max);
    if(step != undefined) eval('globalThis.' + name +"Step =" + step);

    if(redraw && controls_param == "full") gui_force_update(name, val, min, max, step);
  }
}

function gui_force_update(name, val, min, max, step){
  //force gui to update shown values
  gui.prototype._controls[name].control.min = String(min);
  gui.prototype._controls[name].control.max = String(max);
  gui.prototype._controls[name].control.step = String(step);
  gui.prototype._controls[name].setValue(val);
}

function attach_icons(){
  // finds param gui and creates dice icon and slashes to indicate unfrozen/frozen/disabled
  //Dice icon attribution
  //<a href="https://www.flaticon.com/free-icons/dice" title="dice icons">Dice icons created by Freepik - Flaticon</a>

  const gui_containers = document.getElementsByClassName("qs_container");
  gui_containers.forEach(container => {
    let gui_label = container.getElementsByClassName("qs_label")[0];
    if(gui_label == undefined){
      //check if checkbox
      gui_label = container.getElementsByClassName("qs_checkbox_label")[0];
      
      if(gui_label == undefined){
        //otherwise post error with container
        console.log("cannot find label in control: ", container);
      }
    }

    //after initial creation, the only one that needs dice is the edited gui param
    if(gui_label.querySelector('.dice') != null) return; //only create dice if necessary

    let parameter_label_name = gui_label.textContent.split(": ")[0];

    let div = document.createElement('div');
    div.className = "dice";

    //append dice image
    let dice = document.createElement('img');
    dice.src = "/images/dice.png";
    dice.style = "height: 25px; position: relative; z-index: 0;";
    //if dice clicked, apply slash
    dice.addEventListener('click', (e)=>{
      let slash = create_slash(parameter_label_name);
      e.target.parentElement.appendChild(slash);
      gui_params[parameter_label_name].frozen = true;
    });

    div.appendChild(dice);

    if(gui_params[parameter_label_name].frozen){
      //append red slash
      div.appendChild(create_slash(parameter_label_name));
    }
    
    gui_label.appendChild(div);
  })
}

function create_slash(parameter_label_name){
  let slash = document.createElement('img');
  slash.id = "slash";
  slash.src = "/images/red_slash_up.svg";
  slash.style = "height: 25px;position: relative;z-index: 1; right: 25px;";
  //if slash clicked, remove slash
  slash.addEventListener('click', (e)=>{
    e.target.remove();
    gui_params[parameter_label_name].frozen = false;
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

  protected_storage_set("gui_loc", JSON.stringify(rect), "session");
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
  if(gui_collapsed) attach_icons(); 
  //toggle gui collapsed status
  gui_collapsed = !gui_collapsed;
  protected_storage_set("gui_collapsed", JSON.stringify(gui_collapsed), "session");
}

function retrieve_gui_settings(){
  if(controls_param != "full") return;
  // retrieve gui collapsed status and location
  let stored_loc = protected_storage_get("gui_loc", "session");
  let collapsed = protected_storage_get("gui_collapsed", "session");
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

function controlled_shuffle(array, standardize=false, len=longest_palette_length) {
  //shuffle algorithm that can standardize the size of the array so 
  //it won't cause seed issues using different palette lengths.
  if(standardize){
    while(array.length<len){
      array.push([""]);
    }
  }
  //call original shuffle function
  array = shuffle(array);

  return array.filter(a => !arrayEquals(a, [""]));
}
