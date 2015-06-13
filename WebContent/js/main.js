define(["require", "exports", "./application"], function (require, exports, application) {
    "use strict";
    console.log("main: starting");
    application.initialize();
    console.log("main: done with initialize");
});
