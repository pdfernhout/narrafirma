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
let measuringCanvas;

function getTextWidth(text, textStyle) {
    // re-use canvas object for better performance
    const canvas = measuringCanvas || (measuringCanvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = "normal normal " + textStyle.weight + " " + textStyle.size + " " + textStyle.family;
    const metrics = context.measureText(text);
    const result = metrics.width;
    return result;
}

function myWrap(text, itemText, textStyle, textColor, maxWidth) {
    const lineHeight_em = 1.1;
    const words = itemText.split(/\s+/);
    const lines = [];
    let line = "";
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
    let lineNumber = (Math.round(-lines.length / 2 + 0.5));
    forEach(lines, function (index, line) {
        const tspan = text.append("tspan")
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
    for (let index = 0, length = theArray.length; index < length; ++index) {
        theFunction(index, theArray[index], theArray);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// clustering diagram
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ClusteringDiagram {
    model: ClusteringDiagramModel = null;
    project = Globals.project();
    
    mainButtons = [];
    
    configuration: string;
    useContext: string;
    storageFunction: Function;
    autosave: boolean = false;
    lastSelectedItem: ClusteringDiagramItem  = null;
    divForResizing: HTMLElement = null;
    _mainSurface: d3.Selection<any> = null;
    mainSurface: d3.Selection<any> = null;
    itemToDisplayObjectMap: {key: string; element: d3.Selection<any>} = <any>{};
    
    d3DivForResizing: d3.Selection<any> = null;
    doThingsSelectID = generateRandomUuid("doThingsSelect_");
    background = null;
    showStrengthColors = true;

    selectionRect = null;
    selectionRectUUID = generateRandomUuid("selectionRect_");
    parentChildLinesGroup = null;
    parentChildLinesUUID = generateRandomUuid("parentChildLines_");
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

    showReorderDialog = false;

    static defaultItemBodyColor = "#bcbcbc"; 
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
        const item: ClusteringDiagramItem = {
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
        const item = ClusteringDiagram.newItem(itemType, name, notes);
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
        const result = [];
        if (!clusteringDiagram) return result;
        
        const clusters = clusteringDiagram.items.filter(function (item) { return item.type === "cluster"; });
        const items = clusteringDiagram.items.filter(function (item) { return item.type === "item"; });
        
        items.forEach((item) => {
            item.clusterDistance = Number.MAX_VALUE;
            item.cluster = null;
            clusters.forEach((cluster) => {
                const dx = item.x - cluster.x;
                const dy = item.y - cluster.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
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

    static itemColor_strong = "#ff9138";
    static itemColor_medium = "#ffbb84";
    static itemColor_weak = "#ffe5d1";
    static itemColor_unassigned = "#bcbcbc";

    static setItemColorBasedOnStrength(item: ClusteringDiagramItem, strength: string) {
        switch (strength) {
            case "3 (strong)":
                item.bodyColor = ClusteringDiagram.itemColor_strong;
                break;
            case "2 (medium)":
                item.bodyColor = ClusteringDiagram.itemColor_medium;
                break;
            case "1 (weak)":  
                item.bodyColor = ClusteringDiagram.itemColor_weak;
                break;
            default:
                item.bodyColor = ClusteringDiagram.itemColor_unassigned;
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    constructor(configuration: string, storageFunction: Function, autosave) {
        this.configuration = configuration;
        this.useContext = (this.configuration === "interpretations" || this.configuration === "observations") ? "catalysis" : "planning";
        this.storageFunction = storageFunction; 
        this.autosave = autosave;
        this.model = storageFunction();
        if (!this.model) {
            this.model = ClusteringDiagram.newDiagramModel();
        }
        this.setupOptionsAndButtons();
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
        const divForResizing = document.createElement("div");
        this.divForResizing = divForResizing;
        const divUUID = generateRandomUuid("ResizeableCanvasHolder"); 
        divForResizing.setAttribute("id", divUUID);
        //divForResizing.setAttribute("style", "width: " + this.diagram.surfaceWidthInPixels + "px; height: " + this.diagram.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        //divForResizing.setAttribute("style", "resize: auto; border: solid 1px");
    
        const width = this.model.surfaceWidthInPixels;
        const height = this.model.surfaceHeightInPixels;
        
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
                this.shiftKeyIsBeingHeldDownWhileRubberBanding = d3.event.shiftKey;
            });

        const drag = d3.behavior.drag();
        const self = this;
        
        drag.on("dragstart", function () {
            let position = d3.mouse(this);
            self.rubberBanding = true;
            self.rubberBandingStartX = position[0];
            self.rubberBandingStartY = position[1];
            d3.select("." + self.selectionRectUUID)
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
                d3.select("." + self.selectionRectUUID)
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
            d3.select("." + self.selectionRectUUID)
                .style('stroke', "none")
                .attr('transform', 'translate (0, 0)')
                .attr('width', 0)
                .attr('height', 0);
        });
        
        this.background.call(drag);
        this.mainSurface = this._mainSurface.append('g').attr('class', 'mainSurface');
        this.recreateDisplayObjectsForAllItems();
    }

    setupOptionsAndButtons() {
        let thingsYouCanDo;
        if (this.useContext === "planning") {
            thingsYouCanDo = [
                "Create new answer",
                "Create new cluster name",
                "Edit selected answer or cluster name",
                "Delete selected answer or cluster name",
                "Resize clustering space",
                "Edit answers and clusters in JSON format"
            ];
        } else if (this.useContext === "catalysis") {
            thingsYouCanDo = [
                "Create new cluster name",
                "Edit selected cluster name",
                "Delete selected cluster name",
                "Show/hide selected item/cluster in report",
                "Change cluster print order",
                "Resize clustering space",
                "Toggle observation strength colors"
            ];
        }
        const selectOptions = [];
        thingsYouCanDo.forEach((thing, index) => { selectOptions.push(m("option", {value: thing, selected: undefined}, thing)); });
        this.mainButtons.push(m("select.narrafirma-clustering-diagram-do-things-select", {id: this.doThingsSelectID}, selectOptions));

        const self = this; // must copy "this" because "this" inside an event handler is the DOM element
        this.mainButtons.push(
            m("button", 
                {onclick: function() { self.doThing(self.doThingsSelectID) } }, 
                m("span", {class: "buttonWithTextImage doItButtonImage"}), "Do it")
            ); 

        if (!this.autosave) {
            this.mainButtons.push(m("button.narrafirma-clustering-diagram-save-changes", {onclick: function() {self.saveChanges()}}, "Save changes"));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // data handling
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    newItem(itemType = "item", name = "", notes = "") {
        const newItem = ClusteringDiagram.newItem(itemType, name, notes);
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

        const entryDialog = [];
        if (this.showEntryDialog) {
            entryDialog.push(this.buildEntryDialog());
        }
        const surfaceSizeDialog = [];
        if (this.showSurfaceSizeDialog) {
            surfaceSizeDialog.push(this.buildSurfaceSizeDialog());
        }
        const reorderDialog = [];
        if (this.showReorderDialog) {
            reorderDialog.push(this.buildReorderDialog());
        }
        
        this.model.items.forEach(function(item) {
            const displayObject = this.itemToDisplayObjectMap[item.uuid];
            if (displayObject) {
                const borderWidth =  (this.selectedItems.indexOf(item) >= 0) ? displayObject.borderWidth * 5 : displayObject.borderWidth;
                displayObject.circle.style("stroke-width", borderWidth);
            }
        }, this);
        
        return m("div", [
            m("div.narrafirma-clustering-surface", {config: this.configSurface.bind(this)}),
            this.mainButtons,
            entryDialog,
            surfaceSizeDialog,
            reorderDialog
        ]);
    }
    
    addDisplayObjectForItem(surface, item: ClusteringDiagramItem) {
        let bodyColor = item.bodyColor;
        if (!bodyColor || !this.showStrengthColors) {
            if (item.type === "cluster") {
                bodyColor = ClusteringDiagram.defaultClusterBodyColor;
            } else {
                bodyColor = ClusteringDiagram.defaultItemBodyColor;
            }
        }
        if (item.hidden) { bodyColor = "white"; }

        let textColor = item.textColor;
        if (!textColor) textColor = ClusteringDiagram.defaultTextColor;
        
        let borderColor = item.borderColor;
        if (!borderColor) borderColor = ClusteringDiagram.defaultBorderColor;

        let borderWidth = item.borderWidth;
        if (!borderWidth) borderWidth = ClusteringDiagram.defaultBorderWidth;
        
        let radius = item.radius;
        if (!radius) radius = ClusteringDiagram.defaultRadius;
        
        let textStyle = item.textStyle;
        if (!textStyle) textStyle = ClusteringDiagram.defaultTextStyle;
        if (item.type === "cluster") { 
            textStyle.weight = "bold"; 
        } else {
            textStyle.weight = "normal"; 
        }
    
        let group;
        group = surface.append('g')
            .attr('transform', 'translate(' + item.x + ',' + item.y + ')')
            .attr('class', 'item');
    
        // TODO: Does this work with SVG elements? Are they really D3 selections? Or maybe could also map data to element with D3?
        group.item = item;
    
        if (item.type === "cluster") {
            const clusterCircle = group.append("circle")
                .attr("r", radius) 
                .attr("cx", 0)
                .attr("cy", 0)
                .style("cursor", "pointer")
                .style("fill", bodyColor)
                .style("opacity", 0.8)
                .style("stroke", borderColor)
                .style("stroke-width", borderWidth);
            group.circle = clusterCircle;
        } else {
            const itemCircle = group.append("circle")
                .attr("r", radius)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("cursor", "pointer")
                .style("fill", bodyColor)
                .style("opacity", 0.8)
                .style("stroke", borderColor)
                .style("stroke-width", borderWidth);
            group.circle = itemCircle;
        }

        group.borderColor = borderColor;
        group.borderWidth = borderWidth;
        
        let textToShow = item.name;
        if (item.order) textToShow = item.order + ". " + item.name;
        if (!textToShow) textToShow = item.notes.split(" ").slice(0, 10).join(" ") + " ...";
        this.addText(group, textToShow, radius * 1.5, textStyle, textColor);

        let hoverText = item.name;
        if (item.hidden) hoverText += ' (hidden)';
        if (item.notes) hoverText += " -- " + item.notes;
        if (item.notesExtra) hoverText += "\n---\nObservation: " + item.notesExtra;
        if (item.strength) hoverText += " [Strength: " + item.strength + "]"; 
        group.append("title").text(hoverText);

        group.on("mousedown", () => {
            this.selectItem(item, d3.event.shiftKey);
        });

        const self = this;
        const drag = d3.behavior.drag();
        let moved = false;

        function drawParentChildLines(item) {
            let parentOrChildren = [];
            if (item.type === "item") {
                const closestCluster = self.closestClusterToItem(item);
                if (closestCluster) parentOrChildren.push(closestCluster);
            } else {
                const closestItems = self.itemsClosestToCluster(item);
                if (closestItems.length) parentOrChildren = parentOrChildren.concat(closestItems);
            }
            self.parentChildLinesGroup.selectAll("*").remove();
            parentOrChildren.forEach((parentOrChild) => {
                self.parentChildLinesGroup.append('line')
                    .style("stroke", "black")
                    .style("stroke-width", 1)
                    .style("stroke-dasharray", 4)
                    .style("opacity", 1.0)
                    .attr("x1", item.x)
                    .attr("y1", item.y)
                    .attr("x2", parentOrChild.x)
                    .attr("y2", parentOrChild.y);
            });
        }
        
        drag.on("dragstart", function () {
            if (!item) {
                self.rubberBanding = true;
                self.rubberBandingStartX = d3.event.x;
                self.rubberBandingStartY = d3.event.y;
            }
            drawParentChildLines(item);
            moved = false;
        });

        drag.on("drag", function () {
            // TODO: Casting to any as workaround to silence TypeScript error for maybe incomplete d3 typing file
            //item.x = Math.round(item.x + (<any>d3.event).dx);
            //item.y = Math.round(item.y + (<any>d3.event).dy);
            //group.attr('transform', 'translate(' + item.x + ',' + item.y + ')');
            self.selectedItems.forEach(function(item) {
                item.x = Math.min(self.model.surfaceWidthInPixels, Math.max(0, Math.round(item.x + (<any>d3.event).dx)));
                item.y = Math.min(self.model.surfaceHeightInPixels, Math.max(0, Math.round(item.y + (<any>d3.event).dy)));
                const displayObject = self.itemToDisplayObjectMap[item.uuid];
                if (displayObject) displayObject.attr('transform', 'translate(' + item.x + ',' + item.y + ')');
                drawParentChildLines(item);
            });
            moved = true;
        });
        
        drag.on("dragend", function() {
            self.parentChildLinesGroup.selectAll("*").remove();
            if (moved && item) self.incrementChangesCount();
        });
        
        group.call(drag);
    
        group.on("dblclick", () => {
            if (this.useContext === "planning") {
                self.openEntryDialog(item, true);
            } else if (this.useContext === "catalysis") {
                if (item.type === "cluster") self.openEntryDialog(item, true);
            }
            m.redraw();
        });
    
        this.itemToDisplayObjectMap[item.uuid] = group;
        return group;
    }

    addText(group, itemText, maxWidth, textStyle, textColor) {
        if (itemText === undefined) itemText = "[missing text]";
        const text = group.append("text")
            .style("cursor", "pointer")
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
        this.itemBeingEdited.order = this.itemBeingEditedCopy.order;
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
            this.incrementChangesCount(); // need to do this to save new surface size to the model
            this.updateSizeOfSurfaceFromModel();
        }
    }
    
    // typeOfChange should be either "delete" or "update"
    updateDisplayForChangedItem(item, typeOfChange) {
        if (item === null) {
            console.log("updateDisplayForChangedItem item is null", typeOfChange);
            return;
        }
        const displayObject = this.itemToDisplayObjectMap[item.uuid];
        if (typeOfChange === "delete") {
            delete this.itemToDisplayObjectMap[item.uuid];
            displayObject.remove();
            return;
        }
        displayObject.remove();
        const newDisplayObject = this.addDisplayObjectForItem(this.mainSurface, item);
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
        this.selectionRect = this.mainSurface.append('rect').attr('class', this.selectionRectUUID);
        this.parentChildLinesGroup = this.mainSurface.append('g').attr('class', this.parentChildLinesUUID);
        this.model.items.forEach(function (item) { this.addDisplayObjectForItem(this.mainSurface, item); }, this);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // things you can do
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doThing(selectID) {
        const select = <HTMLSelectElement>document.getElementById(selectID);
        if (!select) {
            const message = 'Error: Cannot find drop-down list box with id "' + selectID + '" on HTML page. Please report this error.';
            alert(message);
            console.error(message);
            return;
        }
        const choice = select.value;
        switch (choice) {
            case "Create new answer": // planning
                this.createNewItem();
                break;
            case "Create new cluster name": // either
                this.createNewClusterName();
                break;
            case "Edit selected answer or cluster name": // planning
                this.editSelectedItemOrCluster();
                break;
            case "Edit selected cluster name": // catalysis
                this.editSelectedCluster();
                break;
            case "Delete selected answer or cluster name": // planning
                this.deleteSelectedItemOrCluster();
                break;
            case "Delete selected cluster name": // catalysis
                this.deleteSelectedCluster();
                break;
            case "Show/hide selected item/cluster in report": // catalysis
                this.showOrHideItemOrClusterInReport();
                break;
            case "Change cluster print order": // catalysis
                this.openReorderDialog();
                break;
            case "Resize clustering space": // either
                this.openSurfaceSizeDialog();
                break;
            case "Toggle observation strength colors": // catalysis
                this.toggleStrengthColors();
                break;
            case "Edit answers and clusters in JSON format": // planning
                this.openSourceDialog(JSON.stringify(this.model, null, 2));
                break;
            default:
                alert("Please choose an action from the list before you click the button.");
                break;
        }
    }

    createNewItem() {
        const aNewItem = this.newItem("item");
        this.openEntryDialog(aNewItem, false);
    }

    createNewClusterName() {
        const aNewClusterName = this.newItem("cluster");
        this.openEntryDialog(aNewClusterName, false);
    }

    editSelectedItemOrCluster() {
        if (this.lastSelectedItem) {
            this.openEntryDialog(this.lastSelectedItem, true);
        } else {
            alert("Please select an answer or cluster name to edit.");
        }
    }

    editSelectedCluster() {
        if (this.lastSelectedItem && this.lastSelectedItem.type === "cluster") {
            this.openEntryDialog(this.lastSelectedItem, true);
        } else {
            alert("Please select a cluster name to edit.");
        }
    }

    deleteSelectedItemOrCluster() {
        if (!this.lastSelectedItem) {
            alert("Please select an answer or cluster name to delete.");
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
    }

    deleteSelectedCluster() {
        if (!this.lastSelectedItem || this.lastSelectedItem.type != "cluster") {
            alert("Please select a cluster name to delete.");
            return;
        }
        dialogSupport.confirm("Are you sure you want to delete the cluster name '" + this.lastSelectedItem.name + "'?", () => {
            this.updateDisplayForChangedItem(this.lastSelectedItem, "delete");
            const itemIndex = this.model.items.indexOf(this.lastSelectedItem);
            if (itemIndex >= 0) {
                this.model.items.splice(itemIndex, 1);
            }
            this.clearSelection();
            this.incrementChangesCount();
        });
    }
    
    showOrHideItemOrClusterInReport() {
        if (this.selectedItems.length > 0) {
            this.selectedItems.forEach(item => {
                if (item.hidden === undefined) item.hidden = false;
                item.hidden = !item.hidden;
                this.updateDisplayForChangedItem(item, "update");

                if (item.type === "cluster") {
                    const itemsClosestToThisCluster = this.itemsClosestToCluster(item);
                    itemsClosestToThisCluster.forEach((clusteredItem) => {
                        clusteredItem.hidden = item.hidden;
                        this.updateDisplayForChangedItem(clusteredItem, "update");
                    })
                }
                this.incrementChangesCount();
            });
        } else {
            alert("Please select at least one item or cluster to show or hide.");
        }
    }

    itemsClosestToCluster(clusterToCheck) {
        const clusters = this.model.items.filter(function (item) { return item.type === "cluster"; });
        const items = this.model.items.filter(function (item) { return item.type === "item"; });
        const result = [];
        items.forEach((item) => {
            const closestCluster = this.closestClusterToItem(item);
            if (closestCluster.name === clusterToCheck.name) result.push(item);
        });
        return result;
    }

    closestClusterToItem(item) {
        const clusters = this.model.items.filter(function (item) { return item.type === "cluster"; });
        let smallestDistanceToACluster = Number.MAX_VALUE;
        let closestCluster = null;
        for (let i = 0; i < clusters.length; i++) {
            const cluster = clusters[i];
            const dx = item.x - cluster.x;
            const dy = item.y - cluster.y;
            const distanceToThisCluster = Math.sqrt(dx * dx + dy * dy);
            if (distanceToThisCluster < smallestDistanceToACluster) {
                smallestDistanceToACluster = distanceToThisCluster;
                closestCluster = cluster;
            }
        }
        return closestCluster;
    }

    toggleStrengthColors() {
        this.showStrengthColors = !this.showStrengthColors;
        this.recreateDisplayObjectsForAllItems();
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
        
        const selectOptionsRaw = ["400", "450", "500", "550", "600", "650", "700", "750", "800", "850", "900", "950", "1000", "1050", "1100", "1150", "1200", "1250", "1300", "1350", "1400", "1450", "1500", "1550", "1600", "1650", "1700", "1750", "1800", "1850", "1900", "1950", "2000"];
        const widthOptions = selectOptionsRaw.map((option, index) => {
            return m("option", {value: option, selected: parseInt(option) === this.model.surfaceWidthInPixels}, option);
        });
        const heightOptions = selectOptionsRaw.map((option, index) => {
            return m("option", {value: option, selected: parseInt(option) === this.model.surfaceHeightInPixels}, option);
        });

        return m("div.overlay", m("div.modal-content", {"style": "width: 30%"}, [
             "Choose a new width and height for the clustering surface.",
             m("br"),
             m("br"),
             m('label', {for: "sizeDialog_width", style: "margin-right: 0.5em"}, "Width:"),
             m("select", {
                 id: "sizeDialog_width",
                 // the reason to do this is because this redraw method is called WHILE the user is holding down the OK button
                 // during which time these two numbers do not agree, so the old value was flickering into view
                 value: this.showSurfaceSizeDialog ? this.surfaceWidthBeingEdited : this.model.surfaceWidthInPixels,
                 onchange: (event) => { 
                    let newWidth = parseInt(event.target.value.trim(), 10);
                    if (newWidth) this.surfaceWidthBeingEdited = newWidth; 
                    },
             }, widthOptions),
             m('br'),
             m('br'),
             m('label', {for: "sizeDialog_height", style: "margin-right: 0.5em"}, "Height:"),
             m("select", {
                 id: "sizeDialog_height",
                 value: this.showSurfaceSizeDialog ? this.surfaceHeightBeingEdited : this.model.surfaceHeightInPixels,
                 onchange: (event) => { 
                    let newHeight = parseInt(event.target.value.trim(), 10);
                    if (newHeight) this.surfaceHeightBeingEdited = newHeight; 
                    }
             }, heightOptions),
             m("br"),
             m("br"),
             m("button", {onclick: () => {this.showSurfaceSizeDialog = false;}}, "Cancel"),
             m("button", {onclick: () => {this.acceptChangesToSurfaceSize();}}, "OK")
         ]));
    }

    openReorderDialog() {
        this.showReorderDialog = true;
    }    

    buildReorderDialog() {
        if (!this.model) return m("div");
        const clusters = this.model.items.filter(function (item) { return item.type === "cluster"; });
        let atLeastOneClusterHasNoOrderValueSet = false;
        clusters.sort(function(a, b) { 
            if (a.order && b.order) {
                return (a.order > b.order) ? 1 : -1;
            } else {
                atLeastOneClusterHasNoOrderValueSet = true;
                return (a > b) ? 1 : -1; // alphabetical
            }
        });
        if (atLeastOneClusterHasNoOrderValueSet) {
            clusters.forEach((cluster, index) => { cluster.order = index + 1; });
        }
        const selectOptions = clusters.map((cluster) => { return m("option", {value: cluster.name}, cluster.name); });

        const self = this;
        return m("div.overlay", m("div.modal-content", {"style": "width: 30%"}, [
            "Click the up and down arrows to reorder clusters.",
            m("br"),
            m("br"),
            m("select", {size: 10, id: "orderDialogSelect"}, selectOptions),
            m('br'),
            m("button", {onclick: () => {self.moveSelectedClusterUp();}}, "↑"),
            m("button", {onclick: () => {self.moveSelectedClusterDown();}}, "↓"),
            m("button", {onclick: () => {self.closeReorderDialog();}}, "Close")
        ]));        
    }

    moveSelectedClusterUp() {
        const element = <HTMLSelectElement>document.getElementById("orderDialogSelect");
        if (!element || element.selectedIndex < 0 || element.selectedIndex - 1 < 0) return;

        const selectedOption = element.options[element.selectedIndex];
        const selectedCluster = this.clusterForName(selectedOption.value);

        const optionAboveSelectedOption = element.options[element.selectedIndex - 1];
        const clusterAboveSelectedCluster = this.clusterForName(optionAboveSelectedOption.value);

        const oldSelectedClusterOrder = selectedCluster.order;
        selectedCluster.order = clusterAboveSelectedCluster.order;
        clusterAboveSelectedCluster.order = oldSelectedClusterOrder;

        if (element.selectedIndex > 0) element.selectedIndex--; 
        this.incrementChangesCount();
        this.recreateDisplayObjectsForAllItems();
    }

    moveSelectedClusterDown() {
        const element = <HTMLSelectElement>document.getElementById("orderDialogSelect");
        if (!element || element.selectedIndex < 0 || element.selectedIndex + 1 > element.options.length - 1) return;

        const selectedOption = element.options[element.selectedIndex];
        const selectedCluster = this.clusterForName(selectedOption.value);
        
        const optionBelowSelectedOption = element.options[element.selectedIndex + 1];
        const clusterBelowSelectedCluster = this.clusterForName(optionBelowSelectedOption.value);

        const oldSelectedClusterOrder = selectedCluster.order;
        selectedCluster.order = clusterBelowSelectedCluster.order;
        clusterBelowSelectedCluster.order = oldSelectedClusterOrder;

        if (element.selectedIndex < element.options.length - 1) element.selectedIndex++; 
        this.incrementChangesCount();
        this.recreateDisplayObjectsForAllItems();
    }

    clusterForName(name) {
        const matchingClusterNames = this.model.items.filter(function (item) { return item.type === "cluster" && item.name === name; });
        return (matchingClusterNames.length > 0) ? matchingClusterNames[0] : null;
    }

    closeReorderDialog() {
        this.showReorderDialog = false;
        this.recreateDisplayObjectsForAllItems();
    }
    
    openEntryDialog(item, isExistingItem) {
        this.itemBeingEdited = item;
        this.itemBeingEditedCopy = JSON.parse(JSON.stringify(item));
        this.isEditedItemNew = !isExistingItem;
        this.showEntryDialog = true;
    }

    buildEntryDialog() {
        let result = [];
        let createOrEdit = (this.isEditedItemNew) ? "New" : "Edit";
        result.push(createOrEdit + " " + this.itemBeingEditedCopy.type);
        result.push(m("br"));
        result.push(m("br"));
        result.push(m('label', {for: "itemDialog_name", style: "margin-right: 0.5em"}, "Name"));
        result.push(m('input[type=text]', {
                id: "itemDialog_name",
                value: this.itemBeingEditedCopy.name || "",
                onchange: (event) => { this.itemBeingEditedCopy.name = event.target.value; }
            }));
        result.push(m('br'));
        result.push(m('br'));
        result.push(m('label', {"for": "itemDialog_notes"}, "Notes:"));
        result.push(m("br"));
        result.push(m('textarea[class=narrafirma-textbox]', {
                id: "itemDialog_notes",
                value: this.itemBeingEditedCopy.notes || "",
                onchange: (event) => { this.itemBeingEditedCopy.notes = event.target.value; }
            }));
        result.push(m("br"));

        /*
        if (this.configuration === "interpretations" || this.configuration === "observations") {
            result.push(m("br"));
            result.push(m('label', {for: "itemDialog_order", style: "margin-right: 0.5em"}, "Order in printed report"));
            result.push(m('input[type=text]', {
                id: "itemDialog_order",
                value: this.itemBeingEditedCopy.order || "",
                onchange: (event) => { 
                    let newOrderAsNumber = parseInt(event.target.value.trim(), 10);
                    if (newOrderAsNumber) this.itemBeingEditedCopy.order = newOrderAsNumber; 
                }
            }));
            result.push(m("br"));
        }
        */
        
        result.push(m("br"));
        result.push(m("button", {onclick: () => {this.showEntryDialog = false;}}, "Cancel"));
        result.push(m("button", {onclick: () => {this.acceptChangesForItemBeingEdited();}}, "OK"));

        return m("div.overlay", m("div.modal-content", {"style": "width: 40%"}, result));
    }
    
    updateSourceClicked(text, hideDialogMethod) {     
        let newDiagram;
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
        dialogSupport.openTextEditorDialog(text, "#clusterDiagramSource_titleID|Clustering Diagram", "#clusterDiagramSource_okButtonID|OK", "Copy to Clipboard", this.updateSourceClicked.bind(this));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // resizing 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    updateSizeOfSurfaceFromResizeHandle() {
        const newWidth = this.divForResizing.clientWidth;
        const newHeight = this.divForResizing.clientHeight;
        
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
        
        this.model.surfaceWidthInPixels = newWidth;
        this.model.surfaceHeightInPixels = newHeight;
        
        this.incrementChangesCount();
    }

    updateSizeOfSurfaceFromModel() {
        const newWidth = this.model.surfaceWidthInPixels;
        const newHeight = this.model.surfaceHeightInPixels;
        
        this.divForResizing.setAttribute("style", "width: " + this.model.surfaceWidthInPixels + "px; height: " + this.model.surfaceHeightInPixels + "px; border: solid 1px; position: relative");
        this._mainSurface.attr("width", newWidth).attr("height", newHeight);
        this.background.attr('width', newWidth).attr('height', newHeight);
    }

} // end of the ClusteringDiagram class

export = ClusteringDiagram;
