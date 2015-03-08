define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "js/domain",
    "dojo/_base/lang",
    "js/panelBuilder/translate"
], function(
    at,
    ContentPane,
    domain,
    lang,
    translate
){
    "use strict";
    
    function calculate_function(panelBuilder, functionName, fieldSpecification) {
        return domain.callDashboardFunction(functionName, fieldSpecification);
    }
    
    function add_function(panelBuilder, contentPane, model, fieldSpecification) {
        var functionName = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(calculate_function, panelBuilder, functionName, fieldSpecification);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_function;
});