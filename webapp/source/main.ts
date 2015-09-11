import Application = require("./Application");

"use strict";
export function run() {
    console.log("main: starting");
    var application = new Application();
    application.initialize();
    console.log("main: done with initialize");
}