import dialogSupport = require("../panelBuilder/dialogSupport");
import RecommendationsParser = require("../RecommendationsParser");
import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");

"use strict";

function add_recommendationTable(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var dialogConfiguration = {
        fieldSpecification: fieldSpecification,
        dialogModel: model,
        dialogTitle: "#title_recommendationsTable|Recommendations table",
        dialogStyle: undefined,
        dialogConstructionFunction: build_recommendationTable.bind(null, panelBuilder),
        dialogOKButtonLabel: "Close"
    };

    return dialogSupport.addButtonThatLaunchesDialog(fieldSpecification, dialogConfiguration);
}

    
function tagForRecommendationValue(recommendation) {
    if (recommendation === "no") {
        return "recommendationNo";
    } else if (recommendation === "maybe") {
        return "recommendationLow";
    } else if (recommendation === "good") {
        return "recommendationMedium";
    } else if (recommendation === "very good") {
        return "recommendationHigh";
    }
    console.log("ERROR: Unexpected recommendation value", recommendation);
    return "";
}

function makeTableForParticipantGroup(categoryName: string, project: Project, participantGroupIdentifier: string) {
    var recommendationsObject: RecommendationsParser = RecommendationsParser.recommendations();
    // recommendations -> Question -> Answer -> Category -> Option
    // console.log("recommendationsObject", recommendationsObject);
    
    var optionsForCategory = recommendationsObject.categories[categoryName];
    if (!optionsForCategory) {
        console.log("ERROR: No data for recommendationTable category: ", categoryName);
        optionsForCategory = [];
    }
    
    // console.log("recommendations.questions", recommendationsObject.questions);
    
    var table = m("table.recommendationsTable", 
        // Do the header
        m("tr", [[
            m("th", {colspan: 4, align: "right"}, m("i", "Question")),
            m("th", {colspan: 2, align: "right"}, m("i", "Your answer"))
        ], optionsForCategory.map(function(headerFieldName) {
            return m("th", m("i", {colspan: 1, align: "right"}, headerFieldName));
        })]),
    
        // Now do one data row for each question considered in the recommendation
        // TODO: Maybe keys should be sorted somehow?
        Object.keys(recommendationsObject.questions).map(function(questionName) {
            // TODO: Possible should improve this translation default, maybe by retrieving fieldSpecification for question and getting displayPrompt?
            var questionText = translate(questionName + "::shortName", questionName);
            
            var yourAnswer = project.tripleStore.queryLatestC(participantGroupIdentifier, questionName);
            if (yourAnswer === undefined) yourAnswer = project.getFieldValue(questionName);
            if (yourAnswer === undefined) yourAnswer = "";
            // console.log("questionName yourAnswer", questionName, yourAnswer);
            // Don't put rows where there is no answer
            if (!yourAnswer) return [];
            
            // Drill down into the recommentations if they exists for questioName, yourAnswer, and categoryName
            var recommendationsForAnswer = recommendationsObject.recommendations[questionName];
            if (recommendationsForAnswer) recommendationsForAnswer = recommendationsForAnswer[yourAnswer];
            if (recommendationsForAnswer) recommendationsForAnswer = recommendationsForAnswer[categoryName];
            
            return m("tr", [[
                m("th", {colspan: 4, align: "right"}, questionText),
                m("th", {colspan: 2, align: "right"}, yourAnswer)
            ], optionsForCategory.map(function(optionName, index) {
                var recommendationForOption = "???";
                if (recommendationsForAnswer) {
                    recommendationForOption = recommendationsForAnswer[optionName];
                } else {
                    console.log("Missing recommendations for", questionName, yourAnswer);
                }
                if (!recommendationForOption) recommendationForOption = "good";
                var theClass = tagForRecommendationValue(recommendationForOption);
                return m("td", {colspan: 1, align: "right", "class": theClass}, recommendationForOption);
            })]);
        })
    );
    
    return table;
}

function build_recommendationTable(panelBuilder: PanelBuilder, dialogConfiguration, hideDialogCallback) {
    var model = dialogConfiguration.dialogModel;
    var fieldSpecification = dialogConfiguration.fieldSpecification;
   
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var categoryName = fieldSpecification.displayConfiguration;
    // console.log("add_recommendationTable category", categoryName);
    
    // var recommendationsForTopic = recommendationsObject.recommendations[categoryName];
    
    var participantGroups = panelBuilder.project.getListForField("project_participantGroupsList");
    // TODO: Set class on div
    return m("div", [
        prompt,
        participantGroups.map(function (participantGroupIdentifier) {
            var participantGroupName = panelBuilder.project.tripleStore.queryLatestC(participantGroupIdentifier, "participantGroup_name");
            return m("div", [
                m("b", participantGroupName),
                m("br"),
                m("br"),
                makeTableForParticipantGroup(categoryName, panelBuilder.project, participantGroupIdentifier),
                m("br"),
                m("br")
            ]);
        })
    ]);
}

export = add_recommendationTable;
