"use strict";

define([
    "js/domain",
    "dojo/dom-construct",
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
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
    lang,
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
        // TODO: Remove this -- ONLY FOR TESTING
        domain.finalizeSurvey();
        
        var surveyDialog = null;
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        // question_editor.insertQuestionsIntoDiv(domain.exportedSurveyQuestions, form.containerNode);
        var surveyModel = new Stateful();
        
        var model = surveyModel;
        var contentPane = form.containerNode;
        
        console.log("domain.projectData", domain.projectData);
        var questions = [];

        // TODO: Title, logo
        // TODO: Improve
        // TODO: Check how many in list...
        var storySolicitationOuestion = domain.projectData.exportedSurveyQuestions.project_elicitingQuestionsList[0].elicitingQuestion_text;
        var startText = domain.projectData.exportedSurveyQuestions.questionForm_startText;
        var endText = domain.projectData.exportedSurveyQuestions.questionForm_endText;
        if (startText) questions.push({storyQuestion_shortName: "startText", storyQuestion_text: startText, storyQuestion_type: "label"});
        questions.push({storyQuestion_shortName: "story", storyQuestion_text: storySolicitationOuestion, storyQuestion_type: "textarea"});
        questions.push({storyQuestion_shortName: "name", storyQuestion_text: "Please give your story a name", storyQuestion_type: "text"});
        questions = questions.concat(domain.projectData.exportedSurveyQuestions.project_storyQuestionsList);
        questions = questions.concat(domain.projectData.exportedSurveyQuestions.project_participantQuestionsList);
        if (endText) questions.push({storyQuestion_shortName: "endText", storyQuestion_text: endText, storyQuestion_type: "label"});
        console.log("questions", questions);
        
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var id = question.storyQuestion_shortName || question.participantQuestion_shortName;
            var type = question.storyQuestion_type || question.participantQuestion_type;
            // TODO: What to set for initial values?
            // TODO: Improve how making model...
            // if (!(type in {label: 1, header: 1})) model.set(id, null);
            // TODO: Need better approach for translations; these could interfere with main application
            domain.extraTranslations[id + "::prompt"] = question.storyQuestion_text || question.participantQuestion_text;
            var options = [];
            var optionsString = question.storyQuestion_options || question.participantQuestion_options;
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