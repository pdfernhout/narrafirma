define([
    "js/reportGeneration",
    "dojo/_base/lang"
], function(
    reportGeneration,
    lang
){
    "use strict";
    
    function add_report(panelBuilder, contentPane, model, fieldSpecification) {
        var headerPageID = "page_" + fieldSpecification.displayConfiguration;
        var calculate = lang.partial(reportGeneration.calculate_report, panelBuilder.panelSpecificationCollection, model, headerPageID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_report;
});