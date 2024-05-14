function validate(key, params, default_val){
    //if key exists and is not undefined, return value
    if(key in params){
        if(params[key] != undefined){
            return params[key];
        }
    }
    return default_val;
}

function common_params(params){
    noFill();

    const c = validate("color", params, "BLACK");
    stroke(c);
    const seed_val = validate("seed", params, "");
    if(seed_val === "") return;
    randomSeed(seed_val);
    noiseSeed(seed_val);
    pnoise.seed(seed_val);
}

function white_border(){
    //should be called at the top of the draw function, or even in setup.
    push();
    noFill();
    stroke("WHITE");
    rect(0,0, canvas_x, canvas_y);
    pop();
}

function rect_cutout(params = {}){
    push();
    common_params(params);
    const cutout_width = validate("width", params, canvas_x/2);
    const cutout_height = validate("height", params, canvas_y/2);
    const cutout_corners = validate("corners", params, 0);
    const x = validate("x", params, canvas_x/2);
    const y = validate("y", params, canvas_y/2);
    translate(x,y);
    rectMode(CENTER);
    rect(0,0, cutout_width, cutout_height, cutout_corners);

    pop();
}

function diamond_cutout(params = {}){
    push();
    common_params(params);
    const cutout_width = validate("width", params, canvas_x/2);
    const cutout_height = validate("height", params, canvas_y/2);
    const x = validate("x", params, canvas_x/2);
    const y = validate("y", params, canvas_y/2);
    translate(x,y);

    beginShape();
    vertex(cutout_width/2, 0);
    vertex(0, cutout_height/2);
    vertex(-cutout_width/2, 0);
    vertex(0, -cutout_height/2);
    endShape(CLOSE);

    pop();
}

function mountain_cutout(params = {}){
    push();
    common_params(params);
    const x = validate("x", params, 0);
    const y = validate("y", params, canvas_y);
    translate(x,y);

    const x_margin = validate("x_margin", params, 0);
    const mt_steps_per_side = validate("mt_steps_per_side", params, 67);
    const mt_height = validate("mt_height", params, 512);
    const x_amp = validate("x_amp", params, 0);
    const y_amp = validate("y_amp", params, 33);
  
    beginShape();
    for(let i=0; i<mt_steps_per_side; i++){
      let x = lerp(x_margin, canvas_x/2, i/mt_steps_per_side);
      let y = lerp(0, -mt_height, i/mt_steps_per_side);
      x += map(noise(x,y), 0, 1, -x_amp, x_amp);
      y += map(noise(x,y), 0, 1, -y_amp, y_amp);
      vertex(x,y);
    }
    for(let i=0; i<=mt_steps_per_side; i++){
      let x = lerp(canvas_x/2, canvas_x-x_margin, i/mt_steps_per_side);
      let y = lerp(-mt_height, 0, i/mt_steps_per_side);
      x += map(noise(x,y), 0, 1, -x_amp, x_amp);
      y += map(noise(x,y), 0, 1, -y_amp, y_amp);
      vertex(x,y);
    }
  
    vertex(canvas_x - x_margin, 100);
    vertex(x_margin, 100);
  
    endShape(CLOSE);
  
    pop();
  }