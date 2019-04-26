import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

function add_printStoryCardsQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    
    var project = Globals.project();
    var storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) return m("div", "Please select a story collection.");
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    var storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    var allStoryQuestions = project.storyQuestionsForStoryCollection(storyCollectionName);
    var elicitingQuestions = [project.elicitingQuestionForStoryCollection(storyCollectionName)];
    var allParticipantQuestions = project.participantQuestionsForStoryCollection(storyCollectionName);
    var allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(project.collectAllAnnotationQuestions(), "A_");
    
    function isChecked(shortName, value = undefined) {
        var map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }
    
    function buildQuestionCheckbox(shortName, questionType, questionCategory): any {
        var id = questionCategory + shortName;
        if (questionType === "label" || (questionType === "header")) return [];
        
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, shortName),
            m("br")
            ]);
    }
    
    function buildQuestionCheckboxSpecialForElicitingQuestion(): any {
        var id = "elicitingQuestion";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Eliciting question"),
            m("br")
        ]);
    }
    
    function buildQuestionCheckboxSpecialForNumStoriesTold(): any {
        var id = "numStoriesTold";
        return m("div", [
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
    
    function selectAll() {
        var map = {};
        elicitingQuestions.forEach((question) => {
            map["elicitingQuestion"] = true;
        });
        allStoryQuestions.forEach((question) => {
            map["S_" + question.displayName] = true;
        });
        allParticipantQuestions.forEach((question) => {
            map["P_" + question.displayName] = true;
        });
        allAnnotationQuestions.forEach((question) => {
            map["A_" + question.displayName] = true;
        });
        map["numStoriesTold"] = true;
        map["storyLength"] = true;
        storageFunction(map);
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
    
    function clearAll() {
        storageFunction({});
    }
    
    // TODO: Translate

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

    let firstColumn = [];
    firstColumn.push(m("b", "Story questions"));
    firstColumn.push(m("br"));
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Scales"));
    firstColumn.push(storyRatioQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");}));
    firstColumn.push(storyRatioQuestions.length ? [] : [m("i", " - none"), m("br")]);
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Choices"));
    firstColumn.push(storyNominalQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");}));
    firstColumn.push(storyNominalQuestions.length ? [] : [m("i", " - none"), m("br")]);
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Texts"));
    firstColumn.push(storyTextQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");}));
    firstColumn.push(storyTextQuestions.length ? [] : [m("i", " - none"), m("br")]);
    let firstColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, firstColumn);

    let secondColumn = [];
    secondColumn.push(m("b", "Participant questions"));
    secondColumn.push(m("br"));
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Scales"));
    secondColumn.push(participantRatioQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");}));
    secondColumn.push(participantRatioQuestions.length ? [] : [m("i", " - none"), m("br")]);
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Choices"));
    secondColumn.push(participantNominalQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");}));
    secondColumn.push(participantNominalQuestions.length ? [] : [m("i", " - none"), m("br")]);
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Texts"));
    secondColumn.push(participantTextQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");}));
    secondColumn.push(participantTextQuestions.length ? [] : [m("i", " - none"), m("br")]);
    let secondColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, secondColumn);

    let thirdColumn = [];
    thirdColumn.push(m("b", "Annotation questions")); 
    thirdColumn.push(m("br"));
    thirdColumn.push(m("br"));
    thirdColumn.push(allAnnotationQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "A_");}));
    thirdColumn.push(allAnnotationQuestions.length ? [] : [m("i", " - none"), m("br")]);
    thirdColumn.push(m("br"));
    thirdColumn.push(m("b", "Additional information"));
    thirdColumn.push(m("br"));
    thirdColumn.push(m("br"));
    thirdColumn.push(elicitingQuestions.map((question) => {return buildQuestionCheckboxSpecialForElicitingQuestion();}));
    thirdColumn.push(buildQuestionCheckboxSpecialForNumStoriesTold());
    thirdColumn.push(buildQuestionCheckboxSpecialForStoryLength());
    let thirdColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, thirdColumn);

    let table = m("table", {"class": "narrafirma-questions-chooser-table"}, m("tr", [firstColumnTD, secondColumnTD, thirdColumnTD]));

    return m("div.questionExternal", 
        [prompt, 
        m("div", table),
        m("br"),
        m("button", { onclick: selectAll }, "Select all"),
        m("button", { onclick: selectAllStoryQuestions }, "Select only story questions"),
        m("button", { onclick: selectAllParticipantQuestions }, "Select only participant questions"),
        m("button", { onclick: clearAll }, "Clear all"),
        m("br"),
        m("br"),
        ]);

}

export = add_printStoryCardsQuestionChooser;
