import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");

"use strict";

function add_catalysisReportQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    // console.log("add_catalysisReportQuestionChooser", model, fieldSpecification);
    
    var project = Globals.project();
    
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    var allStories = project.storiesForCatalysisReport(catalysisReportIdentifier);
    
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
    
    /*
    function countResponses(id) {
        var count = 0;
        allStories.forEach((story) => {
            var value = story.fieldValue(id);
            if (value !== undefined && value !== null && value !== {} && value !== "") count++;
        });
        return count;
    }
    */
    
    function increment(theObject, fieldName) {
        var count = theObject[fieldName] || 0;
        count++;
        theObject[fieldName] = count;
    }
    
    function bin(value) {
        var bin = Math.floor(value / 10);
        var high = bin * 10 + 9;
        if (bin >= 9) {
            bin = 9;
            high = 100;
        }
        var low = bin * 10;
        return "" + low + " - " + high;
    }
    
    function countAnswers(id, questionType) {
        var answerCounts = {};
        var answeredQuestionsCount = 0;
        var naCount = 0;
        allStories.forEach((story) => {
            var value = story.fieldValue(id);
            if (value !== undefined && value !== null && value !== {} && value !== "") {
                answeredQuestionsCount++;
                if (questionType === "slider") {
                    // Bin the sliders
                    increment(answerCounts, bin(value));
                } else if (typeof value === "string" || typeof value === "number") {
                    increment(answerCounts, value);
                } else {
                    for (var key in value) {
                        if (value[key]) {
                            increment(answerCounts, key);
                        }                   
                    }
                }
            } else {
                naCount++;
            }
        });
        if (naCount) answerCounts["{N/A}"] = naCount;
        
        var sortedAnswerCounts = {};
        Object.keys(answerCounts).sort().forEach((key) => {
            sortedAnswerCounts[key] = answerCounts[key];
        });
        
        return {
            answeredQuestionsCount: answeredQuestionsCount,
            answerCounts: sortedAnswerCounts
        };
    }
    
    function buildQuestionCheckbox(shortName, questionType, questionCategory): any {
        var id = questionCategory + shortName;
        if (questionType === "textarea" || (questionCategory !== "A_" && questionType === "text")) return [];
        var counts = countAnswers(id, questionType);
        var answersHover = id + " has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        
        return m("div", {title: answersHover}, [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, shortName),
            m("br")
            /*
            "^--- ",
            counts.answeredQuestionsCount,
            " answers: ",
            JSON.stringify(counts.answerCounts, null, 2),
            m("br"),
            m("br")
            */
        ]);
    }
    
    function selectAll() {
        var map = {};
        allStoryQuestions.forEach((question) => {
            map["S_" + question.storyQuestion_shortName] = true;
        });
        allParticipantQuestions.forEach((question) => {
            map["P_" + question.participantQuestion_shortName] = true;
        });
        allAnnotationQuestions.forEach((question) => {
            map["A_" + question.annotationQuestion_shortName] = true;
        });
        storageFunction(map);
    }
    
    function clearAll() {
        storageFunction({});
    }
    
    // TODO: Translate
    return m("div", [
        prompt,
        m("button", { onclick: selectAll }, "Select all"),
        m("button", { onclick: clearAll }, "Clear all"),
        m("br"),
        m("div", ["Total number of stories: " + allStories.length]),
        m("div", [
            m("br"),
            "Story questions:",
            m("br"),  
            allStoryQuestions.map((question) => {
                return buildQuestionCheckbox(question.storyQuestion_shortName, question.storyQuestion_type, "S_");
            }),
            allStoryQuestions.length ? [] : "[No questions]",
            m("br"),
            "Participant questions:",
            m("br"),
            allParticipantQuestions.map((question) => {
                return buildQuestionCheckbox(question.participantQuestion_shortName, question.participantQuestion_type, "P_");
            }),
            allParticipantQuestions.length ? [] : "[No questions]",
            m("br"),
            "Annotation questions:",
            m("br"),
            allAnnotationQuestions.map((question) => {
                return buildQuestionCheckbox(question.annotationQuestion_shortName, question.annotationQuestion_type, "A_");
            }),
            allAnnotationQuestions.length ? [] : m("div", "[No questions]")
        ])
    ]);
}

export = add_catalysisReportQuestionChooser;
