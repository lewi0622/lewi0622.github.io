'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME];

function gui_values(){
  const division = random(3, 10);
  const col_division = random([division*2, division, division, division]);
  const row_division = random([division*2, division, division, division]);
  parameterize("cols", floor(base_x/col_division), 1, base_x, 1, false);
  parameterize("rows", floor(base_y/row_division), 1, base_y, 1, false);
  parameterize("hair_width", smaller_base/random(60,100), 1, smaller_base/4, 1, true);
  parameterize("x_margin", -base_x/2, -base_x/2, base_x/2, 1, true);
  parameterize("y_margin", -base_y/2, -base_y/2, base_y/2, 1, true);
  parameterize("iterations", floor(random(10,25)), 1, 500, 1, false);
  parameterize("step_size", random(1,5), 1, 50, 1, true);
  const damp = random(700,1000);
  parameterize("x_damp", damp, 1, 1500, 1, false);
  parameterize("y_damp", damp, 1, 1500, 1, false);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
  parameterize("simplex", round(random()), 0, 1, 1, false);
  parameterize("eye_size", smaller_base/4, 1, larger_base, 1, true);
  parameterize("eye_x_displacement", 0, -smaller_base/2, smaller_base/2, 1, true);
  parameterize("eye_y_displacement", 0, -smaller_base/2, smaller_base/2, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  center_rotate(-90);
  noFill();
  strokeWeight(LEPEN*global_scale);
  const bg_c = png_bg(true);
  // background("WHITE")
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    // colors[i].setAlpha(150);
  }
  const col_step = (canvas_x-x_margin*2)/cols;
  const row_step = (canvas_y-y_margin*2)/rows;
  translate(x_margin, y_margin);

  const lines = [];
  for(let k=0; k<cols; k++){
    for(let l=0; l<rows; l++){
      const starting_pt = {
        x:k*col_step + random(-0.5, 0.5) * col_step, 
        y:l*row_step + random(-0.5, 0.5) * row_step,
        ang: NaN};
      const pts = [starting_pt];
      const reverse_pts = [starting_pt];
      let wild_hair_offset = 0;
      if(random()>0.95) wild_hair_offset = 0.1;
      for(let i=0; i<iterations; i++){
        const starting_pt = pts[i];
        const reverse_starting_pt = reverse_pts[i];
        let angle, reverse_angle;

        if(simplex){
          angle = pnoise.simplex2(wild_hair_offset + starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp) * 90;
          reverse_angle = 180 + pnoise.simplex2(wild_hair_offset + reverse_starting_pt.x/global_scale/x_damp, reverse_starting_pt.y/global_scale/y_damp) * 90;
        }
        else{
          angle = noise(wild_hair_offset + starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp) * 180;
          reverse_angle = 180 + noise(wild_hair_offset + reverse_starting_pt.x/global_scale/x_damp, reverse_starting_pt.y/global_scale/y_damp) * 180;
        }
        pts.push({
          x: starting_pt.x + step_size * cos(angle),
          y: starting_pt.y + step_size * sin(angle),
          ang: angle
        });
        reverse_pts.push({
          x: reverse_starting_pt.x + step_size * cos(reverse_angle),
          y: reverse_starting_pt.y + step_size * sin(reverse_angle),
          ang: reverse_angle + 180
        });
      }
      reverse_pts.splice(0,1);//remove duplicate starting point
      lines.push(reverse_pts.reverse().concat(pts));
    }
  }

  fill(bg_c);
  const eye_iteration = round(random(0.9,1.1) * lines.length/2);
  const pupil_pt = {
    x: random(-0.3, 0.3)*eye_size,
    y: random(-0.3, 0.3)*eye_size,
    size: random(eye_size/3, eye_size/2)};
  for(let j=0; j<lines.length; j++){
    const all_pts = lines[j];
    if(j == eye_iteration){// || j == eye_iteration + 50){
      push();
      line_blur(color("BLACK"), 0);
      translate(all_pts[0].x*0.95 + eye_x_displacement, all_pts[0].y*0.95 + eye_y_displacement);
      fill(bg_c);
      stroke("BLACK");
      circle(0,0, eye_size);
      fill("BLACK");
      circle(pupil_pt.x, pupil_pt.y, pupil_pt.size);
      pop();
    }
    let average_angle = 0;
    for(let i=0; i<all_pts.length; i++){
      if(isNaN(all_pts[i].ang)) continue;
      average_angle += all_pts[i].ang%360;
    }
    average_angle = average_angle/all_pts.length;

    const stroke_c = random(colors);
    stroke(stroke_c);
    // fill(stroke_c);
    if(type == "png"){
      // line_blur(stroke_c, 2*global_scale);
    }
    beginShape();
    for(let i=0; i<all_pts.length; i++){
      const pt = all_pts[i];
      vertex(pt.x, pt.y);
    }

    //create offset vector
    const offset_x = hair_width * cos(average_angle + 90);
    const offset_y = hair_width * sin(average_angle + 90);
    const offset_vector = createVector(offset_x, offset_y);

    let lerp_amt = 0;
    //reverse array
    for(let i=all_pts.length-1; i>=0; i--){
      const pt = all_pts[i];
      //create vector for each point and create vector combined with offset
      const pt_vector = createVector(pt.x, pt.y);
      const offset_pt = p5.Vector.add(offset_vector, pt_vector);
      if(i/all_pts.length>0.5){
        lerp_amt = constrain(map(i/all_pts.length, 1,0.5, lerp_amt, 1), 0, 1);
      }
      else{
        // lerp_amt = constrain(map(i/all_pts.length, 0., 1,lerp_amt), 0, 1);
        lerp_amt = constrain(i/all_pts.length * map(noise(i/100), 0,1, 1.8, 2.2), 0, 1);
      }

      pt_vector.lerp(offset_pt, lerp_amt);
      vertex(pt_vector.x, pt_vector.y);
    }


    endShape(CLOSE);
  }


  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs