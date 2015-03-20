define([
    "dojo/_base/lang",
    "js/panelBuilder/translate"
], function(
    lang,
    translate
){
    "use strict";
    
    function calculate_questionAnswer(panelBuilder, model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) value = translate("#question_not_yet_answered|(Not yet answered)");
        if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            // throw new Error("ERROR: missing question: " + referencedQuestionID);            
        }

        // This collection could be null during testing
        var panelSpecificationCollection = panelBuilder.panelSpecificationCollection;
        if (!panelSpecificationCollection) {
            var errorMessage = "ERROR: panelBuilder.panelSpecificationCollection is null";
            console.log("ERROR", errorMessage);
            return errorMessage;
        }
        
        var fieldSpecification = panelSpecificationCollection.getFieldSpecificationForFieldID(referencedQuestionID);
        if (fieldSpecification) {
            if (fieldSpecification.displayType === "select" ||  fieldSpecification.displayType === "checkboxes" || fieldSpecification.displayType === "radiobuttons") {
                // TODO: This may not translate correctly for checkboxes; may need to be translated individually
                // console.log("trying to translate select", value);
                // TODO: Possible big issue here with incorrect translation if values have spaces in them
                value = translate(value, value);
            }
        } else {
            console.log("calculate_questionAnswer: missing fieldSpecification definition for: ", referencedQuestionID);
        }
        return "<b>" + value + "<b>";
    }

    function add_questionAnswer(panelBuilder, contentPane, model, fieldSpecification) {
        var referencedQuestionID = fieldSpecification.displayConfiguration;
        if (!referencedQuestionID) throw new Error("missing referencedQuestionID for field: " + fieldSpecification.id + " all: " + JSON.stringify(fieldSpecification));
     // TODO: Fix when refactor
        var calculate = lang.partial(calculate_questionAnswer, panelBuilder, model, referencedQuestionID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_questionAnswer;
});