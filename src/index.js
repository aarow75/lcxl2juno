const RANGE_FULL = [...Array(128).keys()];
const RANGE_4 = [...Array(4).keys()];
const RANGE_6 = [...Array(6).keys()];
const RANGE_ON_OFF = [...Array(2).keys()]; // on/off or toggle
const OCTAVE = ["oct -", "C#", "D#", "", "F#", "G#", "A#", "oct +", "C", "D", "E", "F", "G", "A", "B", "C"];

const VEL_OFF = 0;
const VEL_L_RED = 13;
const VEL_D_RED = 15;
const VEL_L_AMBER = 29;
const VEL_D_AMBER = 63;
const VEL_YELLOW = 62;
const VEL_L_GREEN = 28;
const VEL_D_GREEN = 60;

let current_octave = 4;

const noteMap = {
    41: {
        note: ""
    },
    42: {
        note: "C#"
    },
    43: {
        note: "D#"
    },
    44: {
        note: ""
    },
    57: {
        note: "F#"
    },
    58: {
        note: "G#"
    },
    59: {
        note: "A#"
    },
    60: {
        note: ""
    },
    73: {
        note: "C"
    },
    74: {
        note: "D"
    },
    75: {
        note: "E"
    },
    76: {
        note: "F"
    },
    89: {
        note: "G"
    },
    90: {
        note: "A"
    },
    91: {
        note: "B"
    },
    92: {
        note: "C"
    },
    105: {
        note: ""
    },
};

const ccMap = {
    13: {
        name: 'LFO RATE',
        sysex: '18',
        desc: 'LFO Rate (0..7F)',
        type: 'lfo',
        range: RANGE_FULL
    },
    14: {
        name: 'LFO DELAY',
        sysex: '19',
        desc: 'LFO Delay (0..7F)',
        type: 'lfo',
        range: RANGE_FULL
    },
    15: {
        name: 'DCO RANGE',
        sysex: '06',
        desc: 'DCO Range (0=4\', 1=8\', 2=16\', 3=32\')',
        type: 'dco',
        range: RANGE_4
    },
    16: {
        name: 'DCO LFO',
        sysex: '0B',
        desc: 'DCO LFO Mod. (0..7F)',
        type: 'dco',
        range: RANGE_FULL
    },
    17: {
        name: 'DCO ENV',
        sysex: '0C',
        desc: 'DCO ENV Mod. (0..7F)',
        type: 'dco',
        range: RANGE_FULL
    },
    18: {
        name: 'DCO ENV MODE',
        sysex: '01',
        desc: 'DCO Env. Mode (0=Normal, 1=Inverted, 2=Normal-Dynamic, 3=Inv.-Dynamic)',
        type: 'dco',
        range: RANGE_4
    },
    19: {
        name: 'VCA LEVEL',
        sysex: '16',
        desc: 'VCA Level (0..7F)',
        type: 'vca',
        range: RANGE_FULL
    },
    20: {
        name: 'VCA ENV MODE',
        sysex: '02',
        desc: 'VCA Env. Mode (0=Normal, 1=Gate, 2=Normal-Dynamic, 3=Gate-Dynamic)',
        type: 'vca',
        range: RANGE_4
    },
    29: {
        name: 'PULSE',
        sysex: '03',
        desc: 'DCO Wave Pulse (0..3)',
        type: 'dco',
        range: RANGE_4
    },
    30: {
        name: 'SAW TOOTH',
        sysex: '04',
        desc: 'DCO Wave Saw (0..5)',
        type: 'dco',
        range: RANGE_6
    },
    31: {
        name: 'SUB',
        sysex: '05',
        desc: 'DCO Wave Sub (0..5)',
        type: 'dco',
        range: RANGE_6
    },
    32: {
        name: 'SUB LEVEL',
        sysex: '07',
        desc: 'DCO Sub Level (0..3)',
        type: 'dco',
        range: RANGE_4
    },
    33: {
        name: 'NOISE LEVEL',
        sysex: '08',
        desc: 'DCO Noise (0..3)',
        type: 'dco',
        range: RANGE_4
    },
    34: {
        name: 'PWM',
        sysex: '0E',
        desc: '	DCO PWM Depth (0..7F)',
        type: 'dco',
        range: RANGE_FULL
    },
    35: {
        name: 'PWM RATE',
        sysex: '0F',
        desc: 'DCO PWM Rate (0..7F) 0 = Pulse Width Manual 1..7F = PW LFO Rate',
        type: 'dco',
        range: RANGE_FULL
    },
    36: {
        name: 'CHORUS ON/OFF',
        sysex: '0A',
        desc: 'Chorus Switch (0=Off, 1=On)',
        type: 'cho',
        range: RANGE_ON_OFF
    },
    49: {
        name: 'HPF',
        sysex: '09',
        desc: 'HPF Cutoff (0..3)',
        type: 'vcf',
        range: RANGE_4
    },
    50: {
        name: 'FREQ',
        sysex: '10',
        desc: 'VCF Cutoff (0..7F)',
        type: 'vcf',
        range: RANGE_FULL
    },
    51: {
        name: 'RES',
        sysex: '11',
        desc: 'VCF Resonance (0..7F)',
        type: 'vcf',
        range: RANGE_FULL
    },
    52: {
        name: 'VCF LFO',
        sysex: '12',
        desc: 'VCF LFO Mod. (0..7F)',
        type: 'vcf',
        range: RANGE_FULL
    },
    53: {
        name: 'VCF ENV',
        sysex: '13',
        desc: 'VCF ENV Mod. (0..7F)',
        type: 'vcf',
        range: RANGE_FULL
    },
    54: {
        name: 'VCF ENV MODE',
        sysex: '01',
        desc: 'VCF Env. Mode (0=Normal, 1=Inverted, 2=Normal-Dynamic, 3=Dynamic)',
        type: 'vcf',
        range: RANGE_4
    },
    55: {
        name: 'VCF KEY FOLLOW',
        sysex: '14',
        desc: 'VCF Key Follow (0..7F)',
        type: 'vcf',
        range: RANGE_FULL
    },
    56: {
        name: 'CHORUS RATE',
        sysex: '22',
        desc: 'Chorus Rate (0..7F)',
        type: 'cho',
        range: RANGE_FULL
    },
    77: {
        name: 'ATTACK TIME',
        sysex: '1A',
        desc: 'ENV T1 (0..7F) Attack Time',
        type: 'env',
        range: RANGE_FULL
    },
    78: {
        name: 'ATTACK LEVEL',
        sysex: '1B',
        desc: 'ENV L1 (0..7F) Attack Level',
        type: 'env',
        range: RANGE_FULL
    },
    79: {
        name: 'BREAK TIME',
        sysex: '1C',
        desc: 'ENV T2 (0..7F) Break Time',
        type: 'env',
        range: RANGE_FULL
    },
    80: {
        name: 'BREAK LEVEL',
        sysex: '1D',
        desc: 'ENV L2 (0..7F) Break Level',
        type: 'env',
        range: RANGE_FULL
    },
    81: {
        name: 'DECAY',
        sysex: '1E',
        desc: 'ENV T3 (0..7F) Decay Time',
        type: 'env',
        range: RANGE_FULL
    },
    82: {
        name: 'SUSTAIN',
        sysex: '1F',
        desc: 'ENV L3 (0..7F) Sustain Level',
        type: 'env',
        range: RANGE_FULL
    },
    83: {
        name: 'RELEASE',
        sysex: '20',
        desc: 'ENV T4 (0..7F) Release Time',
        type: 'env',
        range: RANGE_FULL
    },
    84: {
        name: 'KEY FOLLOW',
        sysex: '21',
        desc: 'ENV Key Follow (0..7F)',
        type: 'env',
        range: RANGE_FULL
    },
    97: {
        name: 'DCO Aftertouch',
        sysex: '0D',
        desc: 'DOC After Mod. (0..7F)',
        type: 'dco',
        range: RANGE_FULL
    },
    98: {
        name: 'VCF Aftertouch',
        sysex: '15',
        desc: 'VCF Aftertouch (0..7F)',
        type: 'vcf',
        range: RANGE_FULL
    },
    99: {
        name: 'VCA Aftertouch',
        sysex: '17',
        desc: 'VCA Aftertouch (0..7F)',
        type: 'vca',
        range: RANGE_FULL
    }
};

let programmer, juno, launchResponse;

function panic() {
    [...Array(128).keys()].forEach((e) => { juno.stopNote(e) });
}

function buildUI() {
    // console.log(ccMap)
    let i = 0;
    for (let item in ccMap) {
        let control = document.createElement('div');
        control.className = 'controls ' + ccMap[item]['type'];
        control.className += (item < 77) || (item > 96) ? ' encoder' : ' slider'
        control.id = 'control_' + item;
        control.innerHTML = `
            <label>${ccMap[item]['name']} (${ccMap[item]['range'].length})</label>
            <input type="range" min="0" max="${ccMap[item]['range'].length}">
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
        });
    });

    document.querySelectorAll('.controls.button').forEach((el) => {
        el.addEventListener('click', (e) => {
            // TODO: play the appropriate note
            if (!e.target.getAttribute('data-note').includes('oct')) {
                if (e.target.getAttribute('data-note').length > 0) {
                    let note = e.target.getAttribute('data-note') + current_octave;
                    juno.playNote(note)
                } else {
                    // the empty button. what should it do?
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
                // TODO: change color of octave buttons on LCXL based on what octave it's in
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

function listenProgrammer() {
    programmer.addListener('controlchange', 'all', function(ev) {
        // console.log(`channel: ${ev.channel} controller: ${ev.controller.number} value: ${ev.value}`);
        document.querySelector(`#control_${ev.controller.number} > span`).innerText = ev.value;
        console.log(ccMap[ev.controller.number]);
        document.querySelector('.active').innerHTML = `
            ${ccMap[ev.controller.number]['name']}: 
            <span class='value'>${ev.value}</span>
            <small>${ccMap[ev.controller.number]['desc']}</small>
            MIDI Channel: ${ev.channel}
        `;
        let sysex = `0x36 0x00 0x23 0x01 0x01 0x${ccMap[ev.controller.number]['sysex']} 0x${decimalToHex(ev.value)}`; //.replace(/\s/g,'');
        // console.log('sysex ' + sysex, hexStringToByte(sysex));
        // let result = juno.sendSysex(0x41,[0x36, 0x00, 0x23, 0x20, 0x01, 8, 127]);
        sys = sysex.split(' ')
        console.log(sys);
        let mappedControllerInt = hexStringToByte(ccMap[ev.controller.number]['sysex'])[0];
        let arr = [54, 8, 35, 32, 1, mappedControllerInt, ev.value];
        console.log('arr', arr);
        console.log('ev', ev);
        let result = juno.sendSysex(0x41, arr);
        console.log(result)
    });

    programmer.addListener('noteon', 'all', (ev) => {
        console.log('ev', ev);
        console.log('note', noteMap[ev.note.number]["note"] + current_octave)
        if (noteMap[ev.note.number]["note"]) {
            let octUp = ev.note.number == 92 ? 1 : 0;
            juno.playNote(noteMap[ev.note.number]["note"] + (current_octave + octUp));
        }

        // Up octave
        if (ev.note.number == 60) {
            current_octave++;
            document.querySelector("#pad_0").setAttribute("data-oct", current_octave)
            document.querySelector("#pad_7").setAttribute("data-oct", current_octave)
        }

        // Down octave
        if (ev.note.number == 41) {
            current_octave--;
            document.querySelector("#pad_0").setAttribute("data-oct", current_octave)
            document.querySelector("#pad_7").setAttribute("data-oct", current_octave)
        }

        // Middle button resets to center octave
        if (ev.note.number == 44) {
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

        // Panic
        if (ev.note.number == 105) {
            panic();
        }
    });

    programmer.addListener('noteoff', 'all', (ev) => {
        let octUp = ev.note.number == 92 ? 1 : 0;
        juno.stopNote(noteMap[ev.note.number]["note"] + (current_octave + octUp));
    });
}
/*
F0 [Exclusive]
41 [Roland ID#]
36 [Individual Tone Parameters]
0N [N=MIDI channel (N=0-F, Chan 1=00 Chan 16=0F)]
23 [Format type]
20 [unknown]
01 [unknown]
XX [Parameter number (0-23)] see table below
YY [Value (0-127)] Can be left at 00
F7 [End of Exclusive]
*/
function decimalToHex(d) {
    var hex = Number(d).toString(16);
    hex = "00".substr(0, 2 - hex.length) + hex;
    return hex;
}

function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Int8Array(a);
}

function playJ() {
    let button = document.createElement('button');
    let panicB = document.createElement('button');
    button.innerText = "Play";
    panicB.innerText = "Panic";
    panicB.addEventListener('click', panic);

    // button.addEventListener('click', () => panic());
    button.addEventListener('click', function() {
        juno.playNote('c3', 1).stopNote('c3', 1, { time: 11600 })
        juno.playNote("G5", 1)
            .sendPitchBend(-0.5, 1, { time: 400 }) // After 400 ms.
            .sendPitchBend(0.5, 1, { time: 800 }) // After 800 ms.
            .stopNote("G5", 1, { time: 11200 }); // After 1.2 s.

        console.log('ffff');
    })
    document.body.appendChild(button);
    document.body.appendChild(panicB);
}

function launchResponseDefaults() {
    // light up some buttons
    playColor(41, VEL_D_GREEN); // octave down
    playColor(44, VEL_YELLOW); // empty
    playColor(60, VEL_D_GREEN); // octave up

    // panic has to send sysex not note info (since playing the note would also turn off the note)
    launchResponse.sendSysex(0x00, [32, 41, 2, 17, 120, 8, 40, 127]);

    // set the knob colors
    const BLACK = CHO = 0;
    const RED = VCA = 10;
    const YELLOW = VCF = 125;
    const AMBER = DCO = 30;
    const GREEN = LFO = 120;
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
        programmer = WebMidi.getInputByName('Launch Control XL');
        juno = WebMidi.getOutputByName('mio');
        launchResponse = WebMidi.getOutputByName('Launch Control XL');
        launchResponseDefaults();
        buildUI();
        listenProgrammer();
        listenViewport();
        playJ();
    }
}, true);