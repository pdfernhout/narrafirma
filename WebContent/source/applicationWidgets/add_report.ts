import reportGeneration = require("../reportGeneration");
import PanelBuilder = require("../panelBuilder/PanelBuilder");

"use strict";

function add_report(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var headerPageID = "page_" + fieldSpecification.displayConfiguration;
    var calculate = reportGeneration.calculate_report.bind(null, panelBuilder.panelSpecificationCollection, model, headerPageID);
 // TODO: Fix when refactor
    return panelBuilder._add_calculatedText(panelBuilder, fieldSpecification, calculate);
}

export = add_report;
