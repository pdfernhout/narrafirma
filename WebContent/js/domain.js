"use strict";

// This supports globals shared by modules

define([
    "js/pages/allPagesSummary",
    "dojo/_base/array",
    "exports",
    "dojox/mvc/getStateful",
    "dojo/_base/lang",
    "dijit/registry",
    "dojo/string",
    "js/translate",
    "dojo/Stateful",
    "dojox/mvc/StatefulArray"
], function(
    allPagesSummary,
    array,
    exports,
    getStateful,
    lang,
    registry,
    string,
    translate,
    Stateful,
    StatefulArray
) {
    var pageDefinitions = {};
    var questions = {};
    
    var exportedSurveyQuestions = [];
    var surveyResults = [];
    
    // TODO: Kludge for extra translations for testing -- code will add some things here, need better approach
    var extraTranslations = {
    };
    
    function countNumberOfVenuesChosen(question) {
        return "countNumberOfVenuesChosen UNFINISHED";
    }
    
    function callDashboardFunction(functionName, question) {
        if (functionName === "countNumberOfVenuesChosen") {
            return countNumberOfVenuesChosen(question);
        } else {
            console.log("TODO: callDashboardFunction ", functionName, question);
            return "callDashboardFunction UNFINISHED: " + functionName + " for: " + question.id;
        }
    }
    
    // Store page change callback to prevent circular reference when loading domain and question editor
    var pageChangeCallback = null;
    
    function setPageChangeCallback(pageChangeCallbackNewValue) {
        pageChangeCallback = pageChangeCallbackNewValue;
    }
    
    function copyDraftPNIQuestionVersionsIntoAnswers(contentPane, model, id, questionOptions, value) {
        var finalQuestionIDs = ["project_PNIquestions_goal_final", "project_PNIquestions_relationships_final",
                         "project_PNIquestions_focus_final", "project_PNIquestions_range_final",
                         "project_PNIquestions_scope_final", "project_PNIquestions_emphasis_final"];
        
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
        
        var template = translate("copyDraftPNIQuestion_template");
        var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
        alert(message);
    }
    
    function webStoryCollectionEnabled(contentPane, model, id, questionOptions, value) {
        // TODO: Overkill to recalculate them all...
        pageChangeCallback();
        // TODO
        console.log("TODO webStoryCollectionEnabled");
    }

    function disableWebStoryFormAfterStoryCollection(contentPane, model, id, questionOptions, value) {
        // TODO; Shut down the process....
        registry.byId("webStoryCollectionEnabled").set("checked", false);
        registry.byId("webStoryCollectionEnabled").set("value", false);
        console.log("updated webStoryCollectionEnabled to false", registry.byId("webStoryCollectionEnabled").get("value"));
        // TODO: Overkill to recalculate them all...
        pageChangeCallback();
        // TODO
        console.log("TODO webStoryCollectionEnabled");        
    }
      
    var buttonFunctions = {
        //"printStoryForm": printStoryForm,
        //"copyStoryFormURLDuringFinalize": copyStoryFormURLDuringFinalize,
        //"copyStoryFormURLDuringStart": copyStoryFormURLDuringStart,
        //"exportPresentationOutline": exportPresentationOutline,
        //"showHideCollectedStories": showHideCollectedStories,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "webStoryCollectionEnabled": webStoryCollectionEnabled,
        "disableWebStoryFormAfterStoryCollection": disableWebStoryFormAfterStoryCollection
    };
    
    // dispatch the button click
    function buttonClicked(contentPane, model, id, questionOptions, value) {
         console.log("buttonClicked", id, questionOptions);
         
         var functionName = id;
         if (questionOptions) {
             functionName = questionOptions[0];
         }
         
         var actualFunction = buttonFunctions[functionName];
         if (!actualFunction) {
             var message = "Unfinished handling for: " + id;
             console.log(message, contentPane, model, id, questionOptions, value);
             alert(message);
             return;
         } else {
             actualFunction(contentPane, model, id, questionOptions, value);
         }
    }
 
    ////
    var data = lang.clone(allPagesSummary.data);
    var pagesToGoWithHeaders = lang.clone(allPagesSummary.pagesToGoWithHeaders);
    
    for (var headerPageID in pagesToGoWithHeaders) {
        var pages = pagesToGoWithHeaders[headerPageID];
        for (var pageIndex in pages) {
            var pageID = pages[pageIndex];
            data[pageID + "_pageStatus"] = null;
        }
    }
    
    /*
    for (var fieldName in data) {
        var fieldValue = data[fieldName];
        if (fieldValue instanceof Array) {
            data[fieldName] = new StatefulArray(fieldValue);
        }
    }
    */
    
    // data = getStateful(data);
    data = new Stateful(data);
    console.log("domain data", data);
    
    function calculate_quizScoreResult(model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        var total = 0;
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // console.log("data", data);
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                answerWeight = questions[questionID].options.indexOf(questionAnswer) - 1;
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
        var template = translate("calculate_quizScoreResult_template");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", percent);
        return "<b>" + response + "</b>";
    }

    function calculate_report(model, headerPageID) {
        var report = "<br><br>";
        var pageList = pagesToGoWithHeaders[headerPageID];
        for (var pageIndex in pageList) {
            // Skip last report page in a section
            if (pageIndex === pageList.length - 1) break;
            var pageID = pageList[pageIndex];
            var pageDefinition = pageDefinitions[pageID];
            if (pageDefinition.type !== "page") continue;
            report += "<div>";
            report += "<i> *** " + translate(pageID + "::title") + "</i>  ***<br><br>";
            var questionsAnsweredCount = 0;
            var questions = pageDefinition.questions;
            for (var questionIndex in questions) {
                var question = questions[questionIndex];
                var value = data.get(question.id);
                if (question.type === "quizScoreResult") {
                    var dependsOn = question.options;
                    value = calculate_quizScoreResult(data, dependsOn);
                    // Don't count these as answered questions
                    questionsAnsweredCount--;
                }
                if (value && value.length !== 0) {
                    // console.log("value", value, value.length);
                    var shortName = translate(question.id + "::shortName", translate(question.id + "::prompt"));
                    var separator = ":";
                    var lastQuestionCharacter = shortName[shortName.length - 1];
                    if (lastQuestionCharacter === "?" || lastQuestionCharacter == "." || lastQuestionCharacter == ")") {
                        separator = "<br>";
                    } else if (lastQuestionCharacter === ":") {
                        separator = " ";
                    }
                    /* TODO: Translate -- Should translate some answers for some types...
                    if (question.type === "select" ...) {
                        value = translate(value);
                    }
                    */
                    var valueToDisplay = "";
                    if (value instanceof Array) {
                        for (var index in value) {
                            var item = value[index];
                            if (index !== "0") valueToDisplay += "<br>";
                            valueToDisplay += "&nbsp;&nbsp;&nbsp;&nbsp;" + JSON.stringify(item);
                        }
                    } else {
                        valueToDisplay += value;
                    }
                        
                    report += shortName + separator + " <b>" + valueToDisplay + "</b></br><br>";
                    questionsAnsweredCount++;
                }
            }
            
            if (questionsAnsweredCount === 0) report += translate("no_questions_answered_on_page");
            report += "</div><br>";
        }
        return report;
    }
    
    var exportedFunctions = {
        "data": data,
        "pagesToGoWithHeaders": pagesToGoWithHeaders,
        "questions": questions,
        "exportedSurveyQuestions": exportedSurveyQuestions,
        "surveyResults": surveyResults,
        "pageDefinitions": pageDefinitions,
        "callDashboardFunction": callDashboardFunction,
        "buttonClicked": buttonClicked,
        "setPageChangeCallback": setPageChangeCallback,
        "extraTranslations": extraTranslations,
        "calculate_report": calculate_report,
        "calculate_quizScoreResult": calculate_quizScoreResult
    };
    
    lang.mixin(exports, exportedFunctions);
});