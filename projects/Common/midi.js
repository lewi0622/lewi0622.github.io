var channel, val, on, port_id;
var grid_connected = false;

//channels
let grid_dial_1 = 32;
let grid_dial_2 = 33;
let grid_dial_3 = 34;
let grid_dial_4 = 35;

let grid_slider_1 = 36;
let grid_slider_2 = 37;
let grid_slider_3 = 38;
let grid_slider_4 = 39;

let grid_button_1 = 40;
let grid_button_2 = 41;
let grid_button_3 = 42;
let grid_button_4 = 43;

function give_grid_chanel_name(ch){
  if(ch==32) return "grid_dial_1";
  if(ch==33) return "grid_dial_2";
  if(ch==34) return "grid_dial_3";
  if(ch==35) return "grid_dial_4";
  
  if(ch==36) return "grid_slider_1";
  if(ch==37) return "grid_slider_2";
  if(ch==38) return "grid_slider_3";
  if(ch==39) return "grid_slider_4";

  if(ch==40) return "grid_button_1";
  if(ch==41) return "grid_button_2";
  if(ch==42) return "grid_button_3";
  if(ch==43) return "grid_button_4";
}


if (navigator.requestMIDIAccess) console.log('This browser supports WebMIDI!');
else console.log('WebMIDI is not supported in this browser.');

function midiConnect(){
  navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure);
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

function onMIDISuccess(midiAccess) {
  midiAccess.onstatechange = update_devices;
  for (var input of midiAccess.inputs.values()) {
    if(input.name == "Intech Grid MIDI device" && input.onmidimessage == null){
      input.onmidimessage = getMIDIMessage;
      grid_connected = true;
    }
  }
}

function update_devices(e){
  if(!grid_connected) midiConnect();
}

function getMIDIMessage(midiMessage) {
  on = midiMessage.data[0];
  channel = midiMessage.data[1];
  val = midiMessage.data[2];
  if(channel == grid_button_1){
    if(val == 127) previous_seed();//previous
  }
  else if(channel == grid_button_2){
    if(val == 127) next_seed();//next
  }
  else if(channel == grid_button_3){
    if(val == 127) randomize_drawing();//randomize
  }
  else if(channel == grid_button_4){
    if(val == 127 && !file_saved) save_drawing();//save
  }
  else{
    //capture dials and sliders in session memory
    sessionStorage.setItem(give_grid_chanel_name(channel), val);

    redraw_reason = "midi";
    //ideally we would check to see if the dials/sliders were actually being referenced somewhere
    redraw_sketch();
  }
}