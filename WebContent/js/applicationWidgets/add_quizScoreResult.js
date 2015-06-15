define(["require", "exports", "js/panelBuilder/translate"], function (require, exports, translate) {
    "use strict";
    function calculate_quizScoreResult(panelSpecificationCollection, model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        if (!panelSpecificationCollection)
            return "ERROR in calculate_quizScoreResult: panelSpecificationCollection is not set";
        var total = 0;
        for (var dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
            var questionID = dependsOn[dependsOnIndex];
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            var index = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                var choices = panelSpecificationCollection.getFieldSpecificationForFieldID(questionID).valueOptions;
                index = choices.indexOf(questionAnswer);
                if (index == choices.length - 1) {
                    answerWeight = 0;
                }
                else {
                    answerWeight = index;
                }
                // console.log("answerWeight", answerWeight);
                if (answerWeight < 0)
                    answerWeight = 0;
                total += answerWeight;
            }
        }
        var possibleTotal = dependsOn.length * 3;
        var percent = Math.round(100 * total / possibleTotal);
        var template = translate("#calculate_quizScoreResult_template", "{{total}} of {{possibleTotal}} ({{percent}}%)");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
        //return "<b>" + response + "</b>";
        return response;
    }
    function add_quizScoreResult(panelBuilder, contentPane, model, fieldSpecification) {
        var dependsOn = fieldSpecification.displayConfiguration;
        var calculate = calculate_quizScoreResult.bind(null, panelBuilder.panelSpecificationCollection, model, dependsOn);
        var label = panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var updateInfo = { "id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate };
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // console.log("setting up watch on", questionID, "for", id, model);
            var watcher = model.watch(questionID, panelBuilder.updateLabelUsingCalculation.bind(panelBuilder, updateInfo));
            // Kludge to get the label to free the watcher by calling remove when it is destroyed
            label.own(watcher);
        }
        return label;
    }
    // Make this function available for report generation
    add_quizScoreResult.calculate_quizScoreResult = calculate_quizScoreResult;
    return add_quizScoreResult;
});
