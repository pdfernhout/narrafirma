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
    
    function add_questionAnswer(panelBuilder, contentPane, model, fieldSpecification) {
        var referencedQuestionID = fieldSpecification.displayConfiguration;
        if (!referencedQuestionID) throw new Error("missing referencedQuestionID for field: " + fieldSpecification.id + " all: " + JSON.stringify(fieldSpecification));
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_questionAnswer, panelBuilder, model, referencedQuestionID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_questionAnswer;
});