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
    "dojox/uuid/generateRandomUuid"
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
    generateRandomUuid
) {
    // TODO: Will this still work OK if there are more than one map per page or per app?

    // TODO: Replace use of document.conceptMap_* for dialogs with callbacks
    // TODO: Probably memory leak here with dialogs when load data in application and page is regenerated; may be general issue with app?

   // Resources:
   // # http://dojotdg.zaffra.com/2009/03/dojo-now-with-drawing-tools-linux-journal-reprint/

    var surfaceWidth = 800;
    var surfaceHeight = 400;
    
    // dialogs
    var sourceDialog;
    var entryDialog;
    
    function defineSourceDialog() {
        // TODO: Will this still work OK if there are more than one map per page or per app?
        
        // Make our function available globally so the dialog can find it
        document.conceptMap_updateSource = conceptMap_updateSource;

        // Prevent making multiple versions of these dialogs if concept map is regenerated or used in multiple places
        sourceDialog = registry.byId("sourceDialog");
        if (sourceDialog) return;
        sourceDialog = new Dialog({
            title: "Diagram source",
            id: "sourceDialog",
            style: {width: "600px", height: "400px", overflow: "auto"},
            content: "source: <input data-dojo-type='dijit/form/SimpleTextarea' type='text' name='sourceTextArea' rows='30' id='sourceTextArea'>" +
                '<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="document.conceptMap_updateSource();">Update</button>' +
                '<button data-dojo-type="dijit/form/Button" type="submit">Cancel</button>'
        });
    }

    function defineEntryDialog() {
        // TODO: Will this still work OK if there are more than one map per page or per app?
        document.conceptMap_clickedNewEntryOK = conceptMap_clickedNewEntryOK;

        // Prevent making multiple versions of these dialogs if concept map is regenerated or used in multiple places
        entryDialog = registry.byId("formDialog");
        if (sourceDialog) return;
        
        entryDialog = new Dialog({
            title: "New item",
            id: "formDialog",
            style: "width: 300px",
            content: "name: <input data-dojo-type='dijit/form/TextBox' type='text' name='name' id='name'>" +
                "<br/>notes: <input data-dojo-type='dijit/form/TextBox' type='text' name='url' id='url'>" +
                //'<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="return registry.byId("formDialog").isValid();">OK</button>'
                '<br/><button data-dojo-type="dijit/form/Button" type="submit" onClick="document.conceptMap_clickedNewEntryOK();">OK</button>'
        });
    }
    
    function uuidFast() {
    	return generateRandomUuid();
    }

    function forEach(array, theFunction) {
        for (var index = 0, length = array.length; index < length; ++index) {
            theFunction(index, array[index], array);
        }
    }

    function setHTML(field, value) {
        domAttr.set(field, "innerHTML", value);
    }

    function setFieldValue(name, value) {
        registry.byId(name).set("value", value);
    }

    function setTextAreaValue(name, value) {
        registry.byId(name).set("value", value);
    }

    /** ConceptMap-specific functions here */
    
    function insertConceptMap(contentPane, model, id, mapName) {
        console.log("Called twirlip conceptMap code", mapName);
        
        var conceptMap = {
            changesCount: 0,
            lastSelectedItem: null,
            mainContentPane: contentPane,
            diagramName: mapName,
            idForStorage: id,
            modelForStorage: model,
            items: model.get(id),
            textBox: null,
            urlBox: null, 
            _mainSurface: null,
            mainSurface: null
        };

        if (!conceptMap.items) {
            console.log("First time loading");
            conceptMap.items = [];
        } else {
            console.log("Already loaded");
            console.log("items", conceptMap.items);
        }

        defineEntryDialog();
        defineSourceDialog();

        setupMainButtons();

        var newBr = document.createElement("br");
        conceptMap.mainContentPane.domNode.appendChild(newBr);

        addItemEditor();

        setupMainSurface();
    }

    function newButton(name, label, callback) {
        var theButton = new Button({
            label: label,
            onClick: callback
        }, name);
        mainContentPane.domNode.appendChild(theButton.domNode);

        return theButton;
    }

    function setupMainButtons() {

        var addButton = newButton("addButton", "New item", function () {
            setFieldValue("name", "");
            setFieldValue("url", "");
            entryDialog.show();
        });

        /*
        var newDiagramButton = newButton("newDiagramButton", "Link to new diagram", function () {
            var uuid = "pce:org.twirlip.ConceptMap:uuid:" + uuidFast();
            var url = "conceptMap.html?diagram=" + uuid;
            setFieldValue("name", "");
            setFieldValue("url", url);
            entryDialog.show();
        });
        */

        var sourceButton = newButton("sourceButton", "Diagram Source", function () {
            setTextAreaValue("sourceTextArea", JSON.stringify(items));
            sourceDialog.show();
        });

        var saveChangesButton = newButton("saveChangesButton", "Save Changes", function () {
            console.log("About to save");
            saveChanges();
        });
    }

    function setupMainSurface() {
        var node = document.createElement("div");
        var divForCanvasInfo = {width: surfaceWidth, height: surfaceHeight, border: "solid 1px"};
        domAttr.set(node, "style", divForCanvasInfo);
        mainContentPane.domNode.appendChild(node);
        _mainSurface = gfx.createSurface(node, divForCanvasInfo.width, divForCanvasInfo.height);
        mainSurface = _mainSurface.createGroup();

        // surface.whenLoaded(drawStuff);

        rebuildItems(mainSurface, items);
        //   items.push({text: theText, url: theURL, x: circle.cx, y: circle.cy});
    }

    function addItemEditor() {
        var textBoxWidth = "width: 30em; margin-left: 2em;";
        textBox = new TextBox({
            name: "conceptTextBox",
            value: "",
            placeHolder: "type in a concept",
            style: textBoxWidth
        }, "conceptTextBox");
        mainContentPane.domNode.appendChild(textBox.domNode);

        var updateItemButton = newButton("updateItemButton", "Update item", function () {
            if (lastSelectedItem) {
                lastSelectedItem.text = textBox.get("value");
                lastSelectedItem.url = urlBox.get("value");
                changesCount++;
                // Wasteful to do all of them
                rebuildItems(mainSurface, items);
            }
        });

        var newBreak = document.createElement("br");
        mainContentPane.domNode.appendChild(newBreak);

        // var urlBoxWidth = "width: 500em; border: 5px solid #C4C4C4; padding: 6px;";
        var urlBoxWidth = "width: 30em; margin-left: 2em;";
        urlBox = new TextBox({
            name: "urlTextBox",
            value: "", // http://www.rakontu.org
            placeHolder: "type in some notes or a url with more information",
            style: urlBoxWidth
        }, "urlTextBox");
        mainContentPane.domNode.appendChild(urlBox.domNode);

        /*
        var goButton = newButton("goButton", "Go", function () {
            go(urlBox.get("value"));
        });
        */

        //  var newBreak = document.createElement("br");
        //  mainContentPane.domNode.appendChild(newBreak);
    }

    function conceptMap_clickedNewEntryOK(event) {
        console.log("Clicked OK", event);
        var data = entryDialog.get("value");
        console.log("data", data);
        var group = addItem(mainSurface, null, data.name, data.url);
        items.push(group.item);
        console.log("items", items);
        changesCount++;
        // item.text = textBox.get("value");
        // item.url = urlBox.get("value");
    }

    function conceptMap_updateSource(event) {
        console.log("Clicked conceptMap_updateSource", event);
        var data = sourceDialog.get("value");
        console.log("data", data);

        //noinspection JSUnresolvedVariable
        var jsonText = data.sourceTextArea;
        console.log("data", jsonText);

        items = JSON.parse(jsonText);

        console.log("parsed", items);

        rebuildItems(mainSurface, items);
        changesCount++;
        console.log("Updated OK");
    }

    function rebuildItems(surface, items) {
        // console.log("rebuildItems");
        surface.clear();
        forEach(items, function (index, item) {
            // console.log("looping over: " + item);
            addItem(surface, item);
        });
        // console.log("done rebuildItems");
    }

    function saveChanges() {
        modelForStorage.set(idForStorage, items);
    }

    /*
    function go(url) {
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
    }
    */
    
    function updateForItemClick(item) {
        textBox.set("value", item.text);
        urlBox.set("value", item.url);
    }

    function addItem(surface, item, text, url) {
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
        }
        console.log("item", item);

        var group = surface.createGroup();
        group.item = item;

        console.log("group", group);

        var circle = {cx: 0, cy: 0, r: 50 };
        var color = "black";
        if (item.url) color = "green";
        //noinspection JSUnusedLocalSymbols
        var blueCircle = group.createCircle(circle).
            setFill([0, 0, 155, 0.5]).
            setStroke({color: color, width: 4, cap: "butt", join: 4}).
            applyTransform(gfx.matrix.identity);

        addText(group, item.text, 75);

        //console.log("group", group);
        //console.log("blueCircle", blueCircle);

        //touch.press(group, function(e) {
        //touch.press(blueCircle, function(e) {
        //noinspection JSUnusedLocalSymbols
        group.connect("onmousedown", function (e) {
            // require(["dojo/on"], function(on) {
            //  var handle = on(group, "mousedown", function(e) {
            // console.log("triggered down", e);
            lastSelectedItem = item;
            // console.log("onmousedown item", item);
            updateForItemClick(item);
        });

        /*
        //noinspection JSUnusedLocalSymbols
        group.connect("ondblclick", function (e) {
            // var handle = on(group, "dblclick", function(e) {
            // alert("triggered ondblclick");
            go(group.item.url);
        });
        // });
        */

        var moveable = new Moveable(group);
        moveable.item = item;

        moveable.onMoved = function (mover, shift) {
            item.x += shift.dx;
            item.y += shift.dy;
            changesCount++;

            // Kludge for Android as not setting on mouse down
            updateForItemClick(item);
        };

        group.applyTransform(gfx.matrix.translate(item.x, item.y));

        return group;
    }

    function addText(group, text, maxWidth) {
        var style = {family: "Arial", size: "10pt", weight: "bold"};
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
            //noinspection JSUnusedLocalSymbols
            var theTextItem = group.createText({text: line, x: 0, y: y, align: "middle"}).
                setFont(style).
                setFill("black");
            console.log(theTextItem);
            y += lineHeight;
        }); 
    }
    
    return {
        insertConceptMap: insertConceptMap
    };
});