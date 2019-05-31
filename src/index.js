let current_octave = 4;
let channel = 9;
let programmer, juno, launchResponse;

function panic() {
    [...Array(128).keys()].forEach((e) => { juno.stopNote(e) });
}

function buildUI() {
    // console.log(CC_MAP)
    let i = 0;
    for (let item in CC_MAP) {
        let control = document.createElement('div');
        control.className = 'controls ' + CC_MAP[item]['type'];
        control.className += (item < 77) || (item > 96) ? ' encoder' : ' slider'
        control.id = 'control_' + item;
        control.innerHTML = `
            <label>${CC_MAP[item]['name']} (${CC_MAP[item]['range'].length - 1})</label>
            <input type="range" min="0" max="${CC_MAP[item]['range'].length - 1}">
            <span></span>
        `;
        document.body.appendChild(control);
        i++;
        if (i % 8 == 0) {
            document.body.appendChild(document.createElement('br'));
        }
    }

    // Add the pads
    document.body.appendChild(document.createElement('br'));

    for (let i = 0; i < 16; i++) {
        // if (i % 8 == 0) {
        //     document.body.appendChild(document.createElement('br'));
        // }
        let pad = document.createElement('div');
        pad.className = "controls button "; // a new class for 2 or 4-state controls
        pad.className += i > 7 ? "white-keys" : "";
        pad.className += i == 1 || i == 2 || i == 4 || i == 5 || i == 6 ? "black-keys" : "";

        pad.id = 'pad_' + i;
        pad.setAttribute('data-note', OCTAVE[i]);
        pad.innerHTML = `
            <span>${OCTAVE[i]}</span>
        `;
        document.body.appendChild(pad);
    }
}

function listenViewport() {
    document.querySelectorAll('.controls > input[type="range"]').forEach((el) => {
        el.addEventListener('input', (e) => {
            // console.log('change',e.target.value);
            e.target.parentNode.querySelector('span').innerText = e.target.value;
            let cc = e.target.parentNode.getAttribute("id").split("_")[1];
            console.log('CC: ' + cc, 'VALUE: ' + e.target.value);
            sendToJuno(cc, e.target.value)
        });
    });

    // Add click events to pads
    document.querySelectorAll('.controls.button').forEach((el) => {
        el.addEventListener('click', (e) => {
            if (!e.target.getAttribute('data-note').includes('oct')) {
                if (e.target.getAttribute('data-note').length > 0) {
                    let note = e.target.getAttribute('data-note') + current_octave;
                    if (juno) juno.playNote(note);
                    if (launchResponse) launchResponse.playNote(note); // show the played note on the LC XL
                } else {
                    // the empty button. what should it do?
                    // for now it just displays the currently selected Octave
                }
            } else {
                // its the octave buttons
                if (e.target.getAttribute('data-note').includes('oct -')) {
                    // lower the octave
                    if (current_octave > 1) {
                        current_octave = current_octave - 1;
                    }
                } else {
                    // raise the octave
                    if (current_octave < 8) {
                        current_octave = current_octave + 1;
                    }
                }
                /*
                oct 1 oct + is green oct - is red
                oct 2 oct + is green oct - is orange
                oct 3 oct + is green oct - is yellow
                oct 4 oct + is green oct - is green
                oct 5 oct + is yellow oct - is green
                oct 6 oct + is orange oct - is green
                oct 7 oct + is red oct - is green
                */
            }
        });
    });
}

function sendToJuno(cc, value) {
    // console.log(`channel: ${channel} controller: ${cc} value: ${value}`);
    document.querySelector(`#control_${cc} > span`).innerText = value;
    // console.log(CC_MAP[cc]);
    document.querySelector('.active').innerHTML = `
        ${CC_MAP[cc]['name']}: 
        <span class='value'>${value}</span>
        <small>${CC_MAP[cc]['desc']}</small>
        MIDI Channel: ${channel}
    `;
    // let sysex = `0x36 0x00 0x23 0x01 0x01 0x${CC_MAP[cc]['sysex']} 0x${decimalToHex(value)}`; //.replace(/\s/g,'');
    // // console.log('sysex ' + sysex, hexStringToByte(sysex));
    // // let result = juno.sendSysex(0x41,[0x36, 0x00, 0x23, 0x20, 0x01, 8, 127]);
    // sys = sysex.split(' ')
    // console.log(sys);
    let mappedControllerInt = hexStringToByte(CC_MAP[cc]['sysex'])[0];
    let arr = [54, 8, 35, 32, 1, mappedControllerInt, value];
    // console.log('arr', arr);
    // console.log('ev', ev);
    juno.sendSysex(0x41, arr);
}

// Receives a note number and lights up the LC XL and screen with appropriate colors
// Also adjusts current_octave
function octaveButtonAction(note_number) {
    // Up octave
    if (note_number == 60) {
        current_octave++;
        document.querySelector("#pad_0").setAttribute("data-oct", current_octave)
        document.querySelector("#pad_7").setAttribute("data-oct", current_octave)
    }

    // Down octave
    if (note_number == 41) {
        current_octave--;
        document.querySelector("#pad_0").setAttribute("data-oct", current_octave)
        document.querySelector("#pad_7").setAttribute("data-oct", current_octave)
    }

    // Middle button resets to center octave
    if (note_number == 44) {
        current_octave = 4
    }

    document.querySelector("#pad_3 > span").innerText = "OCTAVE " + current_octave;

    if (current_octave === 4) {
        playColor(60, VEL_D_GREEN);
        playColor(41, VEL_D_GREEN);
    } else if (current_octave === 3) {
        playColor(60, VEL_D_GREEN);
        playColor(41, VEL_YELLOW);
    } else if (current_octave === 2) {
        playColor(60, VEL_D_GREEN);
        playColor(41, VEL_D_AMBER);
    } else if (current_octave === 1) {
        playColor(60, VEL_D_GREEN);
        playColor(41, VEL_D_RED);
    } else if (current_octave === 0) {
        playColor(60, VEL_D_GREEN);
        playColor(41, VEL_OFF);
    } else if (current_octave === 5) {
        playColor(41, VEL_D_GREEN);
        playColor(60, VEL_YELLOW);
    } else if (current_octave === 6) {
        playColor(41, VEL_D_GREEN);
        playColor(60, VEL_D_AMBER);
    } else if (current_octave === 7) {
        playColor(41, VEL_D_GREEN);
        playColor(60, VEL_D_RED);
    } else if (current_octave === 8) {
        playColor(41, VEL_D_GREEN);
        playColor(60, VEL_OFF);
    }
}

function octUp(note) {
    // if the note is button 16, it should play the "C" one octave above the "C" on button 9
    return note == 92 ? 1 : 0;
}

// based on the 2, 4, or 6 range (all that we are worried about right now)
// return the "appropriate" value based on the raw encoder value
function fullToRange(range, rawValue) {
    /*
    Range of 2:
    RAW VALUE | RETURN VALUE
    ==========|=============
      0 - 63  | 0
     64 - 127 | 1

    Range of 4:
    RAW VALUE | RETURN VALUE
    ==========|=============
      0 - 31  | 0
     32 - 63  | 1
     64 - 95  | 2
     96 - 127 | 3

     Range of 6:
     RAW VALUE | RETURN VALUE
     ==========|=============
       0 - 20  | 0
      21 - 42  | 1
      43 - 63  | 2
      64 - 84  | 3
      85 - 106 | 4
     107 - 127 | 5

    */
    if (range.length === 2) {
        return rawValue < 64 ? 0 : 1;
    } else if (range.length === 4) {
        if (rawValue < 32) {
            return 0;
        } else if (rawValue < 64) {
            return 1;
        } else if (rawValue < 96) {
            return 2;
        } else {
            return 3;
        }
    } else if (range.length === 6) {
        if (rawValue < 21) {
            return 0;
        } else if (rawValue < 43) {
            return 1;
        } else if (rawValue < 64) {
            return 2;
        } else if (rawValue < 85) {
            return 3;
        } else if (rawValue < 107) {
            return 4;
        } else {
            return 5;
        }
    } else {
        return rawValue;
    }
}

function updateViewPort(cc, newValue) {
    document.querySelector(`#control_${cc} > input[type="range"]`).value = newValue;
    document.querySelector(`#control_${cc} > span`).innerText = newValue;
}

// Sets up listeners for CC changes, note on, note off, including responding to panic and octave buttons
// TODO: this listens to the LC XL, we need this same thing to listen to the web app controls
function listenProgrammer() {
    programmer.addListener('controlchange', 'all', function(ev) {
        // TODO: constrain the value to stay in the range allowed with CC_MAP[cc]['range']
        let cc = ev.controller.number;
        let range = CC_MAP[cc]['range'];
        let rawValue = ev.value;
        let safeValue = fullToRange(range, rawValue);
        console.log(`CC: ${cc} | Raw Value" ${rawValue} | Range: ${range} | Safe Value: ${safeValue}`)
        sendToJuno(cc, safeValue);
        updateViewPort(cc, safeValue);
    });

    programmer.addListener('noteon', 'all', (ev) => {
        console.log('ev', ev);
        console.log('note', NOTE_MAP[ev.note.number]["note"] + current_octave)
        if (NOTE_MAP[ev.note.number]["note"]) {
            juno.playNote(NOTE_MAP[ev.note.number]["note"] + (current_octave + octUp(ev.note.number)));
        }
        octaveButtonAction(ev.note.number);
        // Panic
        if (ev.note.number == 105) {
            panic();
        }
    });

    programmer.addListener('noteoff', 'all', (ev) => {
        juno.stopNote(NOTE_MAP[ev.note.number]["note"] + (current_octave + octUp(ev.note.number)));
    });
}

function launchResponseDefaults() {
    // light up some buttons
    playColor(41, VEL_D_GREEN); // octave down
    playColor(44, VEL_YELLOW); // empty
    playColor(60, VEL_D_GREEN); // octave up

    // panic has to send sysex not note info (since playing the note would also turn off the note)
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 40, 127]);

    //first row
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 0, LFO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 1, LFO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 2, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 3, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 4, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 5, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 6, VCA]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 7, VCA]);
    //second row
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 8, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 9, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 10, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 11, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 12, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 13, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 14, DCO]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 15, CHO]);
    // third row
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 16, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 17, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 18, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 19, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 20, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 21, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 22, VCF]);
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 23, CHO]);
}

function playColor(note, color) {
    launchResponse.playNote(note, "all", {
        rawVelocity: true,
        velocity: color
    });
}

WebMidi.enable(function(err) {
    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
        buildUI();

        // instantiate the MIDI inputs and outputs
        programmer = WebMidi.getInputByName('Launch Control XL');
        juno = WebMidi.getOutputByName('mio');
        launchResponse = WebMidi.getOutputByName('Launch Control XL');

        // if they are connected, instantiate the listeners and defaults
        if (launchResponse) {
            launchResponseDefaults();
        }

        if (programmer) {
            listenProgrammer();
        }
        listenViewport();
    }
}, true);