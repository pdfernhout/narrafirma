import dialogSupport = require("../panelBuilder/dialogSupport");
import recommendations = require("../templates/recommendations");
import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
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

function build_recommendationTable(panelBuilder: PanelBuilder, dialogConfiguration, hideDialogCallback) {
    var model = dialogConfiguration.dialogModel;
    var fieldSpecification = dialogConfiguration.fieldSpecification;
   
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    var categoryName = fieldSpecification.displayConfiguration;
    console.log("add_recommendationTable category", categoryName);
    
    var fieldsForCategory = recommendations.categories[categoryName];
    if (!fieldsForCategory) {
        console.log("ERROR: No data for recommendationTable category: ", categoryName);
        fieldsForCategory = [];
    }
    
    function tagForRecommendationValue(recommendation) {
        if (recommendation === 1) {
            return "recommendationLow";
        } else if (recommendation === 2) {
            return "recommendationMedium";
        } else if (recommendation === 3) {
            return "recommendationHigh";
        }
        console.log("ERROR: Unexpected recommendation value", recommendation);
        return "";
    }
    
    console.log("recommendations.questions", recommendations.questions);
    
    var table = m("table.recommendationsTable", 
      // Do the header
      m("tr", [[
          m("th", {colspan: 4, align: "right"}, m("i", "Question")),
          m("th", {colspan: 2, align: "right"}, m("i", "Your answer"))
      ], fieldsForCategory.map(function(headerFieldName) {
          return m("th", m("i", {colspan: 1, align: "right"}, headerFieldName));
      })]),
    
      // Now do one data row for each question considered in the recommendation
      // TODO: Maybe keys should be sorted somehow?
      Object.keys(recommendations.questions).map(function(questionName) {
          // TODO: Possible should improve this translation default, maybe by retrieving fieldSpecification for question and getting displayPrompt?
          var questionText = translate(questionName + "::prompt", questionName); // "Missing translation for: " + 
          var yourAnswer = panelBuilder.project.getFieldValue(questionName);
          var recommendationsForAnswer = recommendations.recommendations[questionName][yourAnswer];

          return m("tr", [[
              m("th", {colspan: 4, align: "right"}, questionText),
              m("th", {colspan: 2, align: "right"}, yourAnswer)
          ], fieldsForCategory.map(function(fieldName, index) {
              var recommendationNumber = Math.floor((Math.random() * 3) + 1);
              var recommendationValue = {1: "risky", 2: "maybe", 3: "good"}[recommendationNumber];
              // TODO: Need to understand this next section
              if (recommendationsForAnswer) {
                  var recommendationsForCategory = recommendationsForAnswer[categoryName];
                  if (recommendationsForCategory) recommendationValue = recommendationsForCategory[fieldName];
              }
              var theClass = tagForRecommendationValue(recommendationNumber);
              return m("td", {colspan: 1, align: "right", "class": theClass}, recommendationValue);
          })]);
      })
    );
    
    /*
    // TO DO WORKING HERE!!!! Experiment -- Trying to get full background color set for a cell
    for (var i = 0; i < recommendationsValues.length; i++) {
        var recommendation = recommendationsValues[i];
        // console.log("recommendation", i, recommendation);
        var tag = tagForRecommendationValue(recommendation);
        var widgets = query(".wwsRecommendationsTable-valueCell-" + i, table.domNode);
        if (widgets && widgets[0] && tag) widgets[0].className += " " + tag;
    }
    */
    
    // TODO: Set class on div
    return m("div", [
        prompt,
        table
    ]);
}

export = add_recommendationTable;
