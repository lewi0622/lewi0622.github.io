function validate(key, params, val){
    //if key exists and is not undefined, return value
    if(key in params){
        if(params[key] != undefined){
            return params[key];
        }
    }
    return val;
}

function set_color(params){
    const c = validate("color", params, "BLACK");
    stroke(c);
}

function set_seed(params){
    //don't use in animations
    const seed_val = validate("seed", params, "");
    if(seed_val == "") return;
    randomSeed(seed_val);
    noiseSeed(seed_val);
    pnoise.seed(seed_val);
}

function common_params(params){
    set_color(params);
    set_seed(params);
}

function rect_cutout(params){
    push();
    noFill();
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

function diamond_cutout(params){
    push();
    noFill();
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