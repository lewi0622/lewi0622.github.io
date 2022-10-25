gif = true;
fr = 5;
c_id = 0;
last_c_id = c_id;

capture = false;
capture_time = 10;

let gui_params = [];

function gui_values(){

}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //gif color slide
  c_id = last_c_id + 1;
  last_c_id = c_id;

  //apply background
  bg(false, palette[c_id % palette.length]);
  c_id++;

  //actual drawing stuff
  push();

  // read text file
  all_text = readTextFile("text.txt");

  //replace all line breaks with spaces, and split along spaces
  arr_text=all_text.replace(/\n/g, " ").split(" ");

  //re-join into phrases 2-4 words long
  //perhaps for word length<8, don't rejoin?
  let group_text = [];
  if(arr_text.length > 8){
    idx = 0;
    group = 3;
    while(idx < arr_text.length){
      group_text.push(arr_text.slice(idx, idx + group).join(" "));
      idx += group;
    }
  }
  else{
    group_text = arr_text;
  }

  //horizontal and vertical margins
  margin = 100*global_scale;
  noFill();

  //set max font size based on the number of lines and canvas size
  max_fontSize = (canvas_y-margin*2)/group_text.length;  
  max_width = 0;
  widths = [];
  heights = [];

  font_size = max_fontSize;
  fontface = "serif"

  group_text.forEach(element => {
    fits = false;
    while(!fits){
      drawingContext.font = str(font_size)+"px "+ fontface;
      text_metrics = drawingContext.measureText(element);
      text_width = text_metrics.width;

      if(text_width>max_width){max_width=text_width;}

      if(text_width > canvas_x-margin*2){
        font_size--;
        if(font_size<0){
          break;
        }
      }
      else{
        fits = true;
        widths.push(text_metrics.width);
        heights.push(text_metrics.fontBoundingBoxAscent);
      }
    }
  });

  step = 10;

  total_height = heights.slice(1,heights.length).reduce((partialSum, a) => partialSum + a, 0);

  for(let stroke_weight=200; stroke_weight>0; stroke_weight -= step){
    push();

    //finer detail on the text
    if(stroke_weight<11){step=1}

    translate((canvas_x - max_width)/2, (canvas_y-total_height)/2);
    
    stroke(palette[c_id % palette.length]);
    strokeWeight(stroke_weight*global_scale);

    c_id ++;

    group_text.forEach((element, index) => {
      text(element, (max_width - widths[index])/2, 0);
      translate(0,heights[index]);
    });
    pop();
  }
  
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function readTextFile(file)
{
  ///Reads local text file at given path, returns all text
    var rawFile = new XMLHttpRequest();
    var allText = ""
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

