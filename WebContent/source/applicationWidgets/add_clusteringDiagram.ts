import ClusteringDiagram = require("./ClusteringDiagram");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

function add_clusteringDiagram(panelBuilder: PanelBuilder, model, fieldSpecification) {
    // clustering diagram using a list of 2D objects
    console.log("add_clusteringDiagram", model, fieldSpecification);
    
    var diagramName = fieldSpecification.displayConfiguration;
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = panelBuilder.project.tripleStore.makeStorageFunction(model, diagramName);
    var clusteringDiagram = m.component(<any>ClusteringDiagram, {key: fieldSpecification.id, storageFunction: storageFunction, autosave: true});

    // TODO: Who should be responsible for updating this data? Is redraw called or is that bypassed as an html component?
    
    return m("div", [
        prompt,
        clusteringDiagram
    ]);
}

export = add_clusteringDiagram;
