require([
    "dojox/mvc/at",
    "dijit/form/Button",
    "dojo/keys",
    "dojo/Stateful",
    "dijit/layout/ContentPane",
    "dijit/form/TextBox",
    "dojo/domReady!"
], function(
    at,
    Button,
    keys,
    Stateful,
    ContentPane,
    TextBox
){
    "use strict";
    
    // Issue: Notice how the widget sends changed messages even when value is changed programmatically (not by GUI user) via the at connector
    // Currently dealt with by checking if the value is the same as in the model. Could there ever be a possibility of "ringing"?
    
    var state = new Stateful({text: "Hello"});
    
    var doneCommands = [];
    var undoneCommands = [];
    
    function doCommand(command) {
        command.doIt(false);
        doneCommands.push(command);
        undoneCommands = [];
        redoButton.set("disabled", !undoneCommands.length);
        undoButton.set("disabled", !doneCommands.length);
    }
    
    function undo() {
        var command = doneCommands.pop();
        undoButton.set("disabled", !doneCommands.length);
        if (!command) return;
        command.undoIt();
        undoneCommands.push(command);
        redoButton.set("disabled", !undoneCommands.length);
    }
    
    function redo() {
        var command = undoneCommands.pop();
        redoButton.set("disabled", !undoneCommands.length);
        if (!command) return;
        command.doIt(true);
        doneCommands.push(command);
        undoButton.set("disabled", !doneCommands.length);
    }
    
    var topPane = new ContentPane();      
    topPane.placeAt(document.body);
    topPane.startup();
    
    var undoButton = new Button({
        label: "Undo",
        disabled: true,
        onClick: function() {
            undo();
        }
    });
    undoButton.placeAt(topPane);
    
    var redoButton = new Button({
        label: "Redo",
        disabled: true,
        onClick: function() {
            redo();
        }
    });
    redoButton.placeAt(topPane);
    
    new ContentPane({content: "<br>"}).placeAt(topPane);
    
    function doStateChangeCommand(newValue) {
        var oldValue = state.get("text");
        console.log("doStateChangeCommand", oldValue, newValue);
        if (oldValue === newValue) return;
        var command = {
          doIt: function (redo) {
              state.set("text", newValue);
          }, 
          undoIt: function() {
              state.set("text", oldValue);
          }
        };
        doCommand(command);
    }
    
    var textBox1 = new TextBox({value: at(state, "text").direction(at.from)});
    textBox1.on("change", function (value) {
        console.log("textBox1 changed", value);
        doStateChangeCommand(value);
    });
    textBox1.on("keydown", function(e) { 
        console.log("key down", e);                
        if (e.keyCode === keys.ENTER) {
            console.log("was ENTER");
            doStateChangeCommand(textBox1.get("value"));
        }
    });
    textBox1.placeAt(topPane);
    
    new ContentPane({content: "<br>"}).placeAt(topPane);
    
    var textBox2 = new TextBox({value: at(state, "text").direction(at.from)});
    textBox2.on("change", function (value) {
        console.log("textBox2 changed", value);
        doStateChangeCommand(value);
    });
    textBox2.placeAt(topPane);
    
    new ContentPane({content: "<br>"}).placeAt(topPane);
    
    var textBox3 = new TextBox({value: at(state, "text").direction(at.from)});
    textBox3.on("change", function (value) {
        console.log("textBox3 changed", value);
        doStateChangeCommand(value);
    });
    textBox3.placeAt(topPane);

});