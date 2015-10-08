/*jslint browser: true */
import d3 = require("d3");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import dialogSupport = require("../panelBuilder/dialogSupport");
import m = require("mithril");

"use strict";

// TODO: Maybe add tooltip with notes for item? And then don't display item info at bottom?
// TODO: Select and move groups of items

// TODO: Make a systemic communications fix to PointrelClient so can stop using Math.round to ensure x and y are integers to avoid JSON conversion errors and sha256 error in WordPress plugin due to PHP and numeric precision (2015-10-08)

var defaultSurfaceWidthInPixels = 800;
var defaultSurfaceHeightInPixels = 500;

// Caution: "this" may be undefined for functions called by this unless "bind" or "hitch" is used
function forEach(theArray, theFunction) {
    if (!theArray) {
        console.log("theArray is invalid", theArray);
    }
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
    model: ClusteringDiagramModel = null;
    
    mainButtons = [];
    
    storageFunction: Function;
    autosave: boolean = false;
    lastSelectedItem: ClusteringDiagramItem  = null;
    divForResizing: HTMLElement = null;
    _mainSurface: d3.Selection<any> = null;
    mainSurface: d3.Selection<any> = null;
    itemToDisplayObjectMap: {key: string; element: d3.Selection<any>} = <any>{};
    
    d3DivForResizing: d3.Selection<any> = null;
    background = null;
    
    showEntryDialog = false;
    
    itemBeingEdited: ClusteringDiagramItem = null;
    itemBeingEditedCopy: ClusteringDiagramItem = null;
    isEditedItemNew = false;

    static defaultBodyColor = "#abb6ce"; // light blue
    // var defaultBodyColor = [0, 0, 155, 0.5]; // light blue, transparent
    static defaultBorderColor = "#2e4a85";
    // var defaultBorderColor = "green";
    static defaultBorderWidth = 1;
    // var defaultHasNoteBorderColor = "green";
    // var defaultTextStyle = {family: "Arial", size: "10pt", weight: "bold"};
    static defaultTextStyle = {family: "Arial", size: "9pt", weight: "normal"};
    static defaultRadius = 44;
    
    // This is static so other code can create and store diagram contents directly as source
    static newDiagramModel(): ClusteringDiagramModel {
        return {
            surfaceWidthInPixels: defaultSurfaceWidthInPixels,
            surfaceHeightInPixels: defaultSurfaceHeightInPixels,
            items: [],
            changesCount: 0
        };
    }
    
    static newItem(itemType = "item", name = "", notes = "", x = ClusteringDiagram.initialDisplacement, y = ClusteringDiagram.initialDisplacement): ClusteringDiagramItem {
        // if (name === null) name = "Untitled " + itemType + " #" + (++this.itemsMade);
        var item: ClusteringDiagramItem = {
            uuid: generateRandomUuid("ClusteringDiagramItem"),
            "type": itemType,
            name: name,
            notes: notes,
            x: Math.round(x),
            y: Math.round(y)
        };
        // item.bodyColor = defaultBodyColor;
        // item.borderWidth = defaultBorderWidth;
        // item.borderColor = defaultBorderColor;
        // item.radius = defaultRadius;
        // item.textStyle = defaultTextStyle;
        return item;
    }
    
    static bumpedItemCount = 0;
    static bumpXShiftPerItem = 50;
    static bumpYShiftPerItem = 50;
    static initialDisplacement = 100;
    static bumpXRange = 400;
    static bumpYRange = 400;
    
    static bumpXYOfItem(item: ClusteringDiagramItem) {
        ClusteringDiagram.bumpedItemCount++;
        item.x = Math.round(item.x + (ClusteringDiagram.bumpedItemCount * ClusteringDiagram.bumpXShiftPerItem) % ClusteringDiagram.bumpXRange);
        item.y = Math.round(item.y + (ClusteringDiagram.bumpedItemCount / 10 * ClusteringDiagram.bumpYShiftPerItem) % ClusteringDiagram.bumpYRange);
    }
    
    static addNewItemToDiagram(diagram: ClusteringDiagramModel, itemType: string, name: string, notes: string = "") {
        var item = ClusteringDiagram.newItem(itemType, name, notes);
        ClusteringDiagram.bumpXYOfItem(item);
        diagram.items.push(item);
        diagram.changesCount++;
        return item;
    }
    
    constructor(storageFunction: Function, autosave) {
        // console.log("Creating ClusteringDiagram");
    
        this.storageFunction = storageFunction; 
        this.autosave = autosave;
        this.model = storageFunction();
        
        if (!this.model) {
            this.model = ClusteringDiagram.newDiagramModel();
        }
        
        // console.log("diagram", JSON.stringify(this.diagram, null, 2));
        
        this.setupMainButtons();
    
        this.setupMainSurface();
    }
    
    static controller(args) {
        // console.log("Making ClusteringDiagram: ", args);
        return new ClusteringDiagram(args.storageFunction, args.autosave);
    }
    
    static view(controller, args) {
        // console.log("ClusteringDiagram view called");
        
        return controller.calculateView(args);
    }
    
    calculateView(args) {
        // Make sure the mdoel is up-to-date
        // this seems wasteful but there is no toehr way to be sure jave the letstest ada
        this.updateDiagram(this.storageFunction());
        
        var entryDialog = [];
        if (this.showEntryDialog) {
            entryDialog.push(this.buildEntryDialog());
        }
        
        var textForItemName = "";
        var textForItemNotes = "";
        if (this.lastSelectedItem) {
            // TODO: Translate labels
            textForItemName = "Name: " + (this.lastSelectedItem.name || "");
            textForItemNotes = "Notes: " + (this.lastSelectedItem.notes || "");
        }
        
        return m("div", [
            this.mainButtons,
            m("div", {config: this.configSurface.bind(this)}),
            // m("div", {style: "text-overflow: ellipsis;"}, textForItemName),
            // m("div", {style: "text-overflow: ellipsis;"}, textForItemUrl),
            entryDialog 
        ]);
    }
    
    configSurface(element: HTMLElement, isInitialized: boolean, context: any) {
        // console.log("configSurface called");
        if (!isInitialized) {
            element.appendChild(this.divForResizing);
        }
    }
    
    incrementChangesCount() {
        // console.log("incrementChangesCount", new Error());
        this.model.changesCount++;
        if (this.autosave) {
            // console.log("Saving changes");
            this.saveChanges();
        }
    }
    
    setupMainSurface() {
        var divForResizing = document.createElement("div");
        this.divForResizing = divForResizing;
        var divUUID = generateRandomUuid("ResizeableCanvasHolder"); 
        divForResizing.setAttribute("id", divUUID);
        //divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        //divForResizing.setAttribute("style", "resize: auto; border: solid 1px");
       
        var width = this.model.surfaceWidthInPixels;
        var height = this.model.surfaceHeightInPixels;
        
        this.d3DivForResizing = d3.select(divForResizing);
        
        this._mainSurface = this.d3DivForResizing.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'clustering');
        
        // this._mainSurface.append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "purple").on("mousedown", function () {console.log("purple circle clicked");});
    
        this.background = this._mainSurface.append("rect")
            .attr('width', "100%")
            .attr('height', "100%")
            .attr('class', 'clusteringDiagramBackground')
            .style('fill', 'white')
            .style('stroke-width', '3')
            .style('stroke', '#a7a5a5')
            .on("mousedown", () => {
                // console.log("mousedown in background");
                this.selectItem(null);
                // console.log("mousedown item", item);
            });
        
        this.mainSurface = this._mainSurface.append('g')
            //.attr('width', width)
            //.attr('height', height)
            .attr('class', 'mainSurface');
        
        // console.log("setup main surface", this);
            
        this.recreateDisplayObjectsForAllItems();
    
        /* TODO: What to do about handle?
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
        
        // console.log("resize from ResizeHandle drag", newWidth, newHeight);
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
        
        this.model.surfaceWidthInPixels = newWidth;
        this.model.surfaceHeightInPixels = newHeight;
        
        this.incrementChangesCount();
    }
    
    updateSizeOfCanvasFromModel() {
        var newWidth = this.model.surfaceWidthInPixels;
        var newHeight = this.model.surfaceHeightInPixels;
        
        // console.log("resize from model change", newWidth, newHeight);
        this.divForResizing.setAttribute("style", "width: " + this.model.surfaceWidthInPixels + "px; height: " + this.model.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
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
            var aNewItem = this.newItem("item");
            this.openEntryDialog(aNewItem, false);
        });
        
        this.newButton("newClusterButton", "New cluster", () => {
            var aNewItem = this.newItem("cluster");
            this.openEntryDialog(aNewItem, false);
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
                alert("Please select an item to delete first.");
                return;
            }
            dialogSupport.confirm("Are you sure you want to delete the item or cluster called '" + this.lastSelectedItem.name + "'?", () => {
                this.updateDisplayForChangedItem(this.lastSelectedItem, "delete");
                removeItemFromArray(this.lastSelectedItem, this.model.items);
                this.clearSelection();
                this.incrementChangesCount();
            });
        });
        
        // TODO: Translate
        this.newButton("canvasSizeButton", "Diagram size", () => {
            this.openCanvasSizeDialog();
        });
        
        if (!this.autosave) {
            // TODO: Translate
            this.newButton("saveChangesButton", "Save Changes", () => {
                // console.log("About to save");
                this.saveChanges();
            });
        }
        
        // TODO: Translate
        this.newButton("sourceButton", "Diagram Source", () => {
            this.openSourceDialog(JSON.stringify(this.model, null, 2));
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
    
     openCanvasSizeDialog() {
        // console.log("openCanvasSizeDialog");  
        // alert("This should open a dialog");
        
        // TODO: Make a single dialog
        // TODO: Translate
        var newWidthString = prompt("How wide (in pixels) would you like this clustering diagram to be?", "" + this.model.surfaceWidthInPixels);
        if (!newWidthString) return;
        var newWidth = parseInt(newWidthString.trim(), 10);
        if (!newWidth) return;
         
        var newHeightString = prompt("How high (in pixels) would you like this clustering diagram to be?", "" + this.model.surfaceHeightInPixels);
        if (!newHeightString) return;
        var newHeight = parseInt(newHeightString.trim(), 10);
        if (!newHeight) return;
         
        if (newWidth !== this.model.surfaceWidthInPixels || newHeight !== this.model.surfaceHeightInPixels) {
            this.model.surfaceWidthInPixels = newWidth;
            this.model.surfaceHeightInPixels = newHeight;
            this._mainSurface
                .attr('width', newWidth)
                .attr('height', newHeight);
            this.incrementChangesCount();
        }
    }
    
    openEntryDialog(item, isExistingItem) {
        // console.log("openEntryDialog", item, isExistingItem);
        this.itemBeingEdited = item;
        this.itemBeingEditedCopy = JSON.parse(JSON.stringify(item));
        this.isEditedItemNew = !isExistingItem;
        
        // alert("This should open a dialog");
        
        this.showEntryDialog = true;
    }
    
    acceptChangesForItemBeingEdited() {
        this.showEntryDialog = false;
        
        // console.log("ok", this.itemBeingEditedCopy);
        this.itemBeingEdited.name = this.itemBeingEditedCopy.name;
        
        // Ensure the item has a name
        // TODO: This allows duplicate names if items have been deleted
        if (!this.itemBeingEdited.name) {
            this.itemBeingEdited.name = "Untitled " + this.itemBeingEdited.type + " #" + (this.model.items.length + 1);
        }
        
        this.itemBeingEdited.notes = this.itemBeingEditedCopy.notes;
        
        if (this.isEditedItemNew) {
            // console.log("not existing item");
            this.model.items.push(this.itemBeingEdited);
            this.addDisplayObjectForItem(this.mainSurface, this.itemBeingEdited);
        } else {
            this.updateDisplayForChangedItem(this.itemBeingEdited, "update");
        }
        
        // console.log("items", this.diagram.items);
        this.incrementChangesCount();
        this.selectItem(this.itemBeingEdited);
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
            "Edit " + this.itemBeingEditedCopy.type,
            m("br"),
            m("br"),
            m('label', {"for": "itemDialog_name"}, "Name:"),
            m('input[type=text]', {
                id: "itemDialog_name",
                value: this.itemBeingEditedCopy.name || "",
                onchange: (event) => { this.itemBeingEditedCopy.name = event.target.value; }
            }),
            m('br'),
            m('br'),
            m('label', {"for": "itemDialog_notes"}, "Notes:"),
            m('textarea[class=narrafirma-textbox]', {
                id: "itemDialog_notes",
                value: this.itemBeingEditedCopy.notes || "",
                onchange: (event) => { this.itemBeingEditedCopy.notes = event.target.value; }
            }),
            m("br"),
            m("button", {
                onclick: () => {
                    this.showEntryDialog = false;
                    // console.log("cancel", this.itemBeingEditedCopy);
                }
            }, "Cancel"),
            m("button", {
                onclick: () => {
                    this.acceptChangesForItemBeingEdited();
                }
            }, "OK")
        ]));
    }
    
    updateSourceClicked(text, hideDialogMethod) {     
        // console.log("updateSourceClicked", text);
    
        var newDiagram;
        try {
            newDiagram = JSON.parse(text);
        } catch (e) {
            alert("Problem parsing source\n" + e);
            return;
        }
        hideDialogMethod();
    
        // console.log("parsed diagram", newDiagram);
        this.updateDiagram(newDiagram);
        this.incrementChangesCount();
    }
    
    updateDiagram(newDiagram) {
        // console.log("updateDiagram", this.diagram, newDiagram);
        
        if (!newDiagram) return;
        
        if (this.model.changesCount === newDiagram.changesCount) {
            // console.log("Changes count match at", newDiagram.changesCount);
            // Optimize out reflections of our changes back to us if the diagrams are the same
            // Extra cautious to compare JSON; otherwise probably could just return
            if (JSON.stringify(this.model) === JSON.stringify(newDiagram)) {
                // console.log("updateDiagram: new diagram seems identical to the old; not updating");
                return;
            }
        } // else {
            // console.log("updateDiagram: changes counts do not match", this.diagram.changesCount, newDiagram.changesCount);
        // }
        
        this.model = newDiagram;
        
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
        forEach(this.model.items, function (index, item) {
            // console.log("looping over: ", item, "this:", this);
            var displayObject = thisObject.addDisplayObjectForItem(thisObject.mainSurface, item);
        });
        // console.log("done recreateDisplayObjectsForAllItems");
    }
    
    saveChanges() {
        this.storageFunction(this.model);
    }
    
    newItem(itemType = "item", name = "", notes = "") {
        var newItem = ClusteringDiagram.newItem(itemType, name, notes);
        ClusteringDiagram.bumpXYOfItem(newItem);
        return newItem;
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
                .style("stroke-width", displayObject.borderWidth * 5);
        }
        this.lastSelectedItem = item;
        
        // Queue redrawing as this was selected via D3 not Mithril
        m.redraw();
    }
    
    addDisplayObjectForItem(surface, item: ClusteringDiagramItem) {
        // console.log("addDisplayObjectForItem item", item);
        
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
            var clusterRectangleOuter = group.append("circle")
                .attr("r", radius * 3)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", bodyColor) // d3.rgb(bodyColor).brighter())
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
        
        var hoverText = item.name;
        if (item.notes) hoverText += "\n----------\n" + item.notes;
        group.append("title")
            .text(hoverText);
        
        group.borderColor = borderColor;
        group.borderWidth = borderWidth;
        
        this.addText(group, item.name, radius * 1.5, textStyle);
    
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
            item.x = Math.round(item.x + (<any>d3.event).dx);
            item.y = Math.round(item.y + (<any>d3.event).dy);
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
        if (itemText === undefined) itemText = "[missing text]";
        var text = group.append("text")
            // .text(itemText)
            .style("font-family", textStyle.family)
            .style("font-size", textStyle.size)
            .style("font-weight", textStyle.weight)
            .style("text-anchor", "middle");
        
        myWrap(text, itemText, textStyle, maxWidth);
        // wrap(text, maxWidth, textStyle);
    }
    
    static calculateClusteringForDiagram(clusteringDiagram: any) {
        var result = [];
        
        if (!clusteringDiagram) return result;
        
        var clusters = clusteringDiagram.items.filter(function (item) {
            return item.type === "cluster";
        });
        
        // console.log("clusters", clusters);
        
        var items = clusteringDiagram.items.filter(function (item) {
            return item.type === "item";
        });
        
        // console.log("items", items);
        
        items.forEach((item) => {
            item.clusterDistance = Number.MAX_VALUE;
            item.cluster = null;
            clusters.forEach((cluster) => {
                var dx = item.x - cluster.x;
                var dy = item.y - cluster.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < item.clusterDistance) {
                    item.clusterDistance = distance;
                    item.cluster = cluster;
                }
            });
        });
        
        clusters.forEach((cluster) => {
            cluster.items = [];
            items.forEach((item) => {
                if (item.cluster === cluster) cluster.items.push(item);
            });
        });
        
        clusteringDiagram.clusters = clusters;
    }
}

export = ClusteringDiagram;
