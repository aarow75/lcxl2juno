# Launch Control XL to Alpha Juno - Programmer

Having a Launch Control XL (LC XL) (24 pots, 8 sliders, 16 velocity sensitive pads + another 7 buttons) seems like a logical choice for programming an Alpha Juno, which require 35 or so encoders/sliders to avoid using the tedious Alpha dial or buying a PG-300 or it's clone for $300+. A Lauch Control XL costs about half as much and has more uses than a PG-300 (some clones will output CC as well, making them good general MIDI controllers though).

The primary limitation beyond it's USB MIDI only hardware is that it only sends note or CC values. This limits it as a programmer for older synths that rely on SysEx for everything, and many new synths that use RPN/NRPN messages. So there was a need to translate the CC and note data that the LC XL sends, and translate it into SysEx that the Alpha Juno understands.

A secondary concern of using the LC XL is it in not well labeled to replace a PG-300. Sticking labels on the LC XL might be fine until you want to switch to another template and use it to control something other than the Juno, so another approach is preferred. With the MIDI support in Chrome browser and a trivial platform to build a UI, it was determined that a browser-based solution would fit the bill. Along with a UI that roughly mirrors the LC XL, it also shows current values and the LC XL is sent LED updates to make the screen and the hardware line up.

It includes a keyboard that lets you move up and down octaves, a panic button for stuck notes, and in the future I will add an Arpeggiator. 

While not tested, it is hoped that this will also work running on a Raspberry Pi for a potential embedded-style of setup for those who prefer going computer-minimal.

This assumes communication on channel 9, since it is the first Factory Template channel, and also assumes the use of a "mio" USB to MIDI adapter to connect to the Juno. After running the requisite `npm i`, run the server with `npm start`

## TODO
1. Add an arpeggiator. There are 7(?) unused buttons on the LC XL, so one for hold, and the others for different variations maybe?
2. Some chord buttons. Maybe hit a key and then one of the buttons that will play that note in a major or minor chord or something like that. Maybe an "sub"/"octave" type chord where it plays the same note but an octave lower or something.
3. A step sequencer.
4. A JV-1010 Programmer.
5. A Emu Proteus 2000 Programmer.
6. A Novation MiniNova Programmer.
7. A Novation Circuit Programmer.
8. This but instead of using a LC XL, using a Beatstep Pro instead (would have to split out some of the knobs accros 2 programs though), or a Novation Circuit (across 4 channels (1,2,10,16) x 8 macro knobs). 
9. Find a way to add the Aftertouch controls (another template perhaps? Or see #10).
10. While the LC XL doesn't need to have a screen visible, the app requires the browser to be open to the page. What about having it so a LC XL is not required and things can be controlled by the web app alone? Along with that, having it working well on a touch screen.
11. Maybe instead of using the 16 pads as a keyboard, they can be reassigned to some of the other settings like Chorus ON/OFF (since it's just a toggle) or some of the settings that only have 4 values (like Pulse Wave, Sub Level, Noise Level, VCA Envelope Mode, DCO Envelope Mode, VCF Envelope Mode, or the High Pass Filter) get moved to a button or multiple buttons. This would free up space to add the Aftertouch Modulation controls to an encoder.
12. Add SVG renditions of the 4 and 6 state controls or add an image of the matrix found on the Alpha Juno face
