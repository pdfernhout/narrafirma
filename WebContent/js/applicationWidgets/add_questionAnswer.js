define([
    "dojo/_base/lang",
    "js/storage",
    "js/panelBuilder/translate"
], function(
    lang,
    storage,
    translate
){
    "use strict";
    
    function div_for_value(value) {
        if (value === undefined || value === null) value = "";
        return '<div class="narrafirma-questionAnswer">' + value + '</div>';
    }
    
    function calculate_questionAnswer(panelBuilder, model, referencedQuestionID) {
        // console.log("calculate_questionAnswer", panelBuilder, model, referencedQuestionID);
        var value = model.get(referencedQuestionID);
        if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            // throw new Error("ERROR: missing question: " + referencedQuestionID);  
            value = null;
        }
        
        // if (value === null) value = translate("#question_not_yet_answered|(Not yet answered)");
        if (value === null) value = "";
            
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
        
        // console.log("calculate_questionAnswer value", value);
        return div_for_value(value);
    }

    // TODO: This will not work when questions are on other pages with newer system
    function add_questionAnswer(panelBuilder, contentPane, model, fieldSpecification) {
        console.log("add_questionAnswer", fieldSpecification);
        var referencedQuestionID = fieldSpecification.displayConfiguration;
        if (!referencedQuestionID) throw new Error("missing referencedQuestionID for field: " + fieldSpecification.id + " all: " + JSON.stringify(fieldSpecification));

        var calculate = lang.partial(calculate_questionAnswer, panelBuilder, model, referencedQuestionID);
        
        var label = panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
        
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        
        // var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        
        /*
        var watcher = model.watch(referencedQuestionID, lang.hitch(panelBuilder, panelBuilder.updateLabelUsingCalculation, updateInfo));
        
        // Klugde to get the contentPane to free the watcher by calling remove when it is destroyed
        // This would not work if the content pane continued to exist when replacing this component
        contentPane.own(watcher);
        */
        
        // TODO: This should be updated periodically, like every 15 seconds via a heartbeat? Or should listen for server changes somehow?
        
        // Request the field for the project from the server, and update the status when ready
        storage.loadLatestValueForProjectField(referencedQuestionID, function(value) {
            console.log("add_questionAnswer server query result", value);
            var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": function() {return div_for_value(value);}};
            panelBuilder.updateLabelUsingCalculation(updateInfo);
        });
        
        return label;
    }

    return add_questionAnswer;
});