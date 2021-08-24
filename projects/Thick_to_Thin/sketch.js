function reset_values(){
  //reset project values here for redrawing 
  line_length = 40*global_scale;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {  
  //set background, and remove that color from the palette
  bg = random(palette)
  background(bg);
  reduce_array(palette, bg);
  
  translate(line_length/2, line_length/2);
  for(let i=0; i<canvas_x; i=i+line_length){
    for(let j=0; j<canvas_y; j=j+line_length){
      push();
      noStroke();
      fill(random(palette));
      translate(i, j);
      radius = 1.25*line_length-(i/line_length+j/line_length)*2.3*global_scale;
      console.log(i,j)
      circle(0, 0, radius)
      pop();
    }
  }
  
  save_drawing();
}
//***************************************************
//custom funcs




