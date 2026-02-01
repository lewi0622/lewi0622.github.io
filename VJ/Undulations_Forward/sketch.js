'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 20;

const suggested_palettes = [BEACHDAY, SUMMERTIME, SOUTHWEST, NURSERY, SIXTIES, SUPPERWARE]

let z = 0;
let z_inc = 0.1*30/fr;
let offset = 0;
let offset_inc = 0.03*30/fr;
let moon_c;
let mts;
let idx;
let mode;
function gui_values(){
  parameterize("i_damp", 4, 1, 200, 1, false, grid_slider_1);
  parameterize("mt_spacing", 10, 1, 100, 1, false);
  parameterize("num_segments", round(random(10, 50)), 3, 400, 1, false, grid_slider_4);
  parameterize("moon", 1, 0, 1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  mts = [];
  mode = BLEND;
  idx = 0;
  for(let i=0; i<80; i++){
    create_mt();
    mts.forEach(mt => {
      for(let j=0; j<mt_spacing; j++){
        move_mt(mt);
      }
    });
    remove_mt();
  }
  pixelDensity(2);
  document.body.style.background = "BLACK";
}
//***************************************************
function draw() {
  global_draw_start();
  
  //apply background
  if(frameCount == 1){
    moon_c = random(working_palette);
  }

  if(frameCount % mt_spacing == 0) create_mt();

  //actual drawing stuff
  push();
  strokeWeight(0.5*global_scale);

  if(moon){
     fill(moon_c);
    const moon_x = map(sin(z*50), -1,1, 0, canvas_x);
    const moon_y = map(abs(sin(z*50)), 0, 1, 80, 200)*global_scale;
    map(sin(z*200), -1,1, 150, 200) * global_scale;
    circle(moon_x, moon_y, 100*global_scale); 
  }

  translate(-canvas_x/2,canvas_y*3/4);
  for(let j = mts.length-1; j>=0; j--){
    push();
    let mt = mts[j];
    blendMode(mt.mode);
    translate(0,mt.y);
    fill(mt.color);
    beginShape();
    vertex(0,0);
    vertex(0,0);
    for(let i=0; i<num_segments; i++){
      let x = i*canvas_x*2/num_segments;
      let y = map(noise(offset + i/i_damp, mt.noise_index/10, z), 0, 1, 0,-mt.amp);
      curveVertex(x,y);
    }
    vertex(canvas_x*2,0);
    vertex(canvas_x*2,canvas_y);
    vertex(0, canvas_y);
    endShape(CLOSE);

    move_mt(mt);
    pop();
  }

  z+=random(z_inc);

  remove_mt();
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function create_mt(){
  mts.push(
    {
      y:0,
      y_speed:0.5*global_scale,
      amp:0,
      noise_index: idx,
      color: random(working_palette),
      mode: mode,
      dir: "up"
    }
  )
  idx++;
  if(mode == BLEND) mode = MULTIPLY;
  else mode = BLEND;
}

function move_mt(mt){
  let amp_inc = 50*global_scale;
  if(mt.dir == "up") mt.amp += amp_inc;
  else mt.y += mt.y_speed;
  if(mt.amp>=canvas_y/2) mt.dir = "down"
}

function remove_mt(){
  for(let i=mts.length-1; i>=0; i--){
    if(mts[i].y>canvas_y*3/4){
      mts.splice(i,1);
    }
  }
}
