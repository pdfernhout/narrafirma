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
    
    function add_listCount(panelBuilder, contentPane, model, fieldSpecification) {
        var referencedQuestionID = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_listCount, panelBuilder, model, referencedQuestionID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_listCount;
});