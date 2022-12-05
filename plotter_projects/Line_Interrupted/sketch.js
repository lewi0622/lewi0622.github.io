'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;

function gui_values(){
  parameterize("step_size", 5, 1, 20, 1, true);
  parameterize("line_spacing", 10, 1, 50, 1, true);
  parameterize("xnoise_div", 100, 10, 1000, 10,false);
  parameterize("xnoise_off", 0, -50, 50, 1, false);
  parameterize("ynoise_div", 100, 10, 1000, 10,false);
  parameterize("ynoise_off", 0, -50, 50, 1, false);
  parameterize("noise_size", 3, 0.1, 50, 0.1, true);
  parameterize("boat_width", random(10,100), 1, 200, 1, true);
  // parameterize("startx", floor(random(100, 400)), 0, 500, 1, true);
  // parameterize("starty", floor(random(100, 300)), 0, 400, 1, true);
  // parameterize("num_shapes", ceil(random(20)), 4, 30, 1, false);
}

function setup() {
  common_setup(gif, SVG, 500, 400);
  // background("WHITE")
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  const lines = [];
  let line_pos = 0;
  let line_max = canvas_x;
  //line_background
  while(line_pos<line_max){
    const line_points = [];
    for(let i=0; i<canvas_y; i+=step_size){
      line_points.push([map(noise((i + xnoise_off*i)/xnoise_div, (line_pos+ynoise_off)/ynoise_div), 0,1, -noise_size, noise_size), i]);
    }
    line_points.push([map(noise((canvas_y + xnoise_off*canvas_y)/xnoise_div, (line_pos+ynoise_off)/ynoise_div), 0,1, -noise_size, noise_size), canvas_y]);
    lines.push(line_points);
    line_pos += line_spacing;
  }

  //plot lines
  lines.forEach((line_points, idx) => {
    push();
    translate(idx*line_spacing, 0);

    // if(random()>map(line_spacing, global_scale,50*global_scale, .99,0.7) && idx+1!=lines.length){
    //   push();
    //   // stroke(100);
    //   const rad = random(line_spacing*10, line_spacing*20);
    //   print(random(rad, canvas_x-rad))
    //   circle(0, random(rad, canvas_y-rad), rad);
    //   pop();
    // }
    // if(floor(lines.length/2)==idx){
    //   stroke("RED")
    //   circle(0, canvas_y/2, 200*global_scale);
    //   stroke("BLUE")
      
      //boat code
      // push();
      // translate(-boat_width/4, canvas_y/2);

      // const line_density = 2*global_scale;

      // //boat pos
      // translate(0, random(-1,1)*(canvas_y/2-boat_width));
      // rotate(-90);
      // //boat angle
      // rotate(random(-15,15));
      // stroke("ORANGE");
      // let arc_rad = boat_width;
      // while(arc_rad>line_density/2){
      //   arc(0, 0, arc_rad, arc_rad, 0, 180, CHORD);
      //   arc_rad -= line_density;
      // }

      // stroke("BROWN")
      // let mast_x = random(-1,1)*boat_width/6;
      // let mast_y = 0;
      // let mast_width = map(boat_width, 50,200, 10, 20);
      // let mast_height = map(boat_width, 50,200, 60, 150);

      // let hatch_x = mast_x;
      // let hatch_width = mast_width;
      // let hatch_height = mast_height;
      // while(abs(hatch_width)>line_density/4){
      //   rect(hatch_x,mast_y, hatch_width,-hatch_height);
      //   hatch_x += line_density/2;
      //   mast_y -= line_density/2;
      //   hatch_height -= line_density;
      //   hatch_width -= line_density;
      // }
        
      // const boom_height = map(boat_width, 50,200, 10, 20);
      // stroke("GREEN")
      // let sail_height = random(0.7,0.99)*mast_height;
      // let sail_width = mast_x-map(boat_width, 50, 200, 20,100);
      // const v1 = createVector(mast_x, -boom_height);
      // const v2 = createVector(mast_x,-sail_height);
      // const v3 = createVector(sail_width,-boom_height);
      // const center_v = createVector((v1.x+v2.x+v3.x)/3, (v1.y+v2.y+v3.y)/3);
      // const triangle_steps = 15;
      // for(let i=0;i<triangle_steps; i++){
      //   const v1_i = p5.Vector.lerp(v1,center_v,i/triangle_steps);
      //   const v2_i = p5.Vector.lerp(v2,center_v,i/triangle_steps);
      //   const v3_i = p5.Vector.lerp(v3,center_v,i/triangle_steps);
      //   triangle(v1_i.x, v1_i.y, v2_i.x, v2_i.y, v3_i.x, v3_i.y);
      // }
      
      // if(random()>0.5){
      //   stroke("YELLOW")
      //   sail_height = random(0.7,0.99)*mast_height;
      //   sail_width = mast_x+mast_width + map(boat_width, 50, 200, 20, 100);
      //   // triangle(mast_x+mast_width,-boom_height, mast_x+mast_width,-sail_height, sail_width, -boom_height);
      //   const v1 = createVector(mast_x+mast_width,-boom_height);
      //   const v2 = createVector(mast_x+mast_width,-sail_height);
      //   const v3 = createVector(sail_width, -boom_height);
      //   const center_v = createVector((v1.x+v2.x+v3.x)/3, (v1.y+v2.y+v3.y)/3);
      //   const triangle_steps = 15;
      //   for(let i=0;i<triangle_steps; i++){
      //     const v1_i = p5.Vector.lerp(v1,center_v,i/triangle_steps);
      //     const v2_i = p5.Vector.lerp(v2,center_v,i/triangle_steps);
      //     const v3_i = p5.Vector.lerp(v3,center_v,i/triangle_steps);
      //     triangle(v1_i.x, v1_i.y, v2_i.x, v2_i.y, v3_i.x, v3_i.y);
      //   }
      // }

      // pop();
      //set different stroke for post-boat waves so that I can occult everything
    //   stroke("BLUE")
    // }
    // else if(floor(lines.length/2<idx)) stroke("BLUE");
    
    beginShape();
    line_points.forEach(points => vertex(...points));
    let spacing = line_spacing*(lines.length-idx);
    if(idx+1!=lines.length){
      vertex(spacing, line_points[(line_points.length-1)][1]);
      vertex(spacing, 0);
      endShape(CLOSE);
    }
    else endShape();
    endShape();
    pop();
  });
  // overlapping shapes 
  // translate(startx, starty);
  // let padding = 50*global_scale;
  // let min_x = startx - padding*2;
  // let min_y = starty - padding*2;
  // let max_x = canvas_x-startx-padding*2;
  // let max_y = canvas_y-starty-padding*2;
  // noFill();
  // stroke("BLUE")
  // rectMode(CENTER);
  // let radius=0;
  // for(let i=0; i<num_shapes; i++){
  //   push();
  //   const pct = i/num_shapes;
  //   const inc = 90/num_shapes/num_shapes;
  //   const theta = pct*360;
  //   if(i==0) radius = max_x;
  //   else if(pct<0.25)radius = lerp(radius, min_y, inc);
  //   else if(pct>=0.25&&pct<0.5) radius = lerp(radius, min_x, inc);
  //   else if(pct>=0.5&&pct<0.75) radius = lerp(radius, max_y, inc);
  //   else radius = lerp(radius, max_x, inc);
  //   rotate(-theta);
  //   rect(radius/2+padding, 0, radius, map(radius, 0, 500, 20, 0));
  //   pop();
  // }

  pop();

  //
  const all_paths = []
  const stroke_id = []
  let idx = 0;

  //append id numbers to svg path elements
  const g_elements = document.getElementsByTagName("g");
  g_elements.forEach(g => {
    all_paths.push(g.getElementsByTagName("path"));
  });

  all_paths.forEach(collection => {
    //get stroke colors, and set obj with stroke color/id num
    collection.forEach(p => {
      p.setAttribute("id", idx);
      idx++;
      // const p_stroke = p.getAttribute("stroke");
      // let matching_id = -1;
      // stroke_id.forEach((e,i) => {
      //   if(e.hasOwnProperty(p_stroke)) matching_id = i;
      // });
      // if(matching_id != -1){
      //   p.setAttribute("id", stroke_id[matching_id][p_stroke]);
      //   print("Here")
      // }
      // else{
      //   stroke_id.push({[p_stroke]: idx});
      //   idx++;
      // }
    });
  });

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs