/*jslint node: true */
"use strict";

// Test with node.js

var fs = require('fs');
fs.writeFile("webapp/js/pages/test_nodejs_filewriting.txt", "Hello file!", function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 