gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  common_setup(gif);
  change_default_palette(random([1, 9]));
  if(!capture){
    frameRate(fr);
  }
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  petal_size = random(35,45)*global_scale;

  translate(canvas_x/2, canvas_y/2);
  if(random([0,1])==0){
    noStroke();
  }
  else{  
    stroke('black');
    strokeWeight(0.5*global_scale);}
  distance = canvas_y/random(3,5);
  for(let i=0; i<random(8,12); i++){
    rotate(random(0,360));
    petal_c = random(working_palette);
    fill(petal_c);
      // Shadow
    drawingContext.shadowColor = color(petal_c);
    drawingContext.shadowBlur = 10*global_scale;

    //at 30 or higher, the last half petal applies tends to overwrite lines
    petalLayer(floor(random(12,26)), distance);

    petal_size *= random(0.6, 0.9);
    distance *= random(0.7, 0.8);
  }

  pop();
  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function petal(start_y, close){
  push();
  translate(0, start_y);
  beginShape();
  curveVertex(0,0);
  curveVertex(0,0);
  curveVertex(petal_size/2, petal_size/2);
  curveVertex(0, petal_size);
  curveVertex(-petal_size/2, petal_size/2);
  if(close){
    endShape(CLOSE);
  }
  else{
    endShape()
  }
  pop();
}

function petalLayer(num_petal, distance){
  for(let i=0; i<=num_petal; i++){
    rotate(360/num_petal);
    petal(distance, i!=num_petal);
  }
}