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
    
    function add_questionAnswerCountOfTotalOnPage(panelBuilder, contentPane, model, fieldSpecification) {
        var panelID = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_questionAnswerCountOfTotalOnPage, panelBuilder, model, panelID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_questionAnswerCountOfTotalOnPage;
});