define([
    "dojo/_base/lang",
    "js/panelBuilder/translate"
], function(
    lang,
    translate
){
    "use strict";
    
    function calculate_quizScoreResult(panelSpecificationCollection, model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        if (!panelSpecificationCollection) return "ERROR in calculate_quizScoreResult: panelSpecificationCollection is not set";
        var total = 0;
        for (var dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
            var questionID = dependsOn[dependsOnIndex];
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                var choices = panelSpecificationCollection.getFieldSpecificationForFieldID(questionID).dataOptions;
                answerWeight = choices.indexOf(questionAnswer) - 1;
                // console.log("answerWeight", answerWeight);
                if (answerWeight < 0) answerWeight = 0;
                total += answerWeight;
            }
            // console.log("questionAnswer", questionID, questionAnswer, answerWeight, total);
        }
        var possibleTotal = dependsOn.length * 3;
        var percent = Math.round(100 * total / possibleTotal);
        var template = translate("#calculate_quizScoreResult_template", "{{total}} of a possible {{possibleTotal}} ({{percent}}%)");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
        return "<b>" + response + "</b>";
    }
    
    function add_quizScoreResult(panelBuilder, contentPane, model, fieldSpecification) {
        var dependsOn = fieldSpecification.displayConfiguration;
        var calculate = lang.partial(calculate_quizScoreResult, panelBuilder.panelSpecificationCollection, model, dependsOn);
     // TODO: Fix when refactor
        var label = panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        // Ensure this value is recalculated when dependent questions change by using watch
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // console.log("setting up watch on", questionID, "for", id, model);
         // TODO: Fix when refactor
            var watcher = model.watch(questionID, lang.hitch(panelBuilder, panelBuilder.updateLabelUsingCalculation, updateInfo));
            
            // Kludge to get the label to free the watcher by calling remove when it is destroyed
            label.own(watcher);
        }
        return label;
    }

    // Make this function available for report generation
    add_quizScoreResult.calculate_quizScoreResult = calculate_quizScoreResult;
    
    return add_quizScoreResult;
});