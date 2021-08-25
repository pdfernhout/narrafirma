import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

function add_catalysisReportQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var project = Globals.project();
    var catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);
    var allStories = project.storiesForCatalysisReport(catalysisReportIdentifier, true);
    var allStoryQuestions = project.storyQuestionsForCatalysisReport(catalysisReportIdentifier);
    var elicitingQuestions = project.elicitingQuestionsForCatalysisReport(catalysisReportIdentifier);
    var allParticipantQuestions = project.participantQuestionsForCatalysisReport(catalysisReportIdentifier);

    // annotation questions are not per questionnaire but global to the project (which is maybe not good?)
    // because annotation questions are global, they are not in the form the other questions are in (which are in the questionnaire)
    // so they must be converted
    var allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(project.collectAllAnnotationQuestions(), "A_");

    // show questions by type
    var nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

    var storyRatioQuestions = [];
    var storyTextQuestions = [];
    var storyNominalQuestions = [];
    allStoryQuestions.forEach((question) => {
        if (question.displayType === "slider") {
            storyRatioQuestions.push(question);
        } else if (question.displayType === "text" || question.displayType === "textarea") {
            storyTextQuestions.push(question);
        } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            storyNominalQuestions.push(question);
        }
    });

    var participantRatioQuestions = [];
    var participantTextQuestions = [];
    var participantNominalQuestions = [];
    allParticipantQuestions.forEach((question) => {
        if (question.displayType === "slider") {
            participantRatioQuestions.push(question);
        } else if (question.displayType === "text" || question.displayType === "textarea") {
            participantTextQuestions.push(question);
        } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            participantNominalQuestions.push(question);
        }
    });
    
    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (map === undefined) {
            return false;
        }
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }
    
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
            if (questionType == "boolean") {
                if (value) {
                    increment(answerCounts, "yes");
                } else {
                    increment(answerCounts, "no");
                }
                answeredQuestionsCount++;
            } else if (questionType == "checkbox") {
                if (value) {
                    increment(answerCounts, "true");
                } else {
                    increment(answerCounts, "false");
                }
                answeredQuestionsCount++;
            } else if (value !== undefined && value !== null && value !== {} && value !== "") {
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
        // now including text questions
        if (questionType === "label" || (questionType === "header")) return [];
        
        // if (questionType === "textarea" || (questionCategory !== "A_" && questionType === "text")) return [];
        var counts = countAnswers(id, questionType);
        var answersHover = shortName + " (" + questionType + ") has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        
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
    
    function buildQuestionCheckboxSpecialForElicitingQuestion(): any {
        var id = "elicitingQuestion";
        var counts = countAnswers(id, "select");
        var answersHover = id + " has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        
        return m("div", {title: answersHover}, [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Eliciting question"),
            m("br")
        ]);
    }
    
    function buildQuestionCheckboxSpecialForNumStoriesTold(): any {
        var id = "numStoriesTold";
        var counts = countAnswers(id, "select");
        var answersHover = id + " has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        
        return m("div", {title: answersHover}, [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Number of stories told"),
            m("br")
        ]);
    }
    
    function buildQuestionCheckboxSpecialForStoryLength(): any {
        var id = "storyLength";
        
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Story length"),
            m("br")
        ]);
    }

    function selectElements(displayTypes: any = null) {
        var map = {};
        if (elicitingQuestions) {
            elicitingQuestions.forEach((question) => {
                if (!displayTypes) map["elicitingQuestion"] = true;
            });
        }
        allStoryQuestions.forEach((question) => {
            if (!displayTypes || displayTypes.indexOf(question.displayType) >= 0) map["S_" + question.displayName] = true;
        });
        allParticipantQuestions.forEach((question) => {
            if (!displayTypes || displayTypes.indexOf(question.displayType) >= 0) map["P_" + question.displayName] = true;
        });
        allAnnotationQuestions.forEach((question) => {
            if (!displayTypes || displayTypes.indexOf(question.displayType) >= 0) map["A_" + question.displayName] = true;
        });
        if (!displayTypes) map["numStoriesTold"] = true;
        if (!displayTypes) map["storyLength"] = true;
        storageFunction(map);
    }

    function selectAll() {
        selectElements();
    }

    function selectAllScaleQuestions() {
        selectElements(["slider"]);
    }

    function selectAllChoiceQuestions() {
        selectElements(["select", "radiobuttons", "checkboxes"]);
    }
    
    function selectAllTextQuestions() {
        selectElements(["text", "textarea"]);
    }

    function selectAllStoryQuestions() {
        var map = {};
        allStoryQuestions.forEach((question) => {
            map["S_" + question.displayName] = true;
        });
        storageFunction(map);
    }
    
    function selectAllParticipantQuestions() {
        var map = {};
        allParticipantQuestions.forEach((question) => {
            map["P_" + question.displayName] = true;
        });
        storageFunction(map);
    }

    function selectAllAnnotationQuestions() {
        var map = {};
        allAnnotationQuestions.forEach((question) => {
            map["A_" + question.displayName] = true;
        });
        storageFunction(map);
    }

    function clearAll() {
        storageFunction({});
    }
    
    function numBoxesChecked() {
        const map = storageFunction();
        let result = 0;
        if (map) {
            Object.keys(map).forEach( function(item) {
                if (map[item]) result ++;
            });
        }
        return result;
    }

    // TODO: Translate

    let firstColumn = [];
    firstColumn.push(m("b", "Story questions"));
    firstColumn.push(m("br"));
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Scales"));
    firstColumn.push(m("fieldset", storyRatioQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");})));
    firstColumn.push(storyRatioQuestions.length ? [] : [m("i", " - none"), m("br")]);
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Choices"));
    firstColumn.push(m("fieldset", storyNominalQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");})));
    firstColumn.push(storyNominalQuestions.length ? [] : [m("i", " - none"), m("br")]);
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Texts"));
    firstColumn.push(m("fieldset", storyTextQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");})));
    firstColumn.push(storyTextQuestions.length ? [] : [m("i", " - none"), m("br")]);
    let firstColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, firstColumn);

    let secondColumn = [];
    secondColumn.push(m("b", "Participant questions"));
    secondColumn.push(m("br"));
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Scales"));
    secondColumn.push(m("fieldset", participantRatioQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");})));
    secondColumn.push(participantRatioQuestions.length ? [] : [m("i", " - none"), m("br")]);
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Choices"));
    secondColumn.push(m("fieldset", participantNominalQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");})));
    secondColumn.push(participantNominalQuestions.length ? [] : [m("i", " - none"), m("br")]);
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Texts"));
    secondColumn.push(m("fieldset", participantTextQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");})));
    secondColumn.push(participantTextQuestions.length ? [] : [m("i", " - none"), m("br")]);
    let secondColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, secondColumn);

    let thirdColumn = [];
    thirdColumn.push(m("b", "Annotation questions")); 
    thirdColumn.push(m("br"));
    thirdColumn.push(m("br"));
    thirdColumn.push(m("fieldset", allAnnotationQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "A_");})));
    thirdColumn.push(allAnnotationQuestions.length ? [] : [m("i", " - none"), m("br")]);
    thirdColumn.push(m("br"));
    thirdColumn.push(m("b", "Additional information"));
    thirdColumn.push(m("br"));
    thirdColumn.push(m("br"));
    if (elicitingQuestions) thirdColumn.push(m("fieldset", elicitingQuestions.map((question) => {return buildQuestionCheckboxSpecialForElicitingQuestion();})));
    thirdColumn.push(m("fieldset", [buildQuestionCheckboxSpecialForNumStoriesTold(), buildQuestionCheckboxSpecialForStoryLength()]));
    let thirdColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, thirdColumn);

    let table = m("table", {"class": "narrafirma-questions-chooser-table"}, m("tr", [firstColumnTD, secondColumnTD, thirdColumnTD]));

    return m("div.questionExternal", 
        [prompt, 
        m("div", table),
        m("span[style=margin-left: 0.5em]", "Select questions:"),
        m("button", { onclick: selectAll }, "All"),
        m("button", { onclick: selectAllStoryQuestions }, "Story"),
        m("button", { onclick: selectAllParticipantQuestions }, "Participant"),
        m("button", { onclick: selectAllAnnotationQuestions }, "Annotation"),
        m("button", { onclick: selectAllScaleQuestions }, "Scale"),
        m("button", { onclick: selectAllChoiceQuestions }, "Choice"),
        m("button", { onclick: selectAllTextQuestions }, "Text"),
        m("button", { onclick: clearAll }, "None"),
        m("br"),
        m("br"),
        m("div[style=margin-left:0.5em]", ["" + numBoxesChecked() + " questions selected; " + allStories.length + " stories"]),
        m("br")
        ]);

}

export = add_catalysisReportQuestionChooser;
