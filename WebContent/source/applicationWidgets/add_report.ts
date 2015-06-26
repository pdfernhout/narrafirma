import reportGeneration = require("../reportGeneration");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");

"use strict";

function add_report(panelBuilder: PanelBuilder, model, fieldSpecification) {
    return m("div", "add_report UNFINISHED");
    
    // TODO: Fix for Mithril
    /*
    var headerPageID = "page_" + fieldSpecification.displayConfiguration;
    var calculate = reportGeneration.calculate_report.bind(null, panelBuilder.panelSpecificationCollection, model, headerPageID);
    // TODO: Fix when refactor
    return panelBuilder._add_calculatedText(panelBuilder, fieldSpecification, calculate);
    */
}

export = add_report;
