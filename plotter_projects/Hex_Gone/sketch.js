'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize("start_rad", 5, 1, 100, 1, true);
  parameterize("rad_inc", 1, 1, 10, 1, true);
  parameterize("thic", 1, 1, 10, 1, false);
  parameterize("rot", 10, 0, 360, 1, false);
  parameterize("num_hexes", 10, 1, 100, 1, false);
}

function setup() {
  common_setup(8*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  const colors = gen_n_colors(2);
  //actual drawing stuff
  push();
  let hex_rad = start_rad + rad_inc*num_hexes;
  translate(canvas_x/2, canvas_y/2);
  for(let j=0; j<num_hexes; j++){
    rotate(j*rot);
    for(let z=0; z<thic; z++){
      stroke(random(colors));
      translate(0,0);
      beginShape();
      for(let i=0; i<6; i++){
        const x = (hex_rad-z*global_scale/2)*cos(60*i);
        const y = (hex_rad-z*global_scale/2)*sin(60*i);
        vertex(x,y);
      }
      endShape(CLOSE);
    }
    hex_rad -= rad_inc;
  }

  pop();

//custom funcs

//function for getting everything in layers

//read out all path tags within <g <g

//append layer info based on color



//each subsequent color that's the same as the previous can be put in the same layer/label??

//if different color than previous, close out previous g/> tag, start new one ^^^append layer info...
// let canvas_div = document.getElementById("defaultCanvas0");
// let paths = canvas_div.getElementsByTagName("path");
// let parent_g = paths[0].parentElement;
// let unnecessary_g = parent_g.parentElement;
// let svg_element = unnecessary_g.parentElement;

// //for some reason the p5.js svg library nests two group elements (g) deep, and it's not necessary
// svg_element.replaceChild(parent_g, unnecessary_g);
// const color_info = {};
// const color_index = [];
// let current_layer_id = 0;
// let previous_color = -1;

// paths.forEach(path_element => {
//   let current_color = String(path_element.getAttribute("stroke"));
//   if(current_color in color_info){ //check if key exists
//     if(previous_color != current_color){ //check if same as last color
//       color_info[current_color]++;  //increment inkscape:label for color
//     }
//   }
//   else{
//     color_info[current_color] = 0; //if new, start at 0
//     color_index.push(current_color);
//   }

//   let wrapper_g = document.createElement('g'); //create new g element to nest path under
//   parent_g.replaceChild(wrapper_g, path_element); //replace path element with newly created g element
//   wrapper_g.appendChild(path_element);  //append path back onto newly created g element

//   //examples
//   // inkscape:groupmode="layer"
//   // id="layer6"
//   // inkscape:label="1-blue 2">

//   wrapper_g.setAttribute("inkscape:groupmode", "layer");
//   wrapper_g.setAttribute("id", "layer" + String(current_layer_id));
//   wrapper_g.setAttribute("inkscape:label", color_index.indexOf(current_color) + ' ' + String(color_info[current_color]));

//   //cleanup
//   previous_color = current_color;
//   current_layer_id++;
// });



global_draw_end();
}
//***************************************************
