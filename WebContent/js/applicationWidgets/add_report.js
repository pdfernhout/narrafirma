define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "js/reportGeneration",
    "dojo/_base/lang",
    "js/panelBuilder/translate"
], function(
    at,
    ContentPane,
    reportGeneration,
    lang,
    translate
){
    "use strict";
    
    function add_report(panelBuilder, contentPane, model, fieldSpecification) {
        var headerPageID = "page_" + fieldSpecification.displayConfiguration;
        var calculate = lang.partial(reportGeneration.calculate_report, model, headerPageID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_report;
});