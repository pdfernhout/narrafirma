import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import add_patternExplorer = require("./add_patternExplorer");

var storiesForCatalysisReport: Function = add_patternExplorer["storiesForCatalysisReport"];

"use strict";

function add_catalysisReportQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    console.log("add_catalysisReportQuestionChooser", model, fieldSpecification);
    
    var project = Globals.project();
    
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    var allStories = storiesForCatalysisReport(project.tripleStore, catalysisReportIdentifier);
    
    var allStoryQuestions = project.collectAllStoryQuestions();
    var allParticipantQuestions = project.collectAllParticipantQuestions();
    var allAnnotationQuestions = project.collectAllAnnotationQuestions();
    
    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }
    
    function countResponses(id) {
        var count = 0;
        allStories.forEach((story) => {
            var value = story.fieldValue(id);
            if (value !== undefined && value !== null && value !== {} && value !== "") count++;
        });
        return count;
    }
    
    function buildQuestionCheckbox(shortName, questionType, questionCategory): any {
        var id = questionCategory + shortName;
        if (questionType === "textarea" || (questionCategory !== "A_" && questionType === "text")) return [];
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, shortName),
            " (",
            countResponses(id),
            ")",
            m("br")
        ]);
    }
    
    // TODO: Translate
    return m("div", [
        prompt,
        m("div", ["Total number of stories: " + allStories.length]),
        m("div", [
            m("br"),
            "Story questions:",   
            allStoryQuestions.map((question) => {
                return buildQuestionCheckbox(question.storyQuestion_shortName, question.storyQuestion_type, "S_");
            }),
            allStoryQuestions.length ? [] : "[No questions]",
            m("br"),
            "Participant questions:", 
            allParticipantQuestions.map((question) => {
                return buildQuestionCheckbox(question.participantQuestion_shortName, question.participantQuestion_type, "P_");
            }),
            allParticipantQuestions.length ? [] : "[No questions]",
            m("br"),
            "Annotation questions:", 
            allAnnotationQuestions.map((question) => {
                return buildQuestionCheckbox(question.annotationQuestion_shortName, question.annotationQuestion_type, "A_");
            }),
            allAnnotationQuestions.length ? [] : m("div", "[No questions]")
        ])
    ]);
}

export = add_catalysisReportQuestionChooser;
