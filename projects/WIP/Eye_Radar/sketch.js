gif = true;
fr = 30;

xoff = 0;
inc = 0.01*60/fr;

capture = false;
capture_time = 10;

let gui_params = [];

function gui_values(){

}

function setup() {
  common_setup(gif);

  palette = shuffle(palette, true);
  bg_c = random(palette)
  reduce_array(palette, bg_c)
  bg_c = color(bg_c);

  //params
  radar_deg = 0;
  radar_speed = 5;
  eye_size = 100*global_scale;
  pupil_size = eye_size/3;
  //must be even, not sure why yet
  num_lines = 4;
  line_len = floor(((eye_size-pupil_size)/2)/num_lines);
  iris_groups = 6;

  line_segs=[];
  create_line(0, 0, 0, 0);
  //Dont' know why this is necessary, but round/project gives weird nodes at line connection points
  strokeCap(SQUARE)
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();
  //bleed
  const bleed_border = apply_bleed();
  //actual drawing stuff
  push();
  bg_c.setAlpha(255);
  background(bg_c);

  for(let i=0; i<2; i++){
    push();
    translate(canvas_x/4+i*canvas_x/2, canvas_y/2);

    for(let j=0; j<iris_groups; j++){
      push();
      rotate(j*360/iris_groups);
      // translate(canvas_x/2, canvas_y/2);

      strokeWeight(1*global_scale);
      line_segs.forEach(l => {
        stroke(l.color)
        line(l.prev_x, l.prev_y, l.x, l.y)
      });
      pop();
    }

    //pupil
    fill("BLACK");
    noStroke();
    circle(0,0, pupil_size)

    //overwrite the rest
    radar_cover();

    //eyelids
    noFill();
    stroke("WHITE");
    strokeWeight(global_scale*3);
    beginShape();
    curveVertex(-canvas_x/4, 0);
    curveVertex(-canvas_x/4, 0);
    curveVertex(0, -canvas_y/8);
    curveVertex(canvas_x/4, 0);
    curveVertex(canvas_x/4, 0);
    endShape();

    beginShape();
    curveVertex(-canvas_x/4, 0);
    curveVertex(-canvas_x/4, 0);
    curveVertex(0, canvas_y/8);
    curveVertex(canvas_x/4, 0);
    curveVertex(canvas_x/4, 0);
    endShape();
    pop();
  }
  radar_deg+= radar_speed;
  //correct for potential overflow
  radar_deg = radar_deg%360;

  xoff += inc;
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function radar_cover(){
  push();
  rotate(radar_deg);
  bg_c.setAlpha(255);
  fill(bg_c);
  noStroke();
  arc(0,0, eye_size+2*global_scale, eye_size+2*global_scale, 0, 270)
  for(let i=0; i<8; i++){
    bg_c.setAlpha(70+4*i);
    fill(bg_c);
    arc(0,0, eye_size+2*global_scale, eye_size+2*global_scale, 270, 270+(i+1)*2);
  }
  pop();
}

function create_line(depth, prev_x, prev_y, prev_theta){
  if(dist(0,0,prev_x,prev_y)<(eye_size-5*global_scale)/2){
    depth++
    create_line(depth, ...draw_line(depth, prev_x, prev_y, prev_theta))
    create_line(depth, ...draw_line(depth, prev_x, prev_y, prev_theta))
  }
}

function draw_line(depth, prev_x, prev_y, prev_theta){
  theta = floor(map(random(), 0,1, -22.5,22.5)) + prev_theta;
  x = depth*line_len*cos(theta);
  y = depth*line_len*sin(theta);
  line_segs.push({
    prev_x:prev_x,
    prev_y:prev_y,
    x:x,
    y:y,
    color:color(random(palette))
  })

  return [x,y, theta];
}
