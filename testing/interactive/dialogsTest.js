require([
    "js/panelBuilder/dialogSupport",
    "dojo/domReady!"
], function(
    dialogSupport
){
    "use strict";
    
    console.log("dialogsTest.js");
    
    // dialogSupport.confirm("Test");
    
    var text = "test text to edit";
    for (var i = 0; i < 1000; i++) {
        text += " more testing";
    }
    
    /*
    dialogSupport.openTextEditorDialog(text, null, null, function (result, hideDialogMethod) {
        hideDialogMethod();
        console.log("result", result);
    });
    */
    
    var choices = [
    ];
    
    for (i = 0; i < 100; i++) {
        choices.push({a: "" + i, b: "" + (i * i)});
    }
    
    var columns = {a: "A field", b: "B field (square of a)"};
    
    dialogSupport.openListChoiceDialog(choices[2], choices, columns, null, null, function (result) {
        console.log("result", result);
    });
    
});