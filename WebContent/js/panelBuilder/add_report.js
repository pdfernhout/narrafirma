define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "js/translate"
], function(
    at,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
    function add_report(panelBuilder, contentPane, model, fieldSpecification) {
        var headerPageID = "page_" + fieldSpecification.displayConfiguration;
        var calculate = lang.partial(domain.calculate_report, model, headerPageID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_report;
});