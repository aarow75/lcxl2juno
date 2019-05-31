# Launch Control XL to Alpha Juno - Programmer

Having a Launch Control XL (LC XL) (24 pots, 8 sliders, 16 velocity sensitive pads + another 7 buttons) seems like a logical choice for programming an Alpha Juno, which require 35 or so encoders/sliders to avoid using the tedious Alpha dial or buying a PG-300 or it's clone for $300+. A Lauch Control XL costs about half as much and has more uses than a PG-300 (some clones will output CC as well, making them good general MIDI controllers though).

The primary limitation beyond it's USB MIDI only hardware is that it only sends note or CC values. This limits it as a programmer for older synths that rely on SysEx for everything, and many new synths that use RPN/NRPN messages. So there was a need to translate the CC and note data that the LC XL sends, and translate it into SysEx that the Alpha Juno understands.

A secondary concern of using the LC XL is it in not well labeled to replace a PG-300. Sticking labels on the LC XL might be fine until you want to switch to another template and use it to control something other than the Juno, so another approach is preferred. With the MIDI support in Chrome browser and a trivial platform to build a UI, it was determined that a browser-based solution would fit the bill. Along with a UI that roughly mirrors the LC XL, it also shows current values and the LC XL is sent LED updates to make the screen and the hardware line up.

It includes a keyboard that lets you move up and down octaves, a panic button for stuck notes, and in the future I will add an Arpeggiator. 

While not tested, it is hoped that this will also work running on a Raspberry Pi for a potential embedded-style of setup for those who prefer going computer-less.