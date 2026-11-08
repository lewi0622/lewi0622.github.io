'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []
let cols = 1;
let rows = 1;

function gui_values(){
  parameterize("face_width", random(3,4.5)*96/cols, 1, 800, 1, true);
  parameterize("face_height", random(3.5,5)*96/rows, 1, 800, 1, true);
  parameterize("hair_step_size", random(5,15), 1, 50, 1, true);
  parameterize("hair_height", random(5,30)/rows, 1, 100, 1, true);
  parameterize("ear_height", random(60,100)/rows, 1, 200, 1, true);
  parameterize("ear_width", random(30, 50)/cols, 1, 100, 1, true);
  parameterize("ear_iterations", 10, 1, 100, 1, false);
  parameterize("eye_width", random(20, 40)/cols, 1, 150, 1, true);
  parameterize("eye_height", random(10, 30)/rows, 1, 150, 1, true);
  parameterize("nose_width", random(20, 40)/cols, 1, 150, 1, true);
  parameterize("nose_height", random(10, 30)/rows, 1, 150, 1, true);
  parameterize("mouth_width", random(100, 300)/cols, 1, 500, 1, true);
  parameterize("mouth_height", random(50, 150)/rows, 1, 500, 1, true);
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
  noFill();

  for(let j=1; j<=cols; j++){
    for(let z=1; z<=rows; z++){
      push();
      translate((canvas_x/cols*j-face_width)/2, (canvas_y/rows*z-face_height)/2);
      const first_pt = {x: 0, y:face_height/6};
      //hair
      beginShape();
      let hair_width = 0;
      let last_pt;
      splineVertex(first_pt.x, first_pt.y);
      splineVertex(first_pt.x, first_pt.y);
      while(hair_width<face_width){
        last_pt = {x:hair_width, y: random(hair_height)};
        splineVertex(last_pt.x, last_pt.y)
        hair_width += random(-hair_step_size/8, hair_step_size);
      }
    
      //ear
      splineVertex(last_pt.x, last_pt.y);
      splineVertex(last_pt.x, last_pt.y);
      //shift down for ear
      last_pt.y += face_height/6;
      const end_point = {x: last_pt.x, y: last_pt.y};
      splineVertex(last_pt.x, last_pt.y);
      splineVertex(last_pt.x, last_pt.y + ear_height);//side of face
      for(let i=0; i<ear_iterations; i++){
        splineVertex(last_pt.x+random(ear_width), last_pt.y+random(ear_height));
      }
    
      //move in to the eye
      last_pt.x -= face_width/3;
      let eye_pt = {x: last_pt.x, y:last_pt.y+eye_height/2};
      for(let i=0; i<3; i++){
        splineVertex(eye_pt.x, eye_pt.y);
        splineVertex(eye_pt.x + eye_width/2, eye_pt.y-eye_height/2);
        splineVertex(eye_pt.x + eye_width, eye_pt.y);
        splineVertex(eye_pt.x + eye_width/2, eye_pt.y+eye_height);
      }
    
      const iris = {x: last_pt.x+random(eye_width), y:last_pt.y+random(eye_height)};
      const iris_width = eye_width/4;
      const iris_height = eye_height/4;
      for(let i=0; i<5; i++){
        splineVertex(iris.x + random(iris_width), iris.y + random(iris_height));
      }
      
      //nose
      last_pt = {x: face_width/2, y:face_height/3};
      splineVertex(last_pt.x, last_pt.y-nose_height);
      splineVertex(last_pt.x, last_pt.y);
      for(let i=0; i<4; i++) splineVertex(last_pt.x + random(-nose_width, nose_width), last_pt.y+random(-nose_height, nose_height/2));
    
      //left eye
      eye_pt.x = face_width-eye_pt.x;
      for(let i=0; i<3; i++){
        splineVertex(eye_pt.x, eye_pt.y);
        splineVertex(eye_pt.x + eye_width/2, eye_pt.y-eye_height/2);
        splineVertex(eye_pt.x + eye_width, eye_pt.y);
        splineVertex(eye_pt.x + eye_width/2, eye_pt.y+eye_height);
      }
      iris.x = face_width - iris.x + eye_width/2;
      for(let i=0; i<5; i++){
        splineVertex(iris.x + random(iris_width), iris.y + random(iris_height));
      }
    
      //ear
      last_pt.x = 0;
      last_pt.y = face_height/6;
      splineVertex(last_pt.x, last_pt.y);
      for(let i=0; i<ear_iterations; i++){
        splineVertex(last_pt.x-random(ear_width), last_pt.y+random(ear_height));
      }
    
      //lower face/jaw
      splineVertex(last_pt.x, last_pt.y);
      splineVertex(0, face_height*3/4);
      splineVertex(face_width/2, face_height);
      splineVertex(face_width, face_height*2/3);
    
      //mouth
      splineVertex(face_width-random(0.7,1)*mouth_width, face_height*2/3);
      splineVertex(face_width-mouth_width/2, face_height*2/3+random(0.7,1)*mouth_height);
      splineVertex(face_width-random(0.5)*mouth_width, face_height*2/3+mouth_height);
    
      //end, finally
      splineVertex(face_width, face_height*2/3);
      splineVertex(end_point.x, end_point.y);
      splineVertex(end_point.x, end_point.y);
      endShape();
      pop();
    }
  }
  
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

