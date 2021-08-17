function reset_drawing(seed){
  //call draw after this if manually refreshing canvas

  //if no seed supplied, set random seed and pass it
  if(isNaN(seed)){
    seed = Math.round(random()*1000000);
  }
  randomSeed(seed);
  input.value(str(seed));
  return seed;
}

function randomize_action(){
  //called by clicking the Randomize button
  //reinitializes the drawing
  reset_values();
  seed = reset_drawing();
  draw();
}

function set_seed(){
  //called by clicking the go button
  //reinitializes the drawing with a specific seed
  reset_values();
  seed = reset_drawing(int(input.value()));
  draw();
}

function seed_scale_button(){
  //creates controls below canvas for displaying/setting seed
  input = createInput("seed");
  input.size(100);
  input.position(0,400);
  
  button = createButton("Custom Seed");
  button.mouseClicked(set_seed);
  button.position(100, 400);
  
  randomize = createButton("Randomize");
  randomize.mouseClicked(randomize_action)
  randomize.position(400-randomize.size().width, 400);
  
  show_hide_controls();
}

function reduce_array(arr, remove){
  //deletes 'remove' from a given 'arr'
  let index = arr.indexOf(remove);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

function show_hide_controls(){
  if(hidden_controls == true){
    input.show();
    button.show();
    randomize.show();

    hidden_controls = false;
  }
  else{
    input.hide();
    button.hide();
    randomize.hide();
    
    hidden_controls = true;
  }
}