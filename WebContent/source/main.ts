import application = require("./application");

"use strict";
export function run() {
    console.log("main: starting");
    application.initialize();
    console.log("main: done with initialize");
}