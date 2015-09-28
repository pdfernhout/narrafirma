import ClusteringDiagram = require("./ClusteringDiagram");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");

"use strict";

function add_clusteringDiagram(panelBuilder: PanelBuilder, model, fieldSpecification) {
    // clustering diagram using a list of 2D objects
    // console.log("add_clusteringDiagram", model, fieldSpecification);
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);
    var clusteringDiagram = m.component(<any>ClusteringDiagram, {key: fieldSpecification.id, storageFunction: storageFunction, autosave: true});

    // TODO: Who should be responsible for updating this data? Is redraw called or is that bypassed as an html component?
    
    return m("div", [
        prompt,
        clusteringDiagram
    ]);
}

export = add_clusteringDiagram;
