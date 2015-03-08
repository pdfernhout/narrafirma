define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "./translate"
], function(
    at,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
    function calculate_listCount(panelBuilder, model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) {
            return "0";
        } else if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            return "<b>ERROR: missing question: " + referencedQuestionID + "</b>";            
        } else {
            return "<b>" + value.length + "</b>";
        }
    }
    
    function add_listCount(panelBuilder, contentPane, model, fieldSpecification) {
        var referencedQuestionID = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(calculate_listCount, panelBuilder, model, referencedQuestionID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_listCount;
});