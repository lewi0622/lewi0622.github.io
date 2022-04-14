gif = true;
fr = 30;

xoff = 0;
inc = 0.5*60/fr;

let font;
function preload() {
  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');
}

function setup() {
  common_setup(gif);
  frameRate(fr);
  size = 100 * global_scale;
  spacing = size/2;
  keep_frames = 0;

  phrase = Array.from("THESE WORDS ARE EVIL");

  letters = []
  phrase.forEach((l,idx) => {
    points = font.textToPoints(l, idx*spacing,0, size, {
      sampleFactor: 1,
      simplifyThreshold: 1
    });
    letters.push(points); 
  });
  textFont(font);
  textSize(size);
}
//***************************************************
function draw() {
  clear();

  strokeWeight(5*global_scale);

  shape_rad = 40*global_scale;

  translate(canvas_x/4, canvas_y/2);

  if(random()>0.05 && frameCount > keep_frames){
    letters.forEach(l =>{
      curveTightness(sin(xoff)*5);
      beginShape();
      curveVertex(points[0].x, points[0].y);
      l.forEach(p => {
        curveVertex(p.x, p.y);
      });
      endShape();
    });
  }
  else{
    phrase.forEach((letter, idx) => {
      text(letter, idx*spacing, 0)
    });
    if(keep_frames<frameCount){
      keep_frames = frameCount + 5;
    }
  }




  xoff += inc;
}
//***************************************************
//custom funcs



