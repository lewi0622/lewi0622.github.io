var channel, val, on, port_id;
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
  sessionStorage.removeItem(give_grid_chanel_name(grid_dial_1));
  sessionStorage.removeItem(give_grid_chanel_name(grid_dial_2));
  sessionStorage.removeItem(give_grid_chanel_name(grid_dial_3));
  sessionStorage.removeItem(give_grid_chanel_name(grid_dial_4));

  sessionStorage.removeItem(give_grid_chanel_name(grid_slider_1));
  sessionStorage.removeItem(give_grid_chanel_name(grid_slider_2));
  sessionStorage.removeItem(give_grid_chanel_name(grid_slider_3));
  sessionStorage.removeItem(give_grid_chanel_name(grid_slider_4));

  sessionStorage.removeItem(give_grid_chanel_name(grid_button_1));
  sessionStorage.removeItem(give_grid_chanel_name(grid_button_2));
  sessionStorage.removeItem(give_grid_chanel_name(grid_button_3));
  sessionStorage.removeItem(give_grid_chanel_name(grid_button_4));
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
    if(val == 127) document.getElementById("Bt Left").click();//previous
  }
  else if(channel == grid_button_2){
    if(val == 127) document.getElementById("Bt Right").click();//next
  }
  else if(channel == grid_button_3){
    if(val == 127) document.getElementById("Randomize").click();//randomize
  }
  else if(channel == grid_button_4){
    if(val == 127 && !file_saved) save_drawing();//save
  }
  else if(channel == grid_dial_4 && type != "svg"){
    //scroll through colors
    const select_elem = document.getElementById("Color Select");
    const select_options = Array.from(select_elem.options);
    
    const new_val = round(map(val, 0,127, 0, select_options.length-1));
    select_elem.value = select_options[new_val].value;

    if(col_idx()!=int(getParamValue('colors'))) set_seed();
    protected_session_storage_set(give_grid_chanel_name(channel), val);
  }
  else{
    //capture dials and sliders in session memory
    protected_session_storage_set(give_grid_chanel_name(channel), val);

    redraw_reason = "midi";

    redraw_sketch();
  }
}