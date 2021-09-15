import ClusteringDiagram = require("./ClusteringDiagram");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");

"use strict";

function add_clusteringDiagram(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    const storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);
    const clusteringDiagram = m.component(<any>ClusteringDiagram, {key: fieldSpecification.id, configuration: fieldSpecification.displayConfiguration, storageFunction: storageFunction, autosave: true});

    // TODO: Who should be responsible for updating this data? Is redraw called or is that bypassed as an html component?
    return m("div", [prompt, clusteringDiagram]);
}

export = add_clusteringDiagram;
