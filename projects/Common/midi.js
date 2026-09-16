var channel, val, on, port_id, my_midi_values;
var grid_connected = false;

//channels
const grid_dial_1 = 32;
const grid_dial_2 = 33;
const grid_dial_3 = 34;
const grid_dial_4 = 35;

const grid_slider_1 = 36;
const grid_slider_2 = 37;
const grid_slider_3 = 38;
const grid_slider_4 = 39;

const grid_button_1 = 40;
const grid_button_2 = 41;
const grid_button_3 = 42;
const grid_button_4 = 43;

let grid_button_1_pushed = false;
let grid_button_2_pushed = false;
let grid_button_3_pushed = false;
let grid_button_4_pushed = false;

// Check session storage for midi values or clear
my_midi_values = protected_storage_get("midi_values", "session");
if(my_midi_values == null) my_midi_values = clearMIDIvalues();
else my_midi_values = JSON.parse(my_midi_values);

window.addEventListener('pagehide', () => {
  protected_storage_set("midi_values", JSON.stringify(my_midi_values), "session");
});

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

function clearMIDIvalues(){
  //is it possible to request current states of dials and sliders from the intech grid?
  return {
    "grid_dial_1": -1,
    "grid_dial_2": -1,
    "grid_dial_3": -1,
    "grid_dial_4": -1,

    "grid_slider_1": -1,
    "grid_slider_2": -1,
    "grid_slider_3": -1,
    "grid_slider_4": -1
  };
}

if (navigator.requestMIDIAccess){
  midiConnect();
  console.log('This browser supports WebMIDI!');
}
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
    if(val == 127 && !grid_button_1_pushed){
      document.getElementById("Randomize").click();//previous
      grid_button_1_pushed = true;
    }
    else grid_button_1_pushed = false;
  } else{
    //capture dials and sliders in object
    my_midi_values[give_grid_chanel_name(channel)] = val;

    redraw_reason = "midi";
    redraw_sketch();
  }
}