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

midiConnect();

if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!');
} else {
  console.log('WebMIDI is not supported in this browser.');
}

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
  print(on, val);
  if(channel == 40 && val == 127) previous_seed();//previous
  else if(channel == 41 && val == 127) next_seed();//next
  else if(channel == 42 && val == 127) randomize_drawing();//randomize
  else if(channel == 43 && val == 127) save_drawing();//save
  else{
    redraw_reason = "midi";
    redraw_sketch();
  }
}
