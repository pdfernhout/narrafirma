/*jslint browser: true */
"use strict";

define([
    "dojo/ready",
    "dojo/dom-attr",
    "dojo/io-query",
    "dijit/registry",
    "dojox/gfx",
    "dojox/gfx/move",
    "dojox/gfx/Moveable",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Textarea",
    "dijit/Dialog",
    "dojo/touch",
    "dojox/uuid/generateRandomUuid",
    "dojo/Stateful",
    "dojox/mvc/at",
    "dojox/layout/TableContainer",
    "dojo/_base/lang",
    "./widgetSupport"
    //"dojox/layout/ResizeHandle"
], function (
    ready,
    domAttr,
    ioQuery,
    registry,
    gfx,
    move,
    Moveable,
    TextBox,
    Button,
    SimpleTextarea,
    Dialog,
    touch,
    generateRandomUuid,
    Stateful,
    at,
    TableContainer,
    lang,
    widgetSupport
    // ResizeHandle
) {
   // Resources:
   // # http://dojotdg.zaffra.com/2009/03/dojo-now-with-drawing-tools-linux-journal-reprint/

    var surfaceWidth = 800;
    var surfaceHeight = 400;
    
    function uuidFast() {
    	return generateRandomUuid();
    }

    // Caution: "this" may be undefined for functions called by this unless "bind" or "hitch" is used
    function forEach(array, theFunction) {
        for (var index = 0, length = array.length; index < length; ++index) {
            theFunction(index, array[index], array);
        }
    }

    function removeItemFromArray(item, anArray) {
        var index = anArray.indexOf(item);
        if (index > -1) {
            anArray.splice(index, 1);
            return item;
        }
        return null;
    }
    
    /** ConceptMap-specific functions here */
    
    function insertConceptMap(contentPane, model, id, mapName, autosave) {
        return new ConceptMap(contentPane, model, id, mapName, autosave);
    }
    
    function ConceptMap(contentPane, model, id, mapName, autosave) {
        console.log("Creating ConceptMap", contentPane, model, id, mapName);

        this.autosave = autosave;
        this.changesCount = 0;
        this.lastSelectedItem = null;
        this.mainContentPane = contentPane;
        this.diagramName = mapName;
        this.idForStorage = id;
        this.modelForStorage = model;
        this.items = model.get(id);
        this.textBox = null;
        this.urlBox = null; 
        this._mainSurface = null;
        this.mainSurface = null;

        if (!this.items) {
            console.log("First time loading");
            this.items = [];
        } else {
            console.log("Already loaded");
            console.log("items", this.items);
        }

        this.setupMainButtons();

        //this.newBreak();

        this.addItemEditor();

        this.setupMainSurface();
    }
    
    ConceptMap.prototype.incrementChangesCount = function() {
        this.changesCount++;
        if (this.autosave) {
            this.saveChanges();
        }
    };
    
    ConceptMap.prototype.newBreak = function() {
        var newBr = document.createElement("br");
        this.mainContentPane.domNode.appendChild(newBr);

        return newBr;
    };

    ConceptMap.prototype.newButton = function(name, label, callback) {
        var theButton = new Button({
            label: label,
            onClick: lang.hitch(this, callback)
        }, name);
        this.mainContentPane.domNode.appendChild(theButton.domNode);

        return theButton;
    };

    ConceptMap.prototype.setupMainButtons = function() {

        var addButton = this.newButton("addButton", "New item", function () {
            this.openEntryDialog("", "");
        });

        /*
        var newDiagramButton = newButton("newDiagramButton", "Link to new diagram", lang.hitch(function () {
            var uuid = "pce:org.twirlip.ConceptMap:uuid:" + uuidFast();
            var url = "conceptMap.html?diagram=" + uuid;
            this.openEntryDialog("", url);
        }));
        */

        var sourceButton = this.newButton("sourceButton", "Diagram Source", function () {
            this.openSourceDialog(JSON.stringify(this.items));
        });

        if (!this.autosave) {
            var saveChangesButton = this.newButton("saveChangesButton", "Save Changes", function () {
                console.log("About to save");
                this.saveChanges();
            });
        }
    };

    ConceptMap.prototype.setupMainSurface = function() {
        var node = document.createElement("div");
        var divForCanvasInfo = {width: surfaceWidth, height: surfaceHeight, border: "solid 1px"};
        domAttr.set(node, "style", divForCanvasInfo);
        this.mainContentPane.domNode.appendChild(node);
        this._mainSurface = gfx.createSurface(node, divForCanvasInfo.width, divForCanvasInfo.height);
        this.mainSurface = this._mainSurface.createGroup();

        // surface.whenLoaded(drawStuff);

        this.rebuildItems();
        //   items.push({text: theText, url: theURL, x: circle.cx, y: circle.cy});
    };

    ConceptMap.prototype.addItemEditor = function() {
        // TODO: Translate
        var updateItemButton = this.newButton("updateItemButton", "Update item", function () {
            if (this.lastSelectedItem) {
                this.lastSelectedItem.text = this.textBox.get("value");
                this.lastSelectedItem.url = this.urlBox.get("value");
                this.incrementChangesCount();
                // Wasteful to do all of them
                this.rebuildItems();
            } else {
             // TODO: Translate
                alert("Please select an item to update first");
                return;
            }
        });

        var deleteButton = this.newButton("deleteButton", "Delete item", function () {
            if (!this.lastSelectedItem) {
                // TODO: Translate
                alert("Please select an item to delete first");
                return;
            }
            widgetSupport.confirm("Confirm removal of: '" + this.lastSelectedItem.text + "'?", lang.hitch(this, function () {
                removeItemFromArray(this.lastSelectedItem, this.items);
                this.incrementChangesCount();
                // Wasteful to do all of them
                this.rebuildItems();
            }));
        });
        
        /*
        // TODO: Translate
        var goButton = this.newButton("goButton", "Go", function () {
            this.go(urlBox.get("value"));
        });
        */
        
        // this.newBreak();
        
        var layout = new dojox.layout.TableContainer({
            showLabels: true,
            orientation: "horiz",
            labelWidth: 60
        });
        
        var textBoxWidth = "width: 40em; margin-left: 2em;";
        this.textBox = new TextBox({
            name: "conceptTextBox",
            value: "",
            // TODO: Translate
            title: 'Name',
            // TODO: Translate 
            placeHolder: "type in a concept",
            style: textBoxWidth
        }, "conceptTextBox");

        layout.addChild(this.textBox);
        
        var urlBoxWidth = "width: 40em; margin-left: 2em;";
        this.urlBox = new TextBox({
            name: "urlTextBox",
            value: "",
            // TODO: Translate
            title: 'Notes',
            // TODO: Translate 
            placeHolder: "type in some notes or a url with more information",
            style: urlBoxWidth
        }, "urlTextBox");

        layout.addChild(this.urlBox);
        
        this.mainContentPane.domNode.appendChild(layout.domNode);
        layout.startup();
    };

    ConceptMap.prototype.clickedNewEntryOK = function(dialogHolder, model, event) {
        // console.log("clickedNewEntryOK", this, dialogHolder, model, event);
        dialogHolder.dialog.hide();
        console.log("Clicked OK", event, model);
        var name = model.get("name");
        var url = model.get("url");
        console.log("data", name, url);
        var group = this.addItem(this.mainSurface, null, name, url);
        this.items.push(group.item);
        console.log("items", this.items);
        this.incrementChangesCount();
    };
    
    ConceptMap.prototype.openEntryDialog = function(name, url) {
        var model = new Stateful({name: name, url: url});

        var layout = new dojox.layout.TableContainer({
            showLabels: true,
            orientation: "horiz"
        });
        
        var nameTextBox = new TextBox({
            name: 'name',
            // TODO: Translate
            title: 'Name',
            value: at(model, "name"),
            placeHolder: "Name"
        });

        var urlTextBox = new TextBox({
            name: 'url',
            // TODO: Translate
            title: 'Notes',
            value: at(model, "url"),
            placeHolder: "Notes or URL with more information"
        });
        
        // Indirect way to hold onto dialog so can pass a reference to the dialog to button clicked function so that function can hide the dialog
        // The problem this solves is that a hoisted dialog is undefined at this point, and also hitch uses the current value not a reference to the variable
        var dialogHolder = {};
        
        var okButton = new Button({
            // TODO: Translate
            label: "OK",
            type: "button",
            // TODO: This won't be OK, and need model
            onClick: lang.hitch(this, this.clickedNewEntryOK, dialogHolder, model)
        });
        
        layout.addChild(nameTextBox);
        layout.addChild(urlTextBox);
        layout.addChild(okButton);
 
        var dialog = new Dialog({
            // TODO: Translate
            title: "New item",
            style: "width: 400px",
            content: layout
        });
        
        dialogHolder.dialog = dialog;
        
        // This will free the dialog when we are done with it whether from OK or Cancel
        dialog.connect(dialog, "onHide", function(e) {
            console.log("destroying entryDialog");
            dialog.destroyRecursive(); 
        });
        
        dialog.startup();
        layout.startup();
        dialog.show();
    };

    ConceptMap.prototype.clickedUpdateSource = function(dialogHolder, model, event) {
        console.log("Clicked updateSource", event);
        dialogHolder.dialog.hide();
        
        var sourceText = model.get("sourceText");
        console.log("sourceText", sourceText);

        this.items = JSON.parse(sourceText);

        console.log("parsed", this.items);

        this.rebuildItems();
        this.incrementChangesCount();
        console.log("Updated OK");
    };
    
    ConceptMap.prototype.openSourceDialog = function(sourceText) {
        var model = new Stateful({sourceText: sourceText});

        var layout = new dojox.layout.TableContainer({
            showLabels: false,
            orientation: "horiz"
        });
        
        var sourceTextarea = new SimpleTextarea({
            name: 'sourceText',
            value: at(model, "sourceText"),
            placeHolder: "[]"
        });
        
        // Indirect way to hold onto dialog so can pass a reference to the dialog to button clicked function so that function can hide the dialog
        // The problem this solves is that a hoisted dialog is undefined at this point, and also hitch uses the current value not a reference to the variable
        var dialogHolder = {};
        
        var okButton = new Button({
            // TODO: Translate
            label: "Update",
            type: "button",
            // TODO: This won't be OK, and need model
            onClick: lang.hitch(this, this.clickedUpdateSource, dialogHolder, model)
        });
        
        layout.addChild(sourceTextarea);
        layout.addChild(okButton);
 
        var dialog = new Dialog({
            // TODO: Translate
            title: "Diagram source",
            style: "width: 600px; height: 400px; overflow: auto",
            content: layout
        });
        
        dialogHolder.dialog = dialog;
        
        // This will free the dialog when we are done with it whether from OK or Cancel
        dialog.connect(dialog, "onHide", function(e) {
            console.log("destroying sourceDialog");
            dialog.destroyRecursive(); 
        });
        
        dialog.startup();
        layout.startup();
        dialog.show();
    };

    ConceptMap.prototype.rebuildItems = function() {
        // console.log("rebuildItems");
        this.mainSurface.clear();
        // console.log("before forEach this:", this);
        var thisObject = this;
        forEach(this.items, function (index, item) {
            // console.log("looping over: ", item, "this:", this);
            thisObject.addItem(thisObject.mainSurface, item);
        });
        // console.log("done rebuildItems");
    };

    ConceptMap.prototype.saveChanges = function() {
        this.modelForStorage.set(this.idForStorage, this.items);
    };

    /*
    ConceptMap.prototype.go = function(url) {
        console.log("go: ", url);
        if (!url) {
            console.log("empty url, not going");
            return;
        }
        console.log("items: ", items);
        if (changesCount !== 0) {
            console.log("trying to go with changes...");
            var okToGo = confirm("You have unsaved changes");
            if (!okToGo) return;
        }
        console.log("going to url", url);
        // document.location.href = url;
        window.open(url);
    };
    */
    
    ConceptMap.prototype.updateForItemClick = function(item) {
        this.textBox.set("value", item.text);
        this.urlBox.set("value", item.url);
    };
    
    var defaultBodyColor = [0, 0, 155, 0.5]; // blue, transparent
    var defaultBorderColor = "black";
    // var defaultBorderColor = "green";
    var defaultBorderWidth = 1;
    // var defaultHasNoteBorderColor = "green";
    // var defaultTextStyle = {family: "Arial", size: "10pt", weight: "bold"};
    var defaultTextStyle = {family: "Arial", size: "9pt", weight: "normal"};
    var defaultRadius = 44;

    ConceptMap.prototype.addItem = function(surface, item, text, url) {
        // alert("Add button pressed");
        //arrow = drawArrow(surface, {start: {x: 200, y: 200}, end: {x: 335, y: 335}});
        //new Moveable(arrow);
        // console.log("addClick");

        if (item === null) {
            item = {};
            item.text = text;
            item.url = url;
            item.x = 200;
            item.y = 200;
            item.uuid = uuidFast();
            // item.bodyColor = defaultBodyColor;
            // item.borderWidth = defaultBorderWidth;
            // item.borderColor = defaultBorderColor;
            // item.radius = defaultRadius;
            // item.textStyle = defaultTextStyle;
        }
        console.log("item", item);
        
        var bodyColor = item.bodyColor;
        if (!bodyColor) bodyColor = defaultBodyColor;
        
        var borderColor = item.borderColor;
        if (!borderColor) borderColor = defaultBorderColor;
        
        var borderWidth = item.borderWidth;
        if (!borderWidth) borderWidth = defaultBorderWidth;
        
        var radius = item.radius;
        if (!radius) radius = defaultRadius;
        
        var textStyle = item.textStyle;
        if (!textStyle) textStyle = defaultTextStyle;

        var group = surface.createGroup();
        group.item = item;

        // console.log("group etc.", group, item, bodyColor, borderColor, borderWidth, radius, textStyle);

        var circle = {cx: 0, cy: 0, r: radius };
        
        // TODO: Maybe no longer set a different color based on url if you can set border color yourself?? 
        // if (item.url) item.borderColor = defaultHasNoteBorderColor;

        var itemCircle = group.createCircle(circle).
            setFill(bodyColor).
            setStroke({color: borderColor, width: borderWidth, cap: "butt", join: 4}).
            applyTransform(gfx.matrix.identity);

        this.addText(group, item.text, radius * 1.5, textStyle);

        //console.log("group", group);
        //console.log("itemCircle", itemCircle);

        //touch.press(group, function(e) {
        //touch.press(itemCircle, function(e) {
        group.connect("onmousedown", lang.hitch(this, function (e) {
            // require(["dojo/on"], function(on) {
            //  var handle = on(group, "mousedown", function(e) {
            // console.log("triggered down", e);
            this.lastSelectedItem = item;
            // console.log("onmousedown item", item);
            this.updateForItemClick(item);
        }));

        /*
        group.connect("ondblclick", lang.hitch(this, function (e) {
            // var handle = on(group, "dblclick", function(e) {
            // alert("triggered ondblclick");
            this.go(group.item.url);
        }));
        */

        var moveable = new Moveable(group);
        moveable.item = item;

        moveable.onMoveStart = lang.hitch(this, function (mover, shift) {
            // Kludge for Android as not setting on mouse down
            this.updateForItemClick(item);
        });
        
        moveable.onMoved = lang.hitch(this, function (mover, shift) {
            item.x += shift.dx;
            item.y += shift.dy;
        });

        moveable.onMoveStop = lang.hitch(this, function (mover, shift) {
            this.incrementChangesCount();
        });

        group.applyTransform(gfx.matrix.translate(item.x, item.y));

        return group;
    };

    ConceptMap.prototype.addText = function(group, text, maxWidth, textStyle) {
        var lineHeight = 12;
        var tb = gfx._base._getTextBox;
        var words = text.split(" ");
        var lines = [];
        var line = "";
        forEach(words, function (index, word) {
            if (lines.length >= 5) {
                line = "...";
                return;
            }
            if (line === "") {
                line = word;
            } else if (tb(line + " " + word).w < maxWidth) {
                line += " " + word;
            } else {
                lines.push(line);
                line = word;
            }
        });
        if (line !== "") lines.push(line);
        var startY = -((lines.length - 1) / 2) * lineHeight;
        if (lines.length == 6) startY += lineHeight;
        var y = startY;
        forEach(lines, function (index, line) {
            var theTextItem = group.createText({text: line, x: 0, y: y, align: "middle"}).
                setFont(textStyle).
                setFill("black");
            console.log("textItem", theTextItem);
            y += lineHeight;
        }); 
    };
    
    return {
        insertConceptMap: insertConceptMap
    };
});