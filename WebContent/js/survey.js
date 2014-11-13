"use strict";

define([
    "js/domain",
    "dojo/dom-construct",
    "dojox/mvc/getPlainValue",
    "js/utility",
    "js/widgetBuilder",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form",
    "dojo/Stateful"
], function(
    domain,
    domConstruct,
    getPlainValue,
    utility,
    widgetBuilder,
    ContentPane,
    Dialog,
    Form,
    Stateful
){
    function submitSurvey(model, form) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var surveyResult = getPlainValue(model);
        
        console.log("answers", surveyResult, model);
        domain.projectData.surveyResults.allCompletedSurveys.push(surveyResult);
        
        // var surveyResultsDiv = document.getElementById("surveyResultsDiv");
        // surveyResultsDiv.innerHTML = JSON.stringify(domain.surveyResults);
    }
    
    function takeSurvey() {
        var surveyDialog = null;
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        // question_editor.insertQuestionsIntoDiv(domain.exportedSurveyQuestions, form.containerNode);
        var surveyModel = new Stateful();
        
        var model = surveyModel;
        var contentPane = form.containerNode;
        
        console.log("domain.projectData", domain.projectData);
        var questions = domain.projectData.exportedSurveyQuestions.project_storyQuestionsList;
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var id = question.storyQuestion_shortName;
            var type = question.storyQuestion_type;
            // TODO: What to set for initial values?
            model.set(id, null);
            // TODO: Need better approach for translations; these could interfere with main application
            domain.extraTranslations[id + "::prompt"] = question.storyQuestion_text;
            var options = [];
            var optionsString = question.storyQuestion_options;
            if (optionsString) {
                var splitOptions = optionsString.split("\n");
                // Make sure options don't have leading or trailing space and are not otherwise blank
                for (var index in splitOptions) {
                    var trimmedOption = splitOptions[index].trim();
                    if (trimmedOption) {
                        options.push(trimmedOption);
                        domain.extraTranslations[id + "::selection:" + trimmedOption] = trimmedOption;
                    }
                }
            }
            var widget = widgetBuilder.addQuestionWidget(type, contentPane, model, id, options);
            // widgets[question.id] = widget;
        }
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        utility.newButton(undefined, "surveySubmit", form, function() {
            console.log("Submit survery");
            surveyDialog.hide();
            submitSurvey(model, form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        utility.newButton(undefined, "surveyCancel", form, function() {
            console.log("Cancel");
            surveyDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form,
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        surveyDialog.startup();
        surveyDialog.show();
    }
    
//    function createPage(tabContainer) {
//        // Take survey pane
//        
//        var takeSurveyPane = new ContentPane({
//            title: "Take survey"
//        });
//        
//        var pane = takeSurveyPane.containerNode;
//        var takeSurveyButton = widgets.newButton("Take survey", pane, takeSurvey);
//        pane.appendChild(document.createElement("br"));
//        pane.appendChild(domConstruct.toDom('Survey Results<br><div id="surveyResultsDiv"></div>'));
//        
//        tabContainer.addChild(takeSurveyPane);
//        takeSurveyPane.startup();
//    }

    return {
        takeSurvey: takeSurvey
    };
});