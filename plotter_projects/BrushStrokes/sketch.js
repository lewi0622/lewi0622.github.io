gif = false;
fr = 1;

capture = false;
capture_time = 8;
function setup() {
  common_setup(gif, SVG);
  layers = 3;  
  brush_width = canvas_y/layers;

  colors = gen_n_colors(layers+1);
  noFill();
  weight = 1*global_scale;
  strokeWeight(weight);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();
  push();

  noiseDetail(random(4));

  translate(canvas_x/2, canvas_y/2);

  steps = floor(random(200,400));

  brush_rad = canvas_y*0.95/2;

  for(let z=0; z<layers; z++){
    push();
    start_y = -brush_width/2;
    rotate(random(360));  
    noise_start = random(100);

    stroke(colors[z]);
    while(start_y<brush_width/2){
      start_theta = find_theta_y(start_y, brush_rad)
      start_x = polar_to_cartesian(brush_rad, start_theta).x;

      x = start_x;
      y = start_y;

      in_circle=true;
      i=0;
      beginShape();
      while(in_circle){
        vertex(x,y);
        prev_x = x;
        prev_y = y;

        x -= canvas_x/steps
        y += map(noise(noise_start + i/75), 0,1, -5,5)*global_scale;

        //check if in circle
        in_circle = cartesian_to_polar(x,y).r<brush_rad;

        i++;
      }
      //final vertex on circle
      //check if more vertical or horizontal
      if(Math.abs(x-prev_x)>Math.abs(y-prev_y)){
        end_y = (y-prev_y)/2 + prev_y;
        if(x>0){
          end_theta = find_theta_y(end_y, brush_rad);
        }
        else{
          end_theta = (180 + find_theta_y(end_y, brush_rad)) * -1;
        }
  
        end_x = polar_to_cartesian(brush_rad, end_theta).x;
      }
      else{
        end_x = (x-prev_x)/2 + prev_x;
        end_theta = find_theta_x(end_x, brush_rad)
        if(y<0){
          end_theta += 180;
        }
        end_y = polar_to_cartesian(brush_rad, end_theta).y;
      }

      vertex(end_x, end_y);
      endShape();

      start_y += random(canvas_y*.01);
      
    }
    pop();
  }
  pop();
  stroke(colors[colors.length-1]);
  circle(canvas_x/2, canvas_y/2, brush_rad*2-weight*2);
  circle(canvas_x/2, canvas_y/2, brush_rad*2-weight);
  circle(canvas_x/2, canvas_y/2, brush_rad*2);
  circle(canvas_x/2, canvas_y/2, brush_rad*2+weight);
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs

function polar_to_cartesian(r, theta){
  return {
    x: r*cos(theta),
    y: r*sin(theta)
  }
}

function cartesian_to_polar(x, y){
  return {
    r: Math.sqrt(Math.pow(x,2)+Math.pow(y,2)),
    theta: atan(y/x)
  }
}

function find_theta_y(y, r){
  return asin(y/r);
}
function find_theta_x(x, r){
  return acos(x/r);
}