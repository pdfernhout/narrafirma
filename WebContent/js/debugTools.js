// TODO: Wrap use strict in functions
"use strict";
define(["require", "exports"], function (require, exports) {
    // To use, import this module and call in suspect code: debugTools.suspectToBeLoopingInfinitely();
    // From: http://stackoverflow.com/questions/12815892/how-to-debug-javascript-when-it-goes-into-infinite-loops-and-recursive-calls-in
    // IMPORTANT --- calls to this should be for development bug catching only
    var calls = 0;
    function suspectToBeLoopingInfinitely() {
        calls += 1;
        console.log("==== calls", calls);
        if (calls > 100) {
            console.log("trying to start debugger");
            debugger;
            console.log("Did it halt?");
        }
    }
    exports.suspectToBeLoopingInfinitely = suspectToBeLoopingInfinitely;
});
