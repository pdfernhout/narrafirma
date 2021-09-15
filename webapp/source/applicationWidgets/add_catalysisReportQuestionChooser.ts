import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

function add_catalysisReportQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const project = Globals.project();
    const catalysisReportIdentifier = Globals.clientState().catalysisReportIdentifier();
    if (!catalysisReportIdentifier) return m("div", "Please select a catalysis report");
    
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    const storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);
    const allStories = project.storiesForCatalysisReport(catalysisReportIdentifier, true);
    const allStoryQuestions = project.storyQuestionsForCatalysisReport(catalysisReportIdentifier);
    const elicitingQuestions = project.elicitingQuestionsForCatalysisReport(catalysisReportIdentifier);
    const allParticipantQuestions = project.participantQuestionsForCatalysisReport(catalysisReportIdentifier);

    // annotation questions are not per questionnaire but global to the project (which is maybe not good?)
    // because annotation questions are global, they are not in the form the other questions are in (which are in the questionnaire)
    // so they must be converted
    const allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(project.collectAllAnnotationQuestions(), "A_");

    // show questions by type
    const nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

    const storyRatioQuestions = [];
    const storyTextQuestions = [];
    const storyNominalQuestions = [];
    allStoryQuestions.forEach((question) => {
        if (question.displayType === "slider") {
            storyRatioQuestions.push(question);
        } else if (question.displayType === "text" || question.displayType === "textarea") {
            storyTextQuestions.push(question);
        } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            storyNominalQuestions.push(question);
        }
    });

    const participantRatioQuestions = [];
    const participantTextQuestions = [];
    const participantNominalQuestions = [];
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
        const map = storageFunction() || {};
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
        let count = theObject[fieldName] || 0;
        count++;
        theObject[fieldName] = count;
    }
    
    function bin(value) {
        let bin = Math.floor(value / 10);
        let high = bin * 10 + 9;
        if (bin >= 9) {
            bin = 9;
            high = 100;
        }
        const low = bin * 10;
        return "" + low + " - " + high;
    }
    
    function countAnswers(id, questionType) {
        const answerCounts = {};
        let answeredQuestionsCount = 0;
        let naCount = 0;
        allStories.forEach((story) => {
            const value = story.fieldValue(id);
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
                    for (let key in value) {
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
        
        const sortedAnswerCounts = {};
        Object.keys(answerCounts).sort().forEach((key) => {
            sortedAnswerCounts[key] = answerCounts[key];
        });
        
        return {
            answeredQuestionsCount: answeredQuestionsCount,
            answerCounts: sortedAnswerCounts
        };
    }
    
    function buildQuestionCheckbox(shortName, questionType, questionCategory): any {
        const id = questionCategory + shortName;
        // now including text questions
        if (questionType === "label" || (questionType === "header")) return [];
        
        // if (questionType === "textarea" || (questionCategory !== "A_" && questionType === "text")) return [];
        const counts = countAnswers(id, questionType);
        const answersHover = shortName + " (" + questionType + ") has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        
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
        const id = "elicitingQuestion";
        const counts = countAnswers(id, "select");
        const answersHover = id + " has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        return m("div", {title: answersHover}, [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Eliciting question"),
            m("br")
        ]);
    }
    
    function buildQuestionCheckboxSpecialForNumStoriesTold(): any {
        const id = "numStoriesTold";
        const counts = countAnswers(id, "select");
        const answersHover = id + " has " + counts.answeredQuestionsCount + " answers:\n" + JSON.stringify(counts.answerCounts, null, 2);
        return m("div", {title: answersHover}, [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Number of stories told"),
            m("br")
        ]);
    }
    
    function buildQuestionCheckboxSpecialForStoryLength(): any {
        const id = "storyLength";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Story length"),
            m("br")
        ]);
    }

    function buildQuestionCheckboxSpecialForCollectionDate(): any {
        const id = "collectionDate";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Collection date"),
            m("br")
        ]);
    }

    function buildQuestionCheckboxSpecialForLanguage(): any {
        const id = "language";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Language"),
            m("br")
        ]);
    }

    function selectElements(displayTypes: any = null) {
        const map = {};
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
        if (!displayTypes) map["collectionDate"] = true;
        if (!displayTypes) map["language"] = true;
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

    function selectAllAdditionalQuestions() {
        const map = {};
        map["elicitingQuestion"] = true;
        map["numStoriesTold"] = true;
        map["storyLength"] = true;
        map["collectionDate"] = true;
        map["language"] = true;
        storageFunction(map); 
    }

    function selectAllStoryQuestions() {
        const map = {};
        allStoryQuestions.forEach((question) => {
            map["S_" + question.displayName] = true;
        });
        storageFunction(map);
    }
    
    function selectAllParticipantQuestions() {
        const map = {};
        allParticipantQuestions.forEach((question) => {
            map["P_" + question.displayName] = true;
        });
        storageFunction(map);
    }

    function selectAllAnnotationQuestions() {
        const map = {};
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
    thirdColumn.push(m("fieldset", [
        buildQuestionCheckboxSpecialForNumStoriesTold(), 
        buildQuestionCheckboxSpecialForStoryLength(), 
        buildQuestionCheckboxSpecialForCollectionDate(), 
        buildQuestionCheckboxSpecialForLanguage()
    ]));
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
        m("button", { onclick: selectAllAdditionalQuestions }, "Additional"),
        m("button", { onclick: clearAll }, "None"),
        m("br"),
        m("br"),
        m("div[style=margin-left:0.5em]", ["" + numBoxesChecked() + " questions selected; " + allStories.length + " stories"]),
        m("br")
        ]);

}

export = add_catalysisReportQuestionChooser;
