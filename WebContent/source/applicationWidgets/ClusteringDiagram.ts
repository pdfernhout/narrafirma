/*jslint browser: true */
import d3 = require("d3");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import dialogSupport = require("../panelBuilder/dialogSupport");
import m = require("mithril");

"use strict";

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
        } else if (getTextWidth(line + " " + word, textStyle) < maxWidth) {
            // console.log("word fits", word);
            line += " " + word;
        } else {
            // console.log("word does not fit", word, "|", line);
            lines.push(line);
            line = word;
        }
    });
    if (line !== "") lines.push(line);
    // var startY = -((lines.length - 1) / 2) * lineHeight;
    var lineNumber = (Math.round(-lines.length / 2 + 0.5));
    // if (lines.length === 6) startY += lineHeight;
    forEach(lines, function (index, line) {
        var tspan = text.append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", (lineNumber++) * lineHeight_em  + "em")
            .text(line)
            .style("fill", "black");
        // console.log("tspan", tspan);
    }); 
}

/** ClusteringDiagram-specific functions here */

class ClusteringDiagram {
    mainButtons = [];
    
    autosave: boolean = false;
    lastSelectedItem = null;
    diagramName: string = null;
    idOfWidget: string = null;
    modelForStorage = null;
    diagram = null;
    divForResizing: HTMLElement = null;
    _mainSurface: d3.Selection<any> = null;
    mainSurface: d3.Selection<any> = null;
    itemToDisplayObjectMap: {key: string; element: d3.Selection<any>} = <any>{};
    
    d3DivForResizing: d3.Selection<any> = null;
    background = null;
    
    showEntryDialog = false;
    
    itemsMade = 0;
    
    itemBeingEdited = null;
    itemBeingEditedCopy = null;
    isEditedItemNew = false;

    static defaultBodyColor = "#00009B"; // light blue
    // var defaultBodyColor = [0, 0, 155, 0.5]; // light blue, transparent
    static defaultBorderColor = "black";
    // var defaultBorderColor = "green";
    static defaultBorderWidth = 1;
    // var defaultHasNoteBorderColor = "green";
    // var defaultTextStyle = {family: "Arial", size: "10pt", weight: "bold"};
    static defaultTextStyle = {family: "Arial", size: "9pt", weight: "normal"};
    static defaultRadius = 44;

    constructor(model, id, diagramName, autosave) {
        console.log("Creating ClusteringDiagram", model, id, diagramName);
    
        this.autosave = autosave;
        this.diagramName = diagramName;
        this.idOfWidget = id;
        this.modelForStorage = model;
        this.diagram = model[this.diagramName];
        
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
        
        this.setupMainButtons();
    
        this.setupMainSurface();
    }
    
    static controller(args) {
        console.log("Making ClusteringDiagram: ", args);
        return new ClusteringDiagram(args.model, args.id, args.diagramName, args.autosave);
    }
    
    static view(controller, args) {
        console.log("ClusteringDiagram view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        var entryDialog = [];
        if (this.showEntryDialog) {
            entryDialog .push(this.buildEntryDialog());
        }
        
        var textForItemName = "";
        var textForItemUrl = "";
        if (this.lastSelectedItem) {
            // TODO: Translate labels
            textForItemName = "Name: " + (this.lastSelectedItem.text || "");
            textForItemUrl = "Notes: " + (this.lastSelectedItem.url || "");
        }
        
        return m("div", [
            "ClusteringDiagram unfinished conversion to Mithril", 
            m("br"),
            this.mainButtons,
            m("div", {config: this.configSurface.bind(this)}),
            m("div", {style: "text-overflow: ellipsis;"}, textForItemName),
            m("div", {style: "text-overflow: ellipsis;"}, textForItemUrl),
            entryDialog 
        ]);
    }
    
    configSurface(element: HTMLElement, isInitialized: boolean, context: any, vdom: _mithril.MithrilVirtualElement) {
        console.log("configSurface called");
        if (!isInitialized) {
            element.appendChild(this.divForResizing);
        }
    }
    
    incrementChangesCount() {
        // console.log("incrementChangesCount", new Error());
        this.diagram.changesCount++;
        if (this.autosave) {
            // console.log("Saving changes");
            this.saveChanges();
        }
    }
    
    setupMainSurface() {
        var divForResizing = document.createElement("div");
        this.divForResizing = divForResizing;
        var divUUID = "ResizeableCanvasHolder_" + generateRandomUuid(); 
        divForResizing.setAttribute("id", divUUID);
        divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
       
        var width = this.diagram.surfaceWidthInPixels;
        var height = this.diagram.surfaceHeightInPixels;
        
        this.d3DivForResizing = d3.select(divForResizing);
        
        this._mainSurface = this.d3DivForResizing.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'clustering');
        
        // this._mainSurface.append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "purple").on("mousedown", function () {console.log("purple circle clicked");});
    
        this.background = this._mainSurface.append("rect")
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'clusteringDiagramBackground')
            .style('fill', 'white')
            .on("mousedown", () => {
                console.log("mousedown in background");
                this.selectItem(null);
                // console.log("mousedown item", item);
            });
        
        this.mainSurface = this._mainSurface.append('g')
            //.attr('width', width)
            //.attr('height', height)
            .attr('class', 'mainSurface');
        
        // console.log("setup main surface", this);
            
        this.recreateDisplayObjectsForAllItems();
    
        /* TODO: What to do ablout handle?
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
        */
    }
    
    updateSizeOfCanvasFromResizeHandle() {
        var newWidth = this.divForResizing.clientWidth;
        var newHeight = this.divForResizing.clientHeight;
        
        console.log("resize from ResizeHandle drag", newWidth, newHeight);
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
        
        this.diagram.surfaceWidthInPixels = newWidth;
        this.diagram.surfaceHeightInPixels = newHeight;
        
        this.incrementChangesCount();
    }
    
    updateSizeOfCanvasFromModel() {
        var newWidth = this.diagram.surfaceWidthInPixels;
        var newHeight = this.diagram.surfaceHeightInPixels;
        
        console.log("resize from model change", newWidth, newHeight);
        this.divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
    }
    
    newButton(name, label, callback) {
        var button = m("button", {onclick: callback, "class": name}, label);
        this.mainButtons.push(button);
        return button;
    }
    
    setupMainButtons() {
        var mainButtons = [];
        
        // TODO: Translate
        this.newButton("newItemButton", "New item", () => {
            var newItem = this.newItem();
            this.openEntryDialog(newItem, false);
        });
        
        this.newButton("newClusterButton", "New cluster", () => {
            var newItem = this.newItem();
            newItem.type = "cluster";
            this.openEntryDialog(newItem, false);
        });
        
        // TODO: Translate
        this.newButton("editItemButton", "Edit", () => {
            if (this.lastSelectedItem) {
                this.openEntryDialog(this.lastSelectedItem, true);
            } else {
             // TODO: Translate
                alert("Please select an item to update first");
            }
        });
    
        // TODO: Translate
        this.newButton("deleteButton", "Delete", () => {
            if (!this.lastSelectedItem) {
                // TODO: Translate
                alert("Please select an item to delete first");
                return;
            }
            dialogSupport.confirm("Confirm removal of: '" + this.lastSelectedItem.text + "'?", () => {
                this.updateDisplayForChangedItem(this.lastSelectedItem, "delete");
                removeItemFromArray(this.lastSelectedItem, this.diagram.items);
                this.clearSelection();
                this.incrementChangesCount();
            });
        });
        
        if (!this.autosave) {
            // TODO: Translate
            this.newButton("saveChangesButton", "Save Changes", () => {
                console.log("About to save");
                this.saveChanges();
            });
        }
        
        // TODO: Translate
        this.newButton("sourceButton", "Diagram Source", () => {
            this.openSourceDialog(JSON.stringify(this.diagram, null, 2));
        });
    }
    
    // typeOfChange should be either "delete" or "update"
    updateDisplayForChangedItem(item, typeOfChange) {
        if (item === null) {
            console.log("updateDisplayForChangedItem item is null", typeOfChange);
            return;
        }
        var displayObject = this.itemToDisplayObjectMap[item.uuid];
        if (typeOfChange === "delete") {
            delete this.itemToDisplayObjectMap[item.uuid];
            displayObject.remove();
            return;
        }
        displayObject.remove();
        var newDisplayObject = this.addDisplayObjectForItem(this.mainSurface, item);
        this.itemToDisplayObjectMap[item.uuid] = newDisplayObject;
    }
    
    clickedEntryOK(dialogHolder, model, event) {
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
            console.log("not existing item", dialogHolder);
            this.diagram.items.push(item);
            var displayObject = this.addDisplayObjectForItem(this.mainSurface, item);
        } else {
            this.updateDisplayForChangedItem(item, "update");
        }
        console.log("items", this.diagram.items);
        this.incrementChangesCount();
        this.selectItem(item);
    }
    
    openEntryDialog(item, isExistingItem) {
        console.log("openEntryDialog", item, isExistingItem);
        this.itemBeingEdited = item;
        this.itemBeingEditedCopy = JSON.parse(JSON.stringify(item));
        this.isEditedItemNew = !isExistingItem;
        
        // alert("This should open a dialog");
        
        this.showEntryDialog = true;
    }
    
    buildEntryDialog() {
        /*
        return m("div", [
            "Entry dialog 2",
            m("br"),
            m("button", {onclick: () => { this.showEntryDialog = false; }}, "Close")
        ]);
        */

       return m("div.overlay", m("div.modal-content", [
            "Edit item",
            m("br"),
            m('label', {"for": "itemDialog_name"}, "Name:"),
            m('input[type=text]', {
                id: "itemDialog_name",
                value: this.itemBeingEditedCopy.text,
                onchange: (event) => { this.itemBeingEditedCopy.text = event.target.value; }
            }),
            m("br"),
            m("button", {
                onclick: () => {
                    this.showEntryDialog = false;
                    console.log("copy", this.itemBeingEditedCopy);
                }
            }, "Cancel"),
            m("button", {
                onclick: () => {
                    this.showEntryDialog = false;
                    console.log("copy", this.itemBeingEditedCopy);
                    this.itemBeingEdited.text = this.itemBeingEditedCopy.text;
                    if (this.isEditedItemNew) {
                        console.log("not existing item");
                        this.diagram.items.push(this.itemBeingEdited);
                        this.addDisplayObjectForItem(this.mainSurface, this.itemBeingEdited);
                    } else {
                        this.updateDisplayForChangedItem(this.itemBeingEdited, "update");
                    }
                    console.log("items", this.diagram.items);
                    this.incrementChangesCount();
                    this.selectItem(this.itemBeingEdited);
                }
            }, "OK")
        ]));
        
        /*
    
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
        var dialogHolder = {
            dialog: undefined,
            item: undefined,
            isExistingItem: undefined
        };
        
        // TODO: Translate
        var type = "item";
        if (item.type) type = item.type;
        var buttonLabel = "Create " + type;
        if (isExistingItem) buttonLabel = "Update " + type;
        
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
            onClick: function () { dialogHolder.dialog.hide(); }
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
        var title = "New " + type;
        if (isExistingItem) title = "Change " + type;
    
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
        
        dialog.show();
        */
    }
    
    updateSourceClicked(sourceText, hideDialogMethod) {     
        console.log("updateSourceClicked", sourceText);
    
        var newDiagram;
        try {
            newDiagram = JSON.parse(sourceText);
        } catch (e) {
            alert("Problem parsing source\n" + e);
            return;
        }
        hideDialogMethod();
    
        console.log("parsed diagram", newDiagram);
        this.updateDiagram(newDiagram);
        this.incrementChangesCount();
    }
    
    updateDiagram(newDiagram) {
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
        if (!this.diagram.changesCount) this.diagram.changesCount = 0;
        
        this.recreateDisplayObjectsForAllItems();
        // console.log("updateDiagram: Updated OK");
        
        this.clearSelection();
        this.updateSizeOfCanvasFromModel();
    }
    
    clearSelection() {
        this.selectItem(null);
    }
    
    openSourceDialog(text) {
        dialogSupport.openTextEditorDialog(text, "#clusterDiagramSource_titleID|Clustering Diagram", "#clusterDiagramSource_okButtonID|OK", this.updateSourceClicked.bind(this));
    }
    
    recreateDisplayObjectsForAllItems() {
        // console.log("recreateDisplayObjectsForAllItems");
        this.itemToDisplayObjectMap = <any>{};
        this.mainSurface.selectAll("*").remove();
        // console.log("before forEach this:", this);
        var thisObject = this;
        forEach(this.diagram.items, function (index, item) {
            // console.log("looping over: ", item, "this:", this);
            var displayObject = thisObject.addDisplayObjectForItem(thisObject.mainSurface, item);
        });
        // console.log("done recreateDisplayObjectsForAllItems");
    }
    
    saveChanges() {
        this.modelForStorage.set(this.diagramName, this.diagram);
    }
    
    newItem(text = null, url = "") {
        if (text === null) text = "Untitled#" + (++this.itemsMade);
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
    }
    
    // TODO: Clean up duplication here and elsewhere with calculating border color and width
    selectItem(item) {
        // console.log("selectItem", item);
        if (item === this.lastSelectedItem) {
            // console.log("lastSelectedItem and new selected item are the same; not updating");
            return;
        }
        if (this.lastSelectedItem) {
            // console.log("lastSelected", this.lastSelectedItem);
            var lastSelectedDisplayObject = this.itemToDisplayObjectMap[this.lastSelectedItem.uuid];
            if (lastSelectedDisplayObject) {
                lastSelectedDisplayObject.circle
                    // .style("stroke", lastSelectedDisplayObject.borderColor)
                    .style("stroke-width", lastSelectedDisplayObject.borderWidth);
            }
        }
        if (item) {
            var displayObject = this.itemToDisplayObjectMap[item.uuid];
            displayObject.circle
                // .style("stroke", lastSelectedDisplayObject.borderColor)
                .style("stroke-width", displayObject.borderWidth * 2);
        }
        this.lastSelectedItem = item;
        
        // Queue redrawing as this was selected via D3 not Mithril
        m.redraw();
    }
    
    addDisplayObjectForItem(surface, item) {
        console.log("addDisplayObjectForItem item", item);
        
        var bodyColor = item.bodyColor;
        if (!bodyColor) bodyColor = ClusteringDiagram.defaultBodyColor;
        
        var borderColor = item.borderColor;
        if (!borderColor) borderColor = ClusteringDiagram.defaultBorderColor;
        
        var borderWidth = item.borderWidth;
        if (!borderWidth) borderWidth = ClusteringDiagram.defaultBorderWidth;
        // if (item.type === "cluster") borderWidth = borderWidth * 2;
        
        var radius = item.radius;
        if (!radius) radius = ClusteringDiagram.defaultRadius;
        
        var textStyle = item.textStyle;
        if (!textStyle) textStyle = ClusteringDiagram.defaultTextStyle;
    
        var group;
        if (item.type === "cluster") {
            group = surface.insert('g', ':first-child')
                .attr('transform', 'translate(' + item.x + ',' + item.y + ')')
                .attr('class', 'item');
        } else {
            group = surface.append('g')
                .attr('transform', 'translate(' + item.x + ',' + item.y + ')')
                .attr('class', 'item');
        }
    
        // TODO: Does this work with SVG elements? Are they really D3 selections? Or maybe could also map data to element with D3?
        group.item = item;
    
        // console.log("group etc.", group, item, bodyColor, borderColor, borderWidth, radius, textStyle);
    
        if (item.type === "cluster") {
            // TODO: Maybe no longer set a different color based on url if you can set border color yourself?? 
            // if (item.url) item.borderColor = defaultHasNoteBorderColor;
        
            var clusterRectangleOuter = group.append("circle")
                .attr("r", radius * 3)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", d3.rgb(bodyColor).brighter())
                // Make translucent
                .style("opacity", 0.25)
                .style("stroke", d3.rgb(borderColor))
                .style("stroke-width", borderWidth * 2);
            
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
            
        } else {
            // TODO: Maybe no longer set a different color based on url if you can set border color yourself?? 
            // if (item.url) item.borderColor = defaultHasNoteBorderColor;
        
            var itemCircle = group.append("circle")
                .attr("r", radius)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", d3.rgb(bodyColor))
                // Make translucent
                .style("opacity", 0.5)
                .style("stroke", d3.rgb(borderColor))
                .style("stroke-width", borderWidth);
            
            group.circle = itemCircle;
        }
        
        group.borderColor = borderColor;
        group.borderWidth = borderWidth;
        
        this.addText(group, item.text, radius * 1.5, textStyle);
    
        // console.log("group", group);
        // console.log("itemCircle", itemCircle);
    
        group.on("mousedown", () => {
            // console.log("mousedown item", item);
            this.selectItem(item);
        });
        
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
            // TODO: Casting to any as workaround to silence TypeScritp error for maybe incomplete d3 typing file
            item.x += (<any>d3.event).dx;
            item.y += (<any>d3.event).dy;
            group.attr('transform', 'translate(' + item.x + ',' + item.y + ')');
            moved = true;
        });
        
        drag.on("dragend", function() {
            if (moved) self.incrementChangesCount();
        });
        
        group.call(drag);
    
        /*
        group.on("dblclick", (e) => {
            // alert("triggered ondblclick");
            this.go(group.item.url);
        });
        */
    
        this.itemToDisplayObjectMap[item.uuid] = group;
        return group;
    }
    
    addText(group, itemText, maxWidth, textStyle) {
        var text = group.append("text")
            // .text(itemText)
            .style("font-family", textStyle.family)
            .style("font-size", textStyle.size)
            .style("font-weight", textStyle.weight)
            .style("text-anchor", "middle");
        
        myWrap(text, itemText, textStyle, maxWidth);
        // wrap(text, maxWidth, textStyle);
    }
}



export = ClusteringDiagram;
