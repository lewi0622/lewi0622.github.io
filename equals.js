let palette = [[228, 153, 95, 255], 
               [145, 202, 195, 255], 
               [75, 153, 139, 255], 
               [221, 241, 242, 255], 
               [65, 71, 83, 255]]
function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent('jumbo-canvas')
  bg = random(palette)
  background(bg);
  let index = palette.indexOf(bg);
  if (index > -1) {
    palette.splice(index, 1);
  }
  noLoop();
  angleMode(DEGREES);
}

function draw() {
  let last_color = palette[0];
  let c = last_color;
  
  for (let i = 0; i<3; i++){
    push();
    //get non_duplicate color
    while (c == last_color){
      c = random(palette)
    }
    //set opacity
    c[3] = floor(random(200, 240));
    //set color
    fill(c);
    //set location
    translate(random(100,200), random(50, 300));
    //correct placement if rotated
    if (random([0, 90]) == 90){
      translate(75, -25);
      rotate(90);
    }
    equals();
    
    last_color = c;
    pop();     
  }
}

function equals(){
  var thickness = 25;
  var length = 100;
  var lines = 3;
  push();
  for (let i = 0; i < lines; i++){
    beginShape();
    noStroke();
    beginShape();
    vertex(0, 0); // first point
    vertex(length, 0)
    bezierVertex(length*(1+0.2), 0, length*(1+0.2), thickness, length, thickness);
    vertex(0,thickness);
    bezierVertex(length*(-0.2), thickness, length*(-0.2), 0, 0, 0);
    endShape();
    translate(0,thickness*1.5);
  }
  pop();
}