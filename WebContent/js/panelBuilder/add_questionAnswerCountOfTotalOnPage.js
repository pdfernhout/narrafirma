define([
    "dojo/_base/array",
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "dojo/_base/lang",
    "js/translate"
], function(
    array,
    at,
    ContentPane,
    lang,
    translate
){
    "use strict";
    
    // TODO: This list may get out of date relative to new widget type plugins -- need to think about it
    var entryTypes = [
        "boolean",
        "checkbox",
        "checkboxes",
        "text",
        "textarea", 
        "select",
        "radio",
        "slider",
        "toggleButton"
    ];
    
    function calculate_questionAnswerCountOfTotalOnPage(panelBuilder, model, panelID) {
        var panel = panelBuilder.panelDefinitionForPanelID(panelID);
        if (!panel) {
            console.log("ERROR: panel not found for: ", panelID);
            return "ERROR: panel not found for: " + panelID + " at: " + new Date();
        }
        // console.log("found panel", panel);
        var questionAskedCount = 0;
        var questionAnsweredCount = 0;
        for (var pageQuestionIndex in panel.questions) {
            var pageQuestion = panel.questions[pageQuestionIndex];
            // console.log("pageQuestion", pageQuestion);
            if (array.indexOf(entryTypes, pageQuestion.displayType) !== -1) {
                questionAskedCount++;
                var pageQuestionValue = model.get(pageQuestion.id);
                if (pageQuestionValue !== undefined && pageQuestionValue !== "" && pageQuestionValue !== null) questionAnsweredCount++;
            }
        }
        // var percentComplete = Math.round(100 * questionAnsweredCount / questionAskedCount);
        // if (questionAskedCount === 0) percentComplete = 0;
        var template = translate("#calculate_questionAnswerCountOfTotalOnPage_template");
        var response = template.replace("{{questionAnsweredCount}}", questionAnsweredCount).replace("{{questionAskedCount}}", questionAskedCount);
        return "<b>" + response + "</b>";
    }
    
    function add_questionAnswerCountOfTotalOnPage(panelBuilder, contentPane, model, fieldSpecification) {
        var panelID = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(calculate_questionAnswerCountOfTotalOnPage, panelBuilder, model, panelID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }

    return add_questionAnswerCountOfTotalOnPage;
});