var message_num = 0;

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
    document.getElementById("status").innerHTML = "Could not access your MIDI device";
}

function onMIDISuccess(midiAccess) {
    document.getElementById("status").innerHTML = "MIDI connection success"
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
        console.log(input);
    }
}

function getMIDIMessage(midiMessage) {
  document.getElementById("message_num").innerHTML = "Message Number " + String(message_num);
  message_num++;
}
