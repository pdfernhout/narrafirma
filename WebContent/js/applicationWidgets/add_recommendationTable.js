define(["require", "exports", "../panelBuilder/dialogSupport", "../templates/recommendations", "../panelBuilder/translate", "dojox/layout/TableContainer"], function (require, exports, dialogSupport, recommendations, translate, TableContainer) {
    "use strict";
    function add_recommendationTable(panelBuilder, contentPane, model, fieldSpecification) {
        var dialogConfiguration = {
            dialogTitle: "#title_recommendationsTable|Recommendations table",
            dialogStyle: undefined,
            dialogConstructionFunction: build_recommendationTable.bind(null, panelBuilder),
            fieldSpecification: fieldSpecification
        };
        // TODO: Fix when refactor
        var button = dialogSupport.addButtonThatLaunchesDialog(contentPane, model, fieldSpecification, dialogConfiguration);
        return button;
    }
    function build_recommendationTable(panelBuilder, dialogContentPane, model, hideDialogCallback, dialogConfiguration) {
        var fieldSpecification = dialogConfiguration.fieldSpecification;
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(dialogContentPane, fieldSpecification);
        var categoryName = fieldSpecification.displayConfiguration;
        console.log("add_recommendationTable category", categoryName);
        var fieldsForCategory = recommendations.categories[categoryName];
        if (!fieldsForCategory) {
            console.log("ERROR: No data for recommendationTable category: ", categoryName);
            fieldsForCategory = [];
        }
        var table = new TableContainer({
            customClass: "wwsRecommendationsTable",
            cols: fieldsForCategory.length + 4 + 2,
            showLabels: false,
            spacing: 0
        });
        var recommendationsValues = [];
        var columnHeader1ContentPane = panelBuilder.newContentPane({ "content": "<i>Question</i>", "colspan": 4, "align": "right" });
        table.addChild(columnHeader1ContentPane);
        recommendationsValues.push(null);
        var columnHeader2ContentPane = panelBuilder.newContentPane({ "content": "<i>Your answer</i>", "colspan": 2, "align": "right" });
        table.addChild(columnHeader2ContentPane);
        recommendationsValues.push(null);
        for (var headerFieldIndex in fieldsForCategory) {
            var headerFieldName = fieldsForCategory[headerFieldIndex];
            var columnHeaderFieldContentPane = panelBuilder.newContentPane({ "content": "<i>" + headerFieldName + "</i>", "colspan": 1, "align": "right" });
            table.addChild(columnHeaderFieldContentPane);
            recommendationsValues.push(null);
        }
        function tagForRecommendationValue(recommendation) {
            if (recommendation === 1) {
                return "recommendationLow";
            }
            else if (recommendation === 2) {
                return "recommendationMedium";
            }
            else if (recommendation === 3) {
                return "recommendationHigh";
            }
            console.log("ERROR: Unexpected recommendation value", recommendation);
            return "";
        }
        for (var questionName in recommendations.questions) {
            // TODO: Possible should improve this translation default, maybe by retrieving fieldSpecification for question and getting displayPrompt?
            var questionText = translate(questionName + "::prompt", "Missing translation for: " + questionName);
            var yourAnswer = model.get(questionName);
            var questionTextContentPane = panelBuilder.newContentPane({ "content": questionText, "colspan": 4, "align": "right" });
            table.addChild(questionTextContentPane);
            recommendationsValues.push(null);
            var yourAnswerContentPane = panelBuilder.newContentPane({ "content": yourAnswer, "colspan": 2, "align": "right" });
            table.addChild(yourAnswerContentPane);
            recommendationsValues.push(null);
            var recommendationsForAnswer = recommendations.recommendations[questionName][yourAnswer];
            for (var fieldIndex in fieldsForCategory) {
                var fieldName = fieldsForCategory[fieldIndex];
                var recommendationNumber = Math.floor((Math.random() * 3) + 1);
                recommendationsValues.push(recommendationNumber);
                var recommendationValue = { 1: "risky", 2: "maybe", 3: "good" }[recommendationNumber];
                if (recommendationsForAnswer) {
                    var recommendationsForCategory = recommendationsForAnswer[categoryName];
                    if (recommendationsForCategory)
                        recommendationValue = recommendationsForCategory[fieldName];
                }
                var fieldContentPane = panelBuilder.newContentPane({ "content": "<i>" + recommendationValue + "</i>", "colspan": 1, "align": "right", "class": tagForRecommendationValue(recommendationNumber) });
                // TODO: Does not work as faster alternative: var fieldContentPane = domConstruct.create("span", {innerHTML: "<i>" + recommendationValue + "</i>", "colspan": 1, "align": "right", "class": tagForRecommendationValue(recommendationNumber)});
                table.addChild(fieldContentPane);
            }
        }
        table.placeAt(questionContentPane);
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
        var closeButtonSpecification = {
            id: "recommendationTableCloseButton",
            displayType: "button",
            displayName: "Close",
            displayPrompt: "Close",
            displayConfiguration: function () {
                hideDialogCallback();
            }
        };
        var closeButton = panelBuilder.buildField(dialogContentPane, model, closeButtonSpecification);
        return table;
    }
    return add_recommendationTable;
});
//# sourceMappingURL=add_recommendationTable.js.map