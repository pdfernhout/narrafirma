import kludgeForUseStrict = require("../kludgeForUseStrict");

"use strict";
/* tslint:disable */

// Using deprecated funciton
declare var unescape;

// From http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
function stringToUtf8(input): string {
    return unescape(encodeURIComponent(input));
};
export = stringToUtf8;
