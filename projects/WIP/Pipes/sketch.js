gif = false;
fr = 30;

xoff = 0;
noise_off = 20;
inc = 0.5*60/fr;

capture = false;
capture_time = 10;

let gui_params = [];

function gui_values(){

}

function setup() {
  common_setup(gif);

  strokeCap(ROUND);
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();
  //bleed
  const bleed_border = apply_bleed();

  //apply background
  bg(true);

  center_rotate(floor(random(360)));

  //actual drawing stuff
  push();

  strokeWeight(3*global_scale);
  num_pipes = 20;
  pipes = [...Array(num_pipes)].map(() => {
    return {
      x:0,
      y:0,
      weight:random(3,15)*global_scale,
      color: null
    };
  });

  palette = shuffle(palette, true);

  pipes.forEach(pipe => {
    //set color
    c = random(palette);
    pipe.color = color(c);
    if(palette.length>1 && random()<0.4){
      reduce_array(palette, c);
    }
  });

  pipes = shuffle(pipes);

  pipes.forEach((pipe, idx) => {
    pipe.y = canvas_y*1.5; 
    if(idx == 0){
      pipe.x = 0;
    }
    else{
      pipe.x = pipes[idx-1].x + canvas_x/num_pipes;
    }
  });

  for(let j=0; j<200; j++){
    pipes = shuffle(pipes);
    for(let i=0; i<num_pipes; i++){
      push();
      strokeWeight(pipes[i].weight);
      stroke(pipes[i].color);
      translate(pipes[i].x, pipes[i].y);
      line_dist = 40;
      dir = random([-1,0,1]);
      if(dir == -1){
        line(0,0, -line_dist,0);
        pipes[i].x -= line_dist;
      }
      else if(dir == 1){
        line(0,0, line_dist,0);
        pipes[i].x += line_dist;
      }
      else{
        line(0,0, 0,-line_dist);
        pipes[i].y -= line_dist;
      }
      pop();
    }
  }

  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs