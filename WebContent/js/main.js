define(["require", "exports", "./application"], function (require, exports, application) {
    "use strict";
    function run() {
        console.log("main: starting");
        application.initialize();
        console.log("main: done with initialize");
    }
    exports.run = run;
});
//# sourceMappingURL=main.js.map