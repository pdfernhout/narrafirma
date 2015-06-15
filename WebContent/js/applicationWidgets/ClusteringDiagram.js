define(["require", "exports", "d3", "dijit/form/TextBox", "dijit/form/Button", "dijit/Dialog", "../pointrel20150417/generateRandomUuid", "dojo/Stateful", "dojox/mvc/at", "dojox/layout/TableContainer", "../panelBuilder/dialogSupport", "dijit/layout/ContentPane", "dijit/ColorPalette", "dojox/layout/ResizeHandle"], function (require, exports, d3, TextBox, Button, Dialog, generateRandomUuid, Stateful, at, TableContainer, dialogSupport, ContentPane, ColorPalette, ResizeHandle) {
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
    function forEach(theArray, theFunction) {
        for (var index = 0, length = theArray.length; index < length; ++index) {
            theFunction(index, theArray[index], theArray);
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
    function ClusteringDiagram(contentPane, model, id, diagramName, autosave) {
        console.log("Creating ClusteringDiagram", contentPane, model, id, diagramName);
        this.autosave = autosave;
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
                items: this.diagram,
                changesCount: 0
            };
        }
        if (!this.diagram.items) {
            this.diagram.items = [];
        }
        if (!this.diagram.changesCount) {
            this.diagram.changesCount = 0;
        }
        console.log("diagram", JSON.stringify(this.diagram, null, 2));
        this.textBox = null;
        this.urlBox = null;
        this.divForResizing = null;
        this._mainSurface = null;
        this.mainSurface = null;
        this.itemToDisplayObjectMap = {};
        this.setupMainButtons();
        this.setupMainSurface();
        this.addItemDisplay();
    }
    ClusteringDiagram.prototype.incrementChangesCount = function () {
        // console.log("incrementChangesCount", new Error());
        this.diagram.changesCount++;
        if (this.autosave) {
            // console.log("Saving changes");
            this.saveChanges();
        }
    };
    ClusteringDiagram.prototype.setupMainSurface = function () {
        var divForResizing = document.createElement("div");
        this.divForResizing = divForResizing;
        var divUUID = "ResizeableCanvasHolder_" + generateRandomUuid();
        divForResizing.setAttribute("id", divUUID);
        divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        this.mainContentPane.domNode.appendChild(divForResizing);
        var width = this.diagram.surfaceWidthInPixels;
        var height = this.diagram.surfaceHeightInPixels;
        this.d3DivForResizing = d3.select(divForResizing);
        this._mainSurface = this.d3DivForResizing.append('svg').attr('width', width).attr('height', height).attr('class', 'clustering');
        // this._mainSurface.append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "purple").on("mousedown", function () {console.log("purple circle clicked");});
        this.background = this._mainSurface.append("rect").attr('width', width).attr('height', height).attr('class', 'clusteringDiagramBackground').style('fill', 'white').on("mousedown", function () {
            console.log("mousedown in background");
            this.selectItem(null);
            // console.log("mousedown item", item);
        }.bind(this));
        this.mainSurface = this._mainSurface.append('g').attr('class', 'mainSurface');
        // console.log("setup main surface", this);
        this.recreateDisplayObjectsForAllItems();
        var handle = new ResizeHandle({
            targetId: divUUID,
            // Need either activeResize true or animateSizing false so that onResize will only be called when totally done resizing
            // and not with animation still running and node not quite the final size
            // Updating seems to look worse with activeResize true as canvas still draws old size while rectangle shrinks or grows 
            // activeResize: true,
            animateSizing: false,
            // style: "bottom: 4px; right: 4px;",
            onResize: this.updateSizeOfCanvasFromResizeHandle.bind(this)
        }).placeAt(divForResizing);
        // Need to call startup as made div and added it outside of existing connected ContentPane
        handle.startup();
    };
    ClusteringDiagram.prototype.updateSizeOfCanvasFromResizeHandle = function () {
        var newWidth = this.divForResizing.clientWidth;
        var newHeight = this.divForResizing.clientHeight;
        console.log("resize from ResizeHandle drag", newWidth, newHeight);
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
        this.diagram.surfaceWidthInPixels = newWidth;
        this.diagram.surfaceHeightInPixels = newHeight;
        this.incrementChangesCount();
    };
    ClusteringDiagram.prototype.updateSizeOfCanvasFromModel = function () {
        var newWidth = this.diagram.surfaceWidthInPixels;
        var newHeight = this.diagram.surfaceHeightInPixels;
        console.log("resize from model change", newWidth, newHeight);
        this.divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
    };
    ClusteringDiagram.prototype.newBreak = function () {
        var newBr = document.createElement("br");
        this.mainContentPane.domNode.appendChild(newBr);
        return newBr;
    };
    ClusteringDiagram.prototype.newButton = function (name, label, callback) {
        var theButton = new Button({
            label: label,
            onClick: callback.bind(this)
        }, name);
        this.mainContentPane.addChild(theButton);
        return theButton;
    };
    ClusteringDiagram.prototype.setupMainButtons = function () {
        // TODO: Translate
        var addItemButton = this.newButton("newItemButton", "New item", function () {
            var newItem = this.newItem();
            this.openEntryDialog(newItem, false);
        });
        var addClusterButton = this.newButton("newClusterButton", "New cluster", function () {
            var newItem = this.newItem();
            newItem.type = "cluster";
            this.openEntryDialog(newItem, false);
        });
        // TODO: Translate
        var updateItemButton = this.newButton("editItemButton", "Edit", function () {
            if (this.lastSelectedItem) {
                this.openEntryDialog(this.lastSelectedItem, true);
            }
            else {
                // TODO: Translate
                alert("Please select an item to update first");
            }
        });
        // TODO: Translate
        var deleteButton = this.newButton("deleteButton", "Delete", function () {
            if (!this.lastSelectedItem) {
                // TODO: Translate
                alert("Please select an item to delete first");
                return;
            }
            dialogSupport.confirm("Confirm removal of: '" + this.lastSelectedItem.text + "'?", function () {
                this.updateDisplayForChangedItem(this.lastSelectedItem, "delete");
                removeItemFromArray(this.lastSelectedItem, this.diagram.items);
                this.clearSelection();
                this.incrementChangesCount();
            }.bind(this));
        });
        if (!this.autosave) {
            // TODO: Translate
            var saveChangesButton = this.newButton("saveChangesButton", "Save Changes", function () {
                console.log("About to save");
                this.saveChanges();
            });
        }
        // TODO: Translate
        var sourceButton = this.newButton("sourceButton", "Diagram Source", function () {
            this.openSourceDialog(JSON.stringify(this.diagram, null, 2));
        });
    };
    ClusteringDiagram.prototype.addItemDisplay = function () {
        this.textBox = new ContentPane({ content: "", style: "text-overflow: ellipsis;" });
        this.mainContentPane.addChild(this.textBox);
        this.urlBox = new ContentPane({ content: "", style: "text-overflow: ellipsis;" });
        this.mainContentPane.addChild(this.urlBox);
    };
    // typeOfChange should be either "delete" or "update"
    ClusteringDiagram.prototype.updateDisplayForChangedItem = function (item, typeOfChange) {
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
    ClusteringDiagram.prototype.clickedEntryOK = function (dialogHolder, model, event) {
        console.log("clickedEntryOK", this, dialogHolder, model, event);
        dialogHolder.dialog.hide();
        console.log("Clicked OK", event, model);
        var text = model.get("text");
        if (text === undefined)
            text = "";
        var url = model.get("url");
        var bodyColor = model.get("bodyColor");
        console.log("data", text, url, bodyColor);
        var item = dialogHolder.item;
        item.text = text;
        item.url = url;
        // Documentation for ColorPalette says it returns a "Color" but it seems to really return a hex string
        if (bodyColor)
            item.bodyColor = bodyColor;
        if (!dialogHolder.isExistingItem) {
            console.log("not existing item", dialogHolder);
            this.diagram.items.push(item);
            var displayObject = this.addDisplayObjectForItem(this.mainSurface, item);
        }
        else {
            this.updateDisplayForChangedItem(item, "update");
        }
        console.log("items", this.diagram.items);
        this.incrementChangesCount();
        this.selectItem(item);
    };
    ClusteringDiagram.prototype.openEntryDialog = function (item, isExistingItem) {
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
        });
        // Indirect way to hold onto dialog so can pass a reference to the dialog to button clicked function so that function can hide the dialog
        // The problem this solves is that a hoisted dialog is undefined at this point, and also hitch uses the current value not a reference to the variable
        var dialogHolder = {
            dialog: undefined,
            item: undefined,
            isExistingItem: undefined
        };
        // TODO: Translate
        var type = "item";
        if (item.type)
            type = item.type;
        var buttonLabel = "Create " + type;
        if (isExistingItem)
            buttonLabel = "Update " + type;
        var okButton = new Button({
            colspan: 1,
            // TODO: Translate
            label: buttonLabel,
            type: "button",
            title: '',
            onClick: this.clickedEntryOK.bind(this, dialogHolder, model)
        });
        var cancelButton = new Button({
            colspan: 1,
            // TODO: Translate
            label: "Cancel",
            type: "button",
            title: '',
            onClick: function () {
                dialogHolder.dialog.hide();
            }
        });
        // TODO: Translate
        layout.addChild(new ContentPane({ content: "Name", style: "text-align: right;" }));
        layout.addChild(nameTextBox);
        // TODO: Translate
        layout.addChild(new ContentPane({ content: "Notes", style: "text-align: right;" }));
        layout.addChild(urlTextBox);
        // TODO: Translate
        layout.addChild(new ContentPane({ content: "Color", style: "text-align: right;" }));
        layout.addChild(colorPalette);
        layout.addChild(new ContentPane({ content: "" }));
        layout.addChild(new ContentPane({ content: "" }));
        layout.addChild(okButton);
        layout.addChild(cancelButton);
        // TODO: Translate
        var title = "New " + type;
        if (isExistingItem)
            title = "Change " + type;
        var dialog = new Dialog({
            title: title,
            style: "width: 400px",
            content: layout
        });
        dialogHolder.dialog = dialog;
        dialogHolder.item = item;
        dialogHolder.isExistingItem = isExistingItem;
        // This will free the dialog when we are done with it whether from OK or Cancel
        dialog.connect(dialog, "onHide", function (e) {
            console.log("destroying entryDialog");
            dialog.destroyRecursive();
        });
        dialog.show();
    };
    ClusteringDiagram.prototype.updateSourceClicked = function (sourceText, hideDialogMethod) {
        console.log("updateSourceClicked", sourceText);
        var newDiagram;
        try {
            newDiagram = JSON.parse(sourceText);
        }
        catch (e) {
            alert("Problem parsing source\n" + e);
            return;
        }
        hideDialogMethod();
        console.log("parsed diagram", newDiagram);
        this.updateDiagram(newDiagram);
        this.incrementChangesCount();
    };
    ClusteringDiagram.prototype.updateDiagram = function (newDiagram) {
        // console.log("updateDiagram", this.diagram, newDiagram);
        if (this.diagram.changesCount === newDiagram.changesCount) {
            // console.log("Changes count match at", newDiagram.changesCount);
            // Optimize out reflections of our changes back to us if the diagrams are the same
            // Extra cautious to compare JSON; otherwise probably could just return
            if (JSON.stringify(this.diagram) === JSON.stringify(newDiagram)) {
                // console.log("updateDiagram: new diagram seems identical to the old; not updating");
                return;
            }
        } // else {
        // console.log("updateDiagram: changes counts do not match", this.diagram.changesCount, newDiagram.changesCount);
        // }
        this.diagram = newDiagram;
        // Fixup changes count for legacy documents
        if (!this.diagram.changesCount)
            this.diagram.changesCount = 0;
        this.recreateDisplayObjectsForAllItems();
        // console.log("updateDiagram: Updated OK");
        this.clearSelection();
        this.updateSizeOfCanvasFromModel();
    };
    ClusteringDiagram.prototype.clearSelection = function () {
        this.selectItem(null);
    };
    ClusteringDiagram.prototype.openSourceDialog = function (text) {
        dialogSupport.openTextEditorDialog(text, "#clusterDiagramSource_titleID|Clustering Diagram", "#clusterDiagramSource_okButtonID|OK", this.updateSourceClicked.bind(this));
    };
    ClusteringDiagram.prototype.recreateDisplayObjectsForAllItems = function () {
        // console.log("recreateDisplayObjectsForAllItems");
        this.itemToDisplayObjectMap = {};
        this.mainSurface.selectAll("*").remove();
        // console.log("before forEach this:", this);
        var thisObject = this;
        forEach(this.diagram.items, function (index, item) {
            // console.log("looping over: ", item, "this:", this);
            var displayObject = thisObject.addDisplayObjectForItem(thisObject.mainSurface, item);
        });
        // console.log("done recreateDisplayObjectsForAllItems");
    };
    ClusteringDiagram.prototype.saveChanges = function () {
        this.modelForStorage.set(this.diagramName, this.diagram);
    };
    ClusteringDiagram.prototype.updateItemDisplay = function (item) {
        if (!item) {
            this.textBox.set("content", "");
            this.urlBox.set("content", "");
            return;
        }
        // this.textBox.set("value", item.text);
        // this.urlBox.set("value", item.url);
        // TODO: Translate labels
        this.textBox.set("content", "Name: " + (item.text || ""));
        this.urlBox.set("content", "Notes: " + (item.url || ""));
    };
    var defaultBodyColor = "#00009B"; // light blue
    // var defaultBodyColor = [0, 0, 155, 0.5]; // light blue, transparent
    var defaultBorderColor = "black";
    // var defaultBorderColor = "green";
    var defaultBorderWidth = 1;
    // var defaultHasNoteBorderColor = "green";
    // var defaultTextStyle = {family: "Arial", size: "10pt", weight: "bold"};
    var defaultTextStyle = { family: "Arial", size: "9pt", weight: "normal" };
    var defaultRadius = 44;
    ClusteringDiagram.prototype.newItem = function (text, url) {
        var item = {
            text: text,
            url: url,
            x: 200,
            y: 200,
            uuid: uuidFast(),
            type: "item"
        };
        // item.bodyColor = defaultBodyColor;
        // item.borderWidth = defaultBorderWidth;
        // item.borderColor = defaultBorderColor;
        // item.radius = defaultRadius;
        // item.textStyle = defaultTextStyle;
        return item;
    };
    // TODO: Clean up duplication here and elsewhere with calculating border color and width
    ClusteringDiagram.prototype.selectItem = function (item) {
        // console.log("selectItem", item);
        if (item === this.lastSelectedItem) {
            // console.log("lastSelectedItem and new selected item are the same; not updating");
            return;
        }
        if (this.lastSelectedItem) {
            // console.log("lastSelected", this.lastSelectedItem);
            var lastSelectedDisplayObject = this.itemToDisplayObjectMap[this.lastSelectedItem.uuid];
            lastSelectedDisplayObject.circle.style("stroke-width", lastSelectedDisplayObject.borderWidth);
        }
        if (item) {
            var displayObject = this.itemToDisplayObjectMap[item.uuid];
            displayObject.circle.style("stroke-width", displayObject.borderWidth * 2);
        }
        this.lastSelectedItem = item;
        this.updateItemDisplay(item);
    };
    ClusteringDiagram.prototype.addDisplayObjectForItem = function (surface, item) {
        console.log("addDisplayObjectForItem item", item);
        var bodyColor = item.bodyColor;
        if (!bodyColor)
            bodyColor = defaultBodyColor;
        var borderColor = item.borderColor;
        if (!borderColor)
            borderColor = defaultBorderColor;
        var borderWidth = item.borderWidth;
        if (!borderWidth)
            borderWidth = defaultBorderWidth;
        // if (item.type === "cluster") borderWidth = borderWidth * 2;
        var radius = item.radius;
        if (!radius)
            radius = defaultRadius;
        var textStyle = item.textStyle;
        if (!textStyle)
            textStyle = defaultTextStyle;
        var group;
        if (item.type === "cluster") {
            group = surface.insert('g', ':first-child').attr('transform', 'translate(' + item.x + ',' + item.y + ')').attr('class', 'item');
        }
        else {
            group = surface.append('g').attr('transform', 'translate(' + item.x + ',' + item.y + ')').attr('class', 'item');
        }
        // TODO: Does this work with SVG elements? Are they really D3 selections? Or maybe could also map data to element with D3?
        group.item = item;
        // console.log("group etc.", group, item, bodyColor, borderColor, borderWidth, radius, textStyle);
        if (item.type === "cluster") {
            // TODO: Maybe no longer set a different color based on url if you can set border color yourself?? 
            // if (item.url) item.borderColor = defaultHasNoteBorderColor;
            var clusterRectangleOuter = group.append("circle").attr("r", radius * 3).attr("cx", 0).attr("cy", 0).style("fill", d3.rgb(bodyColor).brighter()).style("opacity", 0.25).style("stroke", d3.rgb(borderColor)).style("stroke-width", borderWidth * 2);
            /*
            var clusterRectangleInner = group.append("circle")
                .attr("r", radius)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", d3.rgb(bodyColor))
                // Make translucent
                .style("opacity", 0.75)
                .style("stroke", d3.rgb(borderColor))
                .style("stroke-width", borderWidth);
            */
            group.circle = clusterRectangleOuter;
        }
        else {
            // TODO: Maybe no longer set a different color based on url if you can set border color yourself?? 
            // if (item.url) item.borderColor = defaultHasNoteBorderColor;
            var itemCircle = group.append("circle").attr("r", radius).attr("cx", 0).attr("cy", 0).style("fill", d3.rgb(bodyColor)).style("opacity", 0.5).style("stroke", d3.rgb(borderColor)).style("stroke-width", borderWidth);
            group.circle = itemCircle;
        }
        group.borderColor = borderColor;
        group.borderWidth = borderWidth;
        this.addText(group, item.text, radius * 1.5, textStyle);
        // console.log("group", group);
        // console.log("itemCircle", itemCircle);
        group.on("mousedown", function () {
            // console.log("mousedown item", item);
            this.selectItem(item);
        }.bind(this));
        var self = this;
        var drag = d3.behavior.drag();
        // drag.origin({x: item.x, y: item.y});
        var moved = false;
        drag.on("dragstart", function () {
            // console.log("dragstart item", item);
            self.selectItem(item);
            moved = false;
        });
        drag.on("drag", function () {
            // console.log("drag item", item);
            item.x += d3.event.dx;
            item.y += d3.event.dy;
            group.attr('transform', 'translate(' + item.x + ',' + item.y + ')');
            moved = true;
        });
        drag.on("dragend", function () {
            if (moved)
                self.incrementChangesCount();
        });
        group.call(drag);
        /*
        group.on("dblclick", function (e) {
            // alert("triggered ondblclick");
            this.go(group.item.url);
        }.bind(this));
        */
        this.itemToDisplayObjectMap[item.uuid] = group;
        return group;
    };
    // TODO: Unfortunate mix of canvas into an SVG app
    // Only straightforward way (without Dojo gfx) to get the text width, given the page may be hidden while making this, which causes text width to return 0 for SVG
    // Could not get other approaches of adding measuring div to dom to work, perhaps because top level body CSS styling
    // From: http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
    var measuringCanvas;
    function getTextWidth(text, textStyle) {
        // re-use canvas object for better performance
        var canvas = measuringCanvas || (measuringCanvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = "normal normal " + textStyle.weight + " " + textStyle.size + " " + textStyle.family;
        var metrics = context.measureText(text);
        var result = metrics.width;
        // console.log("getTextWidth", text, result);
        return result;
    }
    function myWrap(text, itemText, textStyle, maxWidth) {
        // console.log("myWrap", itemText, textStyle, maxWidth);
        var lineHeight_em = 1.1;
        var words = itemText.split(/\s+/);
        var lines = [];
        var line = "";
        forEach(words, function (index, word) {
            if (lines.length >= 5) {
                line = "...";
                return;
            }
            if (line === "") {
                line = word;
            }
            else if (getTextWidth(line + " " + word, textStyle) < maxWidth) {
                // console.log("word fits", word);
                line += " " + word;
            }
            else {
                // console.log("word does not fit", word, "|", line);
                lines.push(line);
                line = word;
            }
        });
        if (line !== "")
            lines.push(line);
        // var startY = -((lines.length - 1) / 2) * lineHeight;
        var lineNumber = (Math.round(-lines.length / 2 + 0.5));
        // if (lines.length === 6) startY += lineHeight;
        forEach(lines, function (index, line) {
            var tspan = text.append("tspan").attr("x", 0).attr("y", 0).attr("dy", (lineNumber++) * lineHeight_em + "em").text(line).style("fill", "black");
            // console.log("tspan", tspan);
        });
    }
    ClusteringDiagram.prototype.addText = function (group, itemText, maxWidth, textStyle) {
        var text = group.append("text").style("font-family", textStyle.family).style("font-size", textStyle.size).style("font-weight", textStyle.weight).style("text-anchor", "middle");
        myWrap(text, itemText, textStyle, maxWidth);
        // wrap(text, maxWidth, textStyle);
    };
    return ClusteringDiagram;
});
