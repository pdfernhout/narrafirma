/*jslint browser: true */
define([
    "dojox/gfx",
    "dojox/gfx/Moveable",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/Dialog",
    "dojox/uuid/generateRandomUuid",
    "dojo/Stateful",
    "dojox/mvc/at",
    "dojox/layout/TableContainer",
    "dojo/_base/lang",
    "./dialogSupport",
    "dijit/layout/ContentPane",
    "dijit/ColorPalette",
    "dojo/_base/Color",
    "dojox/layout/ResizeHandle"
], function (
    gfx,
    Moveable,
    TextBox,
    Button,
    Dialog,
    generateRandomUuid,
    Stateful,
    at,
    TableContainer,
    lang,
    dialogSupport,
    ContentPane,
    ColorPalette,
    Color,
    ResizeHandle
) {
    "use strict";

    // Resources:
   // # http://dojotdg.zaffra.com/2009/03/dojo-now-with-drawing-tools-linux-journal-reprint/

    // TODO: Maybe add tooltip with notes for item? And then don't display item info at bottom?
    // TODO: Select and move groups of items
    // TODO: Does surface need to be "destroy"-ed when closing page or replacing contentPane to prevent memory leak?
    
    var defaultSurfaceWidthInPixels = 800;
    var defaultSurfaceHeightInPixels = 400;
    
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
    
    /** ClusteringDiagram-specific functions here */
    
    function insertClusteringDiagram(contentPane, model, id, diagramName, autosave) {
        return new ClusteringDiagram(contentPane, model, id, diagramName, autosave);
    }
    
    function ClusteringDiagram(contentPane, model, id, diagramName, autosave) {
        console.log("Creating ClusteringDiagram", contentPane, model, id, diagramName);

        this.autosave = autosave;
        this.changesCount = 0;
        this.lastSelectedItem = null;
        this.mainContentPane = contentPane;
        this.diagramName = diagramName;
        this.idOfWidget = id;
        this.modelForStorage = model;
        this.diagram = model.get(this.diagramName);
        
        // TODO: remove test on Array after demo data gets upgraded
        if (!this.diagram || this.diagram instanceof Array) {
            this.diagram = {
                surfaceWidthInPixels: defaultSurfaceWidthInPixels,
                surfaceHeightInPixels: defaultSurfaceHeightInPixels,
                items: this.diagram
            };
        }
        
        if (!this.diagram.items) {
            this.diagram.items = [];
        }
        
        console.log("diagram", JSON.stringify(this.diagram, null, 2));
        
        this.textBox = null;
        this.urlBox = null; 
        this.divForResizing = null;
        this._mainSurface = null;
        this.mainSurface = null;
        this.itemToDisplayObjectMap = {};

        this.setupMainButtons();

        //this.newBreak();

        this.addItemEditor();

        this.setupMainSurface();
        
        this.addItemDisplay();
    }
    
    ClusteringDiagram.prototype.incrementChangesCount = function() {
        this.changesCount++;
        if (this.autosave) {
            this.saveChanges();
        }
    };
    
    ClusteringDiagram.prototype.newBreak = function() {
        var newBr = document.createElement("br");
        this.mainContentPane.domNode.appendChild(newBr);

        return newBr;
    };

    ClusteringDiagram.prototype.newButton = function(name, label, callback) {
        var theButton = new Button({
            label: label,
            onClick: lang.hitch(this, callback)
        }, name);
        this.mainContentPane.addChild(theButton);

        return theButton;
    };

    ClusteringDiagram.prototype.setupMainButtons = function() {

        if (!this.autosave) {
            var saveChangesButton = this.newButton("saveChangesButton", "Save Changes", function () {
                console.log("About to save");
                this.saveChanges();
            });
        }
        
        var sourceButton = this.newButton("sourceButton", "Diagram Source", function () {
            this.openSourceDialog(JSON.stringify(this.diagram, null, 2));
        });
        
        var addButton = this.newButton("addButton", "New item", function () {
            var newItem = this.newItem();
            this.openEntryDialog(newItem, false);
        });
    };

    ClusteringDiagram.prototype.setupMainSurface = function() {
        var divForResizing = document.createElement("div");
        this.divForResizing = divForResizing;
        var divUUID = "ResizeableCanvasHolder_" + generateRandomUuid(); 
        divForResizing.setAttribute("id", divUUID);
        divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
       
        this.mainContentPane.domNode.appendChild(divForResizing);
        
        this._mainSurface = gfx.createSurface(divForResizing, this.diagram.surfaceWidthInPixels, this.diagram.surfaceHeightInPixels);

        this._mainSurface.whenLoaded(lang.hitch(this, function() {
            // TODO: Maybe need to disable diagram widget until this callback is called?
            this.mainSurface = this._mainSurface.createGroup();
            this._mainSurface.connect("onmousedown", lang.hitch(this, function (e) {
                // console.log("triggered down", e);
                this.selectItem(null);
                // console.log("onmousedown item", item);
            }));
            this.recreateDisplayObjectsForAllItems();
        }));
        
        var handle = new ResizeHandle({
            targetId: divUUID,
            // Need either activeResize true or animateSizing false so that onResize will only be called when totally done resizing
            // and not with animation still running and node not quite the final size
            // Updating seems to look worse with activeResize true as canvas still draws old size while rectangle shrinks or grows 
            // activeResize: true,
            animateSizing: false,
            // style: "bottom: 4px; right: 4px;",
            onResize: lang.hitch(this, this.updateSizeOfCanvas)
        }).placeAt(divForResizing);
        // TODO: Unsure if need this: handle.startup();
    };
    
    ClusteringDiagram.prototype.updateSizeOfCanvas = function() {
        var newWidth = this.divForResizing.clientWidth;
        var newHeight = this.divForResizing.clientHeight;
        console.log("resize!", newWidth, newHeight);
        this._mainSurface.setDimensions(newWidth, newHeight);
        
        this.diagram.surfaceWidthInPixels = newWidth;
        this.diagram.surfaceHeightInPixels = newHeight;
        this.incrementChangesCount();
    };

    ClusteringDiagram.prototype.addItemEditor = function() {
        // TODO: Translate
        var updateItemButton = this.newButton("updateItemButton", "Update item", function () {
            if (this.lastSelectedItem) {
                this.openEntryDialog(this.lastSelectedItem, true);
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
            dialogSupport.confirm("Confirm removal of: '" + this.lastSelectedItem.text + "'?", lang.hitch(this, function () {
                this.updateDisplayForChangedItem(this.lastSelectedItem, "delete");
                removeItemFromArray(this.lastSelectedItem, this.diagram.items);
                this.clearSelection();
                this.incrementChangesCount();
            }));
        });
    };
    
    
    ClusteringDiagram.prototype.addItemDisplay = function() {    
        this.textBox = new ContentPane({content: "", style: "text-overflow: ellipsis;"});
        this.mainContentPane.addChild(this.textBox);
        this.urlBox = new ContentPane({content: "", style: "text-overflow: ellipsis;"});
        this.mainContentPane.addChild(this.urlBox);
    };

    // typeOfChange should be either "delete" or "update"
    ClusteringDiagram.prototype.updateDisplayForChangedItem = function(item, typeOfChange) {
        if (item === null) {
            console.log("updateDisplayForChangedItem item is null", typeOfChange);
            return;
        }
        var displayObject = this.itemToDisplayObjectMap[item.uuid];
        if (typeOfChange === "delete") {
            delete this.itemToDisplayObjectMap[item.uuid];
            this.mainSurface.remove(displayObject);
            displayObject.destroy();
            return;
        }
        this.mainSurface.remove(displayObject);
        var newDisplayObject = this.addDisplayObjectForItem(this.mainSurface, item);
        this.itemToDisplayObjectMap[item.uuid] = newDisplayObject;
    };
    
    ClusteringDiagram.prototype.clickedEntryOK = function(dialogHolder, model, event) {
        console.log("clickedEntryOK", this, dialogHolder, model, event);
        dialogHolder.dialog.hide();
        console.log("Clicked OK", event, model);
        var text = model.get("text");
        if (text === undefined) text = "";
        var url = model.get("url");
        var bodyColor = model.get("bodyColor");
        console.log("data", text, url, bodyColor);
        var item = dialogHolder.item;
        item.text = text;
        item.url = url;
        // Documentation for ColorPalette says it returns a "Color" but it seems to really return a hex string
        if (bodyColor) item.bodyColor = bodyColor;
        if (!dialogHolder.isExistingItem) {
            this.diagram.items.push(item);
            var displayObject = this.addDisplayObjectForItem(this.mainSurface, item);
        } else {
            this.updateDisplayForChangedItem(item, "update");
        }
        console.log("items", this.diagram.items);
        this.incrementChangesCount();
        this.selectItem(item);
    };
    
    ClusteringDiagram.prototype.openEntryDialog = function(item, isExistingItem) {
        console.log("openEntryDialog", item, isExistingItem);
        var model = new Stateful(item);

        var layout = new TableContainer({
            cols: 4,
            showLabels: false,
            orientation: "horiz"
        });
        
        var nameTextBox = new TextBox({
            colspan: 3,
            name: 'name',
            value: at(model, "text"),
            placeHolder: "Name"
        });

        var urlTextBox = new TextBox({
            colspan: 3,
            name: 'url',
            value: at(model, "url"),
            placeHolder: "Notes or URL with more information"
        });
        
        var colorPalette = new ColorPalette({
            // palette: "7x10",
            palette: "3x4",
            colspan: 3,
            value: at(model, "bodyColor")
            // onChange: function(val){ console.log("color: ", val); } 
        });
        
        // Indirect way to hold onto dialog so can pass a reference to the dialog to button clicked function so that function can hide the dialog
        // The problem this solves is that a hoisted dialog is undefined at this point, and also hitch uses the current value not a reference to the variable
        var dialogHolder = {};
        
        // TODO: Translate
        var buttonLabel = "Create item";
        if (isExistingItem) buttonLabel = "Update item";
        
        var okButton = new Button({
            colspan: 1,
            // TODO: Translate
            label: buttonLabel,
            type: "button",
            title: '',
            onClick: lang.hitch(this, this.clickedEntryOK, dialogHolder, model)
        });
        
        var cancelButton = new Button({
            colspan: 1,
            // TODO: Translate
            label: "Cancel",
            type: "button",
            title: '',
            onClick: function () {dialogHolder.dialog.hide();}
        });
        
         // TODO: Translate
        layout.addChild(new ContentPane({content: "Name", style: "text-align: right;"}));
        layout.addChild(nameTextBox);
         // TODO: Translate
        layout.addChild(new ContentPane({content: "Notes", style: "text-align: right;"}));
        layout.addChild(urlTextBox);
        // TODO: Translate
        layout.addChild(new ContentPane({content: "Color", style: "text-align: right;"}));
        layout.addChild(colorPalette);
        layout.addChild(new ContentPane({content: ""}));
        layout.addChild(new ContentPane({content: ""}));
        layout.addChild(okButton);
        layout.addChild(cancelButton);
        
        // TODO: Translate
        var title = "New Item";
        if (isExistingItem) title = "Change Item";
 
        var dialog = new Dialog({
            title: title,
            style: "width: 400px",
            content: layout
        });

        dialogHolder.dialog = dialog;
        dialogHolder.item = item;
        dialogHolder.isExistingItem = isExistingItem;
        
        // This will free the dialog when we are done with it whether from OK or Cancel
        dialog.connect(dialog, "onHide", function(e) {
            console.log("destroying entryDialog");
            dialog.destroyRecursive(); 
        });
        
        dialog.startup();
        dialog.show();
    };

    ClusteringDiagram.prototype.updateSourceClicked = function(sourceText, hideDialogMethod) {     
        console.log("updateSourceClicked", sourceText);

        try {
            this.diagram = JSON.parse(sourceText);
        } catch(e) {
            alert("Problem parsing source\n" + e);
            return;
        }
        hideDialogMethod();

        console.log("parsed diagram", this.diagram);

        this.recreateDisplayObjectsForAllItems();
        this.incrementChangesCount();
        console.log("Updated OK");
        
        this.clearSelection();
    };
    
    ClusteringDiagram.prototype.clearSelection = function() {
        this.selectItem(null);
    };
    
    ClusteringDiagram.prototype.openSourceDialog = function(text) {
        dialogSupport.openTextEditorDialog(text, "dialog_clusterDiagramSourceID", "clusterDiagramSource_titleID", "clusterDiagramSource_okButtonID", lang.hitch(this, this.updateSourceClicked));
     };

    ClusteringDiagram.prototype.recreateDisplayObjectsForAllItems = function() {
        // console.log("recreateDisplayObjectsForAllItems");
        this.itemToDisplayObjectMap = {};
        this.mainSurface.clear();
        // console.log("before forEach this:", this);
        var thisObject = this;
        forEach(this.diagram.items, function (index, item) {
            // console.log("looping over: ", item, "this:", this);
            var displayObject = thisObject.addDisplayObjectForItem(thisObject.mainSurface, item);
        });
        // console.log("done recreateDisplayObjectsForAllItems");
    };

    ClusteringDiagram.prototype.saveChanges = function() {
        this.modelForStorage.set(this.diagramName, this.diagram);
    };

    ClusteringDiagram.prototype.updateItemDisplay = function(item) {
        if (!item) {
            this.textBox.set("content", "");
            this.urlBox.set("content", "");
            return;
        }
        // this.textBox.set("value", item.text);
        // this.urlBox.set("value", item.url);
        // TODO: Translate labels
        this.textBox.set("content", "Name: " + item.text);
        this.urlBox.set("content", "Notes: " + item.url);
    };
    
    var defaultBodyColor = "#00009B"; // light blue
    // var defaultBodyColor = [0, 0, 155, 0.5]; // light blue, transparent
    var defaultBorderColor = "black";
    // var defaultBorderColor = "green";
    var defaultBorderWidth = 1;
    // var defaultHasNoteBorderColor = "green";
    // var defaultTextStyle = {family: "Arial", size: "10pt", weight: "bold"};
    var defaultTextStyle = {family: "Arial", size: "9pt", weight: "normal"};
    var defaultRadius = 44;
    
    ClusteringDiagram.prototype.newItem = function(text, url) {
        var item = {};
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
        return item;
    };

    // TODO: Clean up duplication here and elsewhere with calculating border color and width
    ClusteringDiagram.prototype.selectItem = function(item) {
        console.log("selectItem", item);
        if (this.lastSelectedItem) {
            console.log("lastSelected", this.lastSelectedItem);
            var lastSelectedDisplayObject = this.itemToDisplayObjectMap[this.lastSelectedItem.uuid];
            lastSelectedDisplayObject.circle.setStroke({color: lastSelectedDisplayObject.borderColor, width: lastSelectedDisplayObject.borderWidth, cap: "butt", join: 4});
        }
        if (item) {
            var displayObject = this.itemToDisplayObjectMap[item.uuid];
            displayObject.circle.setStroke({color: displayObject.borderColor, width: displayObject.borderWidth * 2, cap: "butt", join: 4});
        }
        this.lastSelectedItem = item;
        this.updateItemDisplay(item);
    };
    
    ClusteringDiagram.prototype.addDisplayObjectForItem = function(surface, item) {
        console.log("addDisplayObjectForItem item", item);
        
        var bodyColor = item.bodyColor;
        if (!bodyColor) bodyColor = defaultBodyColor;
        
        var borderColor = item.borderColor;
        if (!borderColor) borderColor = defaultBorderColor;
        // Ensure body color is translucent
        bodyColor = Color.fromString(bodyColor).toRgba();
        bodyColor[3] = 0.5;
        
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
        
        group.circle = itemCircle;
        group.borderColor = borderColor;
        group.borderWidth = borderWidth;
        
        this.addText(group, item.text, radius * 1.5, textStyle);

        //console.log("group", group);
        //console.log("itemCircle", itemCircle);

        //touch.press(group, function(e) {
        //touch.press(itemCircle, function(e) {
        group.connect("onmousedown", lang.hitch(this, function (e) {
            // console.log("triggered down", e);
            this.selectItem(item);
            // console.log("onmousedown item", item);
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
            this.updateItemDisplay(item);
        });
        
        moveable.onMoved = lang.hitch(this, function (mover, shift) {
            item.x += shift.dx;
            item.y += shift.dy;
        });

        moveable.onMoveStop = lang.hitch(this, function (mover, shift) {
            this.incrementChangesCount();
        });

        group.applyTransform(gfx.matrix.translate(item.x, item.y));

        this.itemToDisplayObjectMap[item.uuid] = group;
        return group;
    };

    ClusteringDiagram.prototype.addText = function(group, text, maxWidth, textStyle) {
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
        if (lines.length === 6) startY += lineHeight;
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
        insertClusteringDiagram: insertClusteringDiagram
    };
});