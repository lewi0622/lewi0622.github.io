'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function gui_values(){
  parameterize("frequency", random(0.5,2), 0.01, 50, 0.01, false);
  parameterize("octaves", 4, 1, 10,1,false);
  parameterize("falloff", 0.5, 0, 1, 0.01, false);
  parameterize("power_value", random(1.5,3), 0.1,10, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  let bg_c = random(working_palette);
  background(bg_c);
  reduce_array(working_palette,bg_c);

  working_palette.forEach((pal,id) => {
    working_palette[id] = RGBA_to_HSBA(...pal);
  });
  let land_color = random(working_palette);
  let water_color = random(working_palette);
  colorMode(HSB);
  water_color[3] = 0.5;
  print(water_color);

  noStroke();
  noiseDetail(octaves, falloff);
  let xoffset = random(-100,100);
  let yoffset = random(-100,100);
  const pts = [];
  let step_num = 200;
  let setp_size = canvas_x/step_num;
  for(let i=0; i<=step_num; i++){
    for(let j=0; j<=step_num; j++){
      let val = 
        noise(frequency/step_num*i-0.5+xoffset,frequency/step_num*j-0.5+yoffset)
        + 0.5 * noise(2*frequency/step_num*i-0.5+xoffset,2*frequency/step_num*j-0.5+yoffset)
        + 0.25 * noise(4*frequency/step_num*i-0.5+xoffset,4*frequency/step_num*j-0.5+yoffset)
      val = val/(1+0.5+0.25);
      val = Math.pow(val,power_value);
      pts.push({x: i*setp_size, y: j*setp_size, val:val});
    }
  }

  pts.sort((a,b)=>{
    if(a.val<b.val) return -1;
    if(a.val>b.val) return 1;
    return 0;
  });

  let buckets = 100;
  pts.forEach(pt => {
    pt.val = round(pt.val*buckets)/buckets;
  });

  pts.forEach(pt => {
    if(pt.val<0.2){
      water_color[2] = map(pt.val,pts[0].val,0.2,50,100);
      fill(water_color);
      circle(pt.x, pt.y, map(pt.val, pts[0].val,pts[pts.length-1].val,25,4)*global_scale);
    }
    else{
      land_color[2] = map(pt.val,pts[0].val,pts[pts.length-1].val,0,100);
      fill(land_color);
      square(pt.x, pt.y, map(pt.val, pts[0].val,pts[pts.length-1].val,25,4)*global_scale, 5*global_scale);
    }



  });


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
