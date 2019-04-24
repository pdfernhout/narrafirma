/*jslint browser: true */
import d3 = require("d3");
import generateRandomUuid = require("../pointrel20150417/generateRandomUuid");
import dialogSupport = require("../panelBuilder/dialogSupport");
import m = require("mithril");
import Globals = require("../Globals");


"use strict";

// TODO: Make a systemic communications fix to PointrelClient so can stop using Math.round to ensure x and y are integers to avoid JSON conversion errors and sha256 error in WordPress plugin due to PHP and numeric precision (2015-10-08)

const defaultSurfaceWidthInPixels = 800;
const defaultSurfaceHeightInPixels = 500;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// support functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    return result;
}

function myWrap(text, itemText, textStyle, textColor, maxWidth) {
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
            line += " " + word;
        } else {
            lines.push(line);
            line = word;
        }
    });
    if (line !== "") lines.push(line);
    var lineNumber = (Math.round(-lines.length / 2 + 0.5));
    forEach(lines, function (index, line) {
        var tspan = text.append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", (lineNumber++) * lineHeight_em  + "em")
            .text(line)
            .style("fill", textColor);
    }); 
}

// Caution: "this" may be undefined for functions called by this unless "bind" or "hitch" is used
function forEach(theArray, theFunction) {
    if (!theArray) {
        console.log("theArray is invalid", theArray);
    }
    for (var index = 0, length = theArray.length; index < length; ++index) {
        theFunction(index, theArray[index], theArray);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// clustering diagram
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ClusteringDiagram {
    model: ClusteringDiagramModel = null;
    
    mainButtons = [];
    
    configuration: string;
    storageFunction: Function;
    autosave: boolean = false;
    lastSelectedItem: ClusteringDiagramItem  = null;
    divForResizing: HTMLElement = null;
    _mainSurface: d3.Selection<any> = null;
    mainSurface: d3.Selection<any> = null;
    itemToDisplayObjectMap: {key: string; element: d3.Selection<any>} = <any>{};
    
    d3DivForResizing: d3.Selection<any> = null;
    background = null;

    selectionRect = null;
    selectedItems = [];
    rubberBanding = false;
    shiftKeyIsBeingHeldDownWhileRubberBanding = false;
    rubberBandingStartX = 0;
    rubberBandingStartY = 0;
    
    showEntryDialog = false;
    itemBeingEdited: ClusteringDiagramItem = null;
    itemBeingEditedCopy: ClusteringDiagramItem = null;
    isEditedItemNew = false;

    showSurfaceSizeDialog = false;
    surfaceWidthBeingEdited = 0;
    surfaceHeightBeingEdited = 0;

    static defaultItemBodyColor = "#abb6ce"; 
    static defaultClusterBodyColor = "#84c8ff";
    static defaultBorderColor = "black";
    static defaultBorderWidth = 1;
    static defaultTextStyle = {family: "Arial", size: "9pt", weight: "normal"};
    static defaultTextColor = "black";
    static defaultRadius = 44;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // static functions - These functions are static so other code can create and store diagram contents directly as source
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static newDiagramModel(): ClusteringDiagramModel {
        return {
            surfaceWidthInPixels: defaultSurfaceWidthInPixels,
            surfaceHeightInPixels: defaultSurfaceHeightInPixels,
            items: [],
            changesCount: 0
        };
    }
    
    static newItem(itemType = "item", name = "", notes = "", x = ClusteringDiagram.initialDisplacement, y = ClusteringDiagram.initialDisplacement): ClusteringDiagramItem {
        var item: ClusteringDiagramItem = {
            uuid: generateRandomUuid("ClusteringDiagramItem"),
            "type": itemType,
            name: name,
            notes: notes,
            x: Math.round(x),
            y: Math.round(y)
        };
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

    static controller(args) {
        return new ClusteringDiagram(args.configuration, args.storageFunction, args.autosave);
    }
    
    static view(controller, args) {
        return controller.calculateView(args);
    }
    
    static calculateClusteringForDiagram(clusteringDiagram: any) {
        var result = [];
        
        if (!clusteringDiagram) return result;
        
        var clusters = clusteringDiagram.items.filter(function (item) {
            return item.type === "cluster";
        });
        
        var items = clusteringDiagram.items.filter(function (item) {
            return item.type === "item";
        });
        
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
        
        return [clusters, items];
    }    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    constructor(configuration: string, storageFunction: Function, autosave) {
        this.configuration = configuration;
        this.storageFunction = storageFunction; 
        this.autosave = autosave;
        this.model = storageFunction();
        if (!this.model) {
            this.model = ClusteringDiagram.newDiagramModel();
        }
        this.setupMainButtons();
        this.setupMainSurface();
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // starting up
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    configSurface(element: HTMLElement, isInitialized: boolean, context: any) {
        if (!isInitialized) {
            element.appendChild(this.divForResizing);
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
        
        this.background = this._mainSurface.append("rect")
            .attr('width', "100%")
            .attr('height', "100%")
            .attr('class', 'clusteringDiagramBackground')
            .style('fill', 'white')
            .style('stroke-width', '3')
            .style('stroke', '#a7a5a5')
            .on("mousedown", () => {
                this.selectItem(null);
            });

        var drag = d3.behavior.drag();
        var self = this;
        
        drag.on("dragstart", function () {
            let position = d3.mouse(this);
            self.rubberBanding = true;
            self.rubberBandingStartX = position[0];
            self.rubberBandingStartY = position[1];
            d3.select(".selectionRectangle")
                .attr('rx', 6) // this makes a rounded rectangle
                .attr('ry', 6)
                .transition()
                .duration(1)
                .style('stroke', "black")
                .style('fill', 'none')
                .style('stroke-width', 2);
        });

        drag.on("drag", function() {
            if (self.rubberBanding) {
                let position = d3.mouse(this);
                d3.select(".selectionRectangle")
                    .transition()
                    .duration(1)
                    .attr('rx', 6)
                    .attr('ry', 6)
                    .attr('transform', 'translate (' + Math.min(self.rubberBandingStartX, position[0]) + ", " + Math.min(self.rubberBandingStartY, position[1]) + ")")
                    .attr('width', Math.abs(position[0] - self.rubberBandingStartX))
                    .attr('height', Math.abs(position[1] - self.rubberBandingStartY))
                    .style('stroke', "black")
                    .style('fill', 'none')
                    .style('stroke-width', 2);
            }
        });
        
        drag.on("dragend", function() {
            let position = d3.mouse(this);
            self.selectItemsInRectangle(self.rubberBandingStartX, self.rubberBandingStartY, position[0], position[1], self.shiftKeyIsBeingHeldDownWhileRubberBanding);
            self.rubberBanding = false;
            self.shiftKeyIsBeingHeldDownWhileRubberBanding = false;
            d3.select(".selectionRectangle")
                .style('stroke', "none")
                .attr('transform', 'translate (0, 0)')
                .attr('width', 0)
                .attr('height', 0);
        });
        
        this.background.call(drag);
        this.background.on("mousedown", () => {
            this.shiftKeyIsBeingHeldDownWhileRubberBanding = d3.event.shiftKey;
        });
        
        this.mainSurface = this._mainSurface.append('g')
            .attr('class', 'mainSurface');
        
        this.selectionRect = this.mainSurface.append('rect')
            .attr('class', 'selectionRectangle');

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

    setupMainButtons() {
        var mainButtons = [];
        
        if (this.configuration !== "interpretations" && this.configuration !== "observations") {
            this.newButton("newItemButton", "New item", () => {
                var aNewItem = this.newItem("item");
                this.openEntryDialog(aNewItem, false);
            });
        }
        
        this.newButton("newClusterButton", "New cluster", () => {
            var aNewItem = this.newItem("cluster");
            this.openEntryDialog(aNewItem, false);
        });
        
        if (this.configuration !== "interpretations" && this.configuration !== "observations") {
            this.newButton("editItemButton", "Edit", () => {
                if (this.lastSelectedItem) {
                    this.openEntryDialog(this.lastSelectedItem, true);
                } else {
                // TODO: Translate
                    alert("Please select an item to edit.");
                }
            });
        } else { // in clustering interpretations/observations, can only edit clusters, not items
            this.newButton("editItemButton", "Edit cluster", () => {
                if (this.lastSelectedItem && this.lastSelectedItem.type === "cluster") {
                    this.openEntryDialog(this.lastSelectedItem, true);
                } else {
                // TODO: Translate
                    alert("Please select a cluster to edit.");
                }
            });
        }
    
        // allow user to delete items even if they are interpretations/observations
        this.newButton("deleteButton", "Delete item or cluster", () => {
            if (!this.lastSelectedItem) {
                // TODO: Translate
                alert("Please select an item or cluster to delete.");
                return;
            }
            const itemOrCluster = this.lastSelectedItem.type === "cluster" ? "cluster" : "item";
            dialogSupport.confirm("Are you sure you want to delete the " + itemOrCluster + " called '" + this.lastSelectedItem.name + "'?", () => {
                this.updateDisplayForChangedItem(this.lastSelectedItem, "delete");
                const itemIndex = this.model.items.indexOf(this.lastSelectedItem);
                if (itemIndex >= 0) {
                    this.model.items.splice(itemIndex, 1);
                }
                this.clearSelection();
                this.incrementChangesCount();
            });
        });
        
        this.newButton("surfaceSizeButton", "Change surface size", () => {
            this.openSurfaceSizeDialog();
        });
        
        if (!this.autosave) {
            this.newButton("saveChangesButton", "Save Changes", () => {
                this.saveChanges();
            });
        }
        
        if (this.configuration !== "interpretations" && this.configuration !== "observations") {
            // cannot allow users to do this if interpretations or observations, because they could cause the
            // items to become unmoored from the interpretations or observations they represent
            this.newButton("sourceButton", "Diagram Source", () => {
                this.openSourceDialog(JSON.stringify(this.model, null, 2));
            });
        }
    }

    newButton(name, label, callback) {
        var button = m("button", {onclick: callback, "class": name}, label);
        this.mainButtons.push(button);
        return button;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // data handling
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    newItem(itemType = "item", name = "", notes = "") {
        var newItem = ClusteringDiagram.newItem(itemType, name, notes);
        ClusteringDiagram.bumpXYOfItem(newItem);
        return newItem;
    }

    saveChanges() {
        this.storageFunction(this.model);
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // drawing
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    calculateView(args) {
        // Make sure the model is up to date
        // this seems wasteful but there is no other way to be sure you have the latest data
        this.updateDiagram(this.storageFunction());

        var entryDialog = [];
        if (this.showEntryDialog) {
            entryDialog.push(this.buildEntryDialog());
        }
        let surfaceSizeDialog = [];
        if (this.showSurfaceSizeDialog) {
            surfaceSizeDialog.push(this.buildSurfaceSizeDialog());
        }
        
        this.model.items.forEach(function(item) {
            var displayObject = this.itemToDisplayObjectMap[item.uuid];
            if (displayObject) {
                const borderWidth =  (this.selectedItems.indexOf(item) >= 0) ? displayObject.borderWidth * 5 : displayObject.borderWidth;
                displayObject.circle.style("stroke-width", borderWidth);
            }
        }, this);
        
        return m("div", [
            m("div", {config: this.configSurface.bind(this)}),
            this.mainButtons,
            entryDialog,
            surfaceSizeDialog
        ]);
    }
    
    addDisplayObjectForItem(surface, item: ClusteringDiagramItem) {
        var bodyColor = item.bodyColor;
        if (!bodyColor) {
            if (item.type === "cluster") {
                bodyColor = ClusteringDiagram.defaultClusterBodyColor;
            } else {
                bodyColor = ClusteringDiagram.defaultItemBodyColor;
            }
        }

        var textColor = item.textColor;
        if (!textColor) textColor = ClusteringDiagram.defaultTextColor;
        
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
    
        if (item.type === "cluster") {
            var clusterRectangleOuter = group.append("circle")
                .attr("r", radius * 3)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", d3.rgb(bodyColor))
                .style("opacity", 0.25)
                .style("stroke", d3.rgb(borderColor))
                .style("stroke-width", borderWidth * 2);
            group.circle = clusterRectangleOuter;
        } else {
            var itemCircle = group.append("circle")
                .attr("r", radius)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", d3.rgb(bodyColor))
                .style("opacity", 0.75)
                .style("stroke", d3.rgb(borderColor))
                .style("stroke-width", borderWidth);
            group.circle = itemCircle;
        }
        
        var hoverText = item.name;
        if (item.notes) hoverText += " -- " + item.notes;
        if (item.notesExtra) hoverText += "\n----------\n" + item.notesExtra;
        if (item.strength) hoverText += " [Strength: " + item.strength + "]"; 

        group.append("title")
            .text(hoverText);
        
        group.borderColor = borderColor;
        group.borderWidth = borderWidth;
        
        this.addText(group, item.name, radius * 1.5, textStyle, textColor);
    
        group.on("mousedown", () => {
            this.selectItem(item, d3.event.shiftKey);
        });

        var self = this;
        var drag = d3.behavior.drag();
        var moved = false;
        
        drag.on("dragstart", function () {
            if (item) {
                self.selectItem(item);
            } else {
                self.rubberBanding = true;
                self.rubberBandingStartX = d3.event.x;
                self.rubberBandingStartY = d3.event.y;
            }
            moved = false;
        });
        
        drag.on("drag", function () {
            // TODO: Casting to any as workaround to silence TypeScript error for maybe incomplete d3 typing file
            //item.x = Math.round(item.x + (<any>d3.event).dx);
            //item.y = Math.round(item.y + (<any>d3.event).dy);
            //group.attr('transform', 'translate(' + item.x + ',' + item.y + ')');
            self.selectedItems.forEach(function(item) {
                item.x = Math.round(item.x + (<any>d3.event).dx);
                item.y = Math.round(item.y + (<any>d3.event).dy);
                var displayObject = self.itemToDisplayObjectMap[item.uuid];
                if (displayObject) {
                    displayObject.attr('transform', 'translate(' + item.x + ',' + item.y + ')');
                }
            });
            moved = true;
        });
        
        drag.on("dragend", function() {
            if (moved) {
                if (item) {
                    self.incrementChangesCount();
                } 
            }
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

    addText(group, itemText, maxWidth, textStyle, textColor) {
        if (itemText === undefined) itemText = "[missing text]";
        var text = group.append("text")
            .style("font-family", textStyle.family)
            .style("font-size", textStyle.size)
            .style("font-weight", textStyle.weight)
            .style("text-anchor", "middle");
        
        myWrap(text, itemText, textStyle, textColor, maxWidth);
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // selecting and deselecting items 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    selectItem(item, shift = false) {
        if (shift) {
            if (item) {
                this.lastSelectedItem = item;
                const itemIndex = this.selectedItems.indexOf(item);
                if (itemIndex < 0) {
                    this.selectedItems.push(item);
                } else {
                    this.selectedItems.splice(itemIndex, 1);
                }
            } else {
                this.lastSelectedItem = item;
                this.selectedItems = [];
            }
        } else {
            if (item) {
                if (this.selectedItems.length <= 1) {
                    this.lastSelectedItem = item;
                    this.selectedItems = [];
                    this.selectedItems.push(item);
                }
            } else {
                this.lastSelectedItem = item;
                this.selectedItems = [];
            }
        }
        // Queue redrawing as this was selected via D3 not Mithril
        m.redraw();
    }
    
    clearSelection() {
        this.selectItem(null);
    }    

    selectItemsInRectangle(x1, y1, x2, y2, shift) {
        if (!shift) this.selectedItems = [];
        this.model.items.forEach(function(item) {
            if (item.x >= Math.min(x1, x2) && item.x < Math.max(x1, x2) && item.y >= Math.min(y1, y2) && item.y < Math.max(y1, y2)) {
                if (this.selectedItems.indexOf(item) < 0) {
                    this.selectedItems.push(item);
                }
            }
        }, this);
        m.redraw();
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // updating the diagram for changes
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    incrementChangesCount() {
        this.model.changesCount++;
        if (this.autosave) {
            this.saveChanges();
        }
    }

    acceptChangesForItemBeingEdited() {
        this.showEntryDialog = false;
        this.itemBeingEdited.name = this.itemBeingEditedCopy.name;
        // Ensure the item has a name
        // TODO: This allows duplicate names if items have been deleted
        if (!this.itemBeingEdited.name) {
            this.itemBeingEdited.name = "Untitled " + this.itemBeingEdited.type + " #" + (this.model.items.length + 1);
        }
        this.itemBeingEdited.notes = this.itemBeingEditedCopy.notes;
        if (this.isEditedItemNew) {
            this.model.items.push(this.itemBeingEdited);
            this.addDisplayObjectForItem(this.mainSurface, this.itemBeingEdited);
        } else {
            this.updateDisplayForChangedItem(this.itemBeingEdited, "update");
        }
        this.incrementChangesCount();
        this.selectItem(this.itemBeingEdited);
    }

    acceptChangesToSurfaceSize() {
        this.showSurfaceSizeDialog = false;
        if (this.surfaceWidthBeingEdited !== this.model.surfaceWidthInPixels || this.surfaceHeightBeingEdited !== this.model.surfaceHeightInPixels) {
            this.model.surfaceWidthInPixels = this.surfaceWidthBeingEdited;
            this.model.surfaceHeightInPixels = this.surfaceHeightBeingEdited;
            this._mainSurface
                .attr('width', this.surfaceWidthBeingEdited)
                .attr('height', this.surfaceHeightBeingEdited);
            this.incrementChangesCount();
            m.redraw();
        }
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
    
    updateDiagram(newDiagram) {
        if (!newDiagram) return;
        
        if (this.model.changesCount === newDiagram.changesCount) {
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
        
        this.clearSelection();
        this.updateSizeOfSurfaceFromModel();
    }
    
    recreateDisplayObjectsForAllItems() {
        this.itemToDisplayObjectMap = <any>{};
        this.mainSurface.selectAll("*").remove();
        this.selectionRect = this.mainSurface.append('rect').attr('class', 'selectionRectangle');
        this.model.items.forEach(function (item) {
            this.addDisplayObjectForItem(this.mainSurface, item);
        }, this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // pop-up dialogs
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    openSurfaceSizeDialog() {
        this.surfaceWidthBeingEdited = this.model.surfaceWidthInPixels;
        this.surfaceHeightBeingEdited = this.model.surfaceHeightInPixels;
        this.showSurfaceSizeDialog = true;
    }

    buildSurfaceSizeDialog() {
        return m("div.overlay", m("div.modal-content", {"style": "width: 30%"}, [
             "This is the current size of the clustering surface, in pixels. Enter one or two new numbers to change it.",
             m("br"),
             m("br"),
             m('label', {"for": "sizeDialog_width"}, "Width:"),
             m('input[type=text]', {
                 id: "sizeDialog_width",
                 value: this.model.surfaceWidthInPixels,
                 onchange: (event) => { 
                    let newWidth = parseInt(event.target.value.trim(), 10);
                    if (newWidth) this.surfaceWidthBeingEdited = newWidth; 
                    }
             }),
             m('br'),
             m('br'),
             m('label', {"for": "sizeDialog_height"}, "Height:"),
             m('input[type=text]', {
                 id: "sizeDialog_height",
                 value: this.model.surfaceHeightInPixels,
                 onchange: (event) => { 
                    let newHeight = parseInt(event.target.value.trim(), 10);
                    if (newHeight) this.surfaceHeightBeingEdited = newHeight; 
                    }
             }),
             m("br"),
             m("br"),
             m("button", {onclick: () => {this.showSurfaceSizeDialog = false;}}, "Cancel"),
             m("button", {onclick: () => {this.acceptChangesToSurfaceSize();}}, "OK")
         ]));
     }
    
    openEntryDialog(item, isExistingItem) {
        this.itemBeingEdited = item;
        this.itemBeingEditedCopy = JSON.parse(JSON.stringify(item));
        this.isEditedItemNew = !isExistingItem;
        this.showEntryDialog = true;
    }

    buildEntryDialog() {
        let createOrEdit = (this.isEditedItemNew) ? "New" : "Edit";
        return m("div.overlay", m("div.modal-content", {"style": "width: 40%"}, [
            createOrEdit + " " + this.itemBeingEditedCopy.type,
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
            m("br"),
            m('textarea[class=narrafirma-textbox]', {
                id: "itemDialog_notes",
                value: this.itemBeingEditedCopy.notes || "",
                onchange: (event) => { this.itemBeingEditedCopy.notes = event.target.value; }
            }),
            m("br"),
            m("button", {
                onclick: () => {
                    this.showEntryDialog = false;
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
        var newDiagram;
        try {
            newDiagram = JSON.parse(text);
        } catch (e) {
            alert("Problem parsing source\n" + e);
            return;
        }
        hideDialogMethod();
        this.updateDiagram(newDiagram);
        this.incrementChangesCount();
    }
    
    openSourceDialog(text) {
        dialogSupport.openTextEditorDialog(text, "#clusterDiagramSource_titleID|Clustering Diagram", "#clusterDiagramSource_okButtonID|OK", this.updateSourceClicked.bind(this));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // resizing 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    updateSizeOfSurfaceFromResizeHandle() {
        var newWidth = this.divForResizing.clientWidth;
        var newHeight = this.divForResizing.clientHeight;
        
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
        
        this.model.surfaceWidthInPixels = newWidth;
        this.model.surfaceHeightInPixels = newHeight;
        
        this.incrementChangesCount();
    }

    updateSizeOfSurfaceFromModel() {
        var newWidth = this.model.surfaceWidthInPixels;
        var newHeight = this.model.surfaceHeightInPixels;
        
        this.divForResizing.setAttribute("style", "width: " + this.model.surfaceWidthInPixels + "px; height: " + this.model.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
    }

} // end of the ClusteringDiagram class

export = ClusteringDiagram;
