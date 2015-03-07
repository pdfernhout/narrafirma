define([
    "dojox/mvc/at",
    "dijit/layout/ContentPane",
    "js/domain",
    "dojo/_base/lang",
    "js/translate"
], function(
    at,
    ContentPane,
    domain,
    lang,
    translate
){
    "use strict";
    
    function add_quizScoreResult(panelBuilder, contentPane, model, fieldSpecification) {
        var dependsOn = fieldSpecification.displayConfiguration;
        var calculate = lang.partial(domain.calculate_quizScoreResult, model, dependsOn);
     // TODO: Fix when refactor
        var label = panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        // Ensure this value is recalculated when dependent questions change by using watch
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // TODO: When do these watches get removed?
            // console.log("setting up watch on", questionID, "for", id, model);
         // TODO: Fix when refactor
            model.watch(questionID, lang.hitch(panelBuilder, panelBuilder.updateLabelUsingCalculation, updateInfo));
        }
        return label;
    }

    return add_quizScoreResult;
});