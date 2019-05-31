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