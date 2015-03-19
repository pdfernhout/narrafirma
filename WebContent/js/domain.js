// This supports globals shared by modules

define([
    "exports",
    "dojo/_base/lang",
    "dojo/Stateful",
    "js/panelBuilder/translate"
], function(
    exports,
    lang,
    Stateful,
    translate
) {
    "use strict";
    
    var domain = {
      // Initialize this here to make testing of domain easier without setupDomain being called
      projectAnswers: new Stateful()
    };
    
    function copyDraftPNIQuestionVersionsIntoAnswers() {
        var model = domain.projectAnswers;
            
        var finalQuestionIDs = [
            "project_pniQuestions_goal_final",
            "project_pniQuestions_relationships_final",
            "project_pniQuestions_focus_final",
            "project_pniQuestions_range_final",
            "project_pniQuestions_scope_final",
            "project_pniQuestions_emphasis_final"
        ];
        
        var copiedAnswersCount = 0;
        
        for (var index in finalQuestionIDs) {
            var finalQuestionID = finalQuestionIDs[index];
            var draftQuestionID = finalQuestionID.replace("_final", "_draft");
            // console.log("finalQuestionID/draftQuestionID", finalQuestionID, draftQuestionID);
            var finalValue = model.get(finalQuestionID);
            if (!finalValue) {
                var draftValue = model.get(draftQuestionID);
                if (draftValue) {
                    model.set(finalQuestionID, draftValue);
                    copiedAnswersCount++;
                }
            }
        }
        
        return copiedAnswersCount;
    }
    
    function calculate_quizScoreResult(model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        if (!domain.panelSpecificationCollection) return "ERROR: domain.panelSpecificationCollection is not set";
        var total = 0;
        for (var dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
            var questionID = dependsOn[dependsOnIndex];
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                var choices = domain.panelSpecificationCollection.getFieldSpecificationForFieldID(questionID).dataOptions;
                answerWeight = choices.indexOf(questionAnswer) - 1;
                // console.log("answerWeight", answerWeight);
                if (answerWeight < 0) answerWeight = 0;
                total += answerWeight;
            } else {
               // Nothing 
            }
            // console.log("questionAnswer", questionID, questionAnswer, answerWeight, total);
        }
        var possibleTotal = dependsOn.length * 3;
        var percent = Math.round(100 * total / possibleTotal);
        var template = translate("#calculate_quizScoreResult_template", "{{total}} of a possible {{possibleTotal}} ({{percent}}%)");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
        return "<b>" + response + "</b>";
    }

    // Application should call this at startup
    function setupDomain(panelSpecificationCollection) {
        var model = panelSpecificationCollection.buildModel("ProjectModel");
        
        domain.projectAnswers = new Stateful(model);

        var pages = panelSpecificationCollection.buildListOfPages();
        
        for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            var page = pages[pageIndex];
            if (!page.isHeader) {
                var pageID = page.id;
                domain.projectAnswers[pageID + "_pageStatus"] = null;
            }
        }
        
        /*
         Maybe this can be adapted for saving and loading individual pages?
        for (var fieldName in domain.projectAnswers) {
            var fieldValue = domain.projectAnswers[fieldName];
            if (fieldValue instanceof Array) {
                domain.projectAnswers[fieldName] = new StatefulArray(fieldValue);
            }
        }
        */
        
        console.log("setupDomain result: domain", domain);
    }

    var exportedFunctions = {
        "setupDomain": setupDomain,
            
        // data collected
        "projectAnswers": domain.projectAnswers,
        
        // functions called from page widgets
        "calculate_quizScoreResult": calculate_quizScoreResult,
        
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers
    };
    
    lang.mixin(exports, exportedFunctions);
});