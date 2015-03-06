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
    
    function add_function(panelBuilder, contentPane, model, fieldSpecification) {
        var functionName = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_function, panelBuilder, functionName, fieldSpecification);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_function;
});