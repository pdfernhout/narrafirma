define([
    "./add_accumulatedItemsGrid",
    "./add_annotationsGrid",
    "./add_clusteringDiagram",
    "./add_dashboardSectionStatusDisplay",
    "./add_excerptsList",
    "./add_graphBrowser",
    "./add_questionAnswer",
    "./add_questionsTable",
    "./add_quizScoreResult",
    "./add_recommendationTable",
    "./add_report",
    "./add_storiesList",
    "./add_storyBrowser",
    "./add_storyThemer",
    "./add_templateList",
    "./add_trendsReport"
], function(
    add_accumulatedItemsGrid,
    add_annotationsGrid,
    add_clusteringDiagram,
    add_dashboardSectionStatusDisplay,
    add_excerptsList,
    add_graphBrowser,
    add_questionAnswer,
    add_questionsTable,
    add_quizScoreResult,
    add_recommendationTable,
    add_report,
    add_storiesList,
    add_storyBrowser,
    add_storyThemer,
    add_templateList,
    add_trendsReport
){

"use strict";
    
    function loadAllApplicationWidgets(PanelBuilder) {
       
     // plugins
        PanelBuilder.addPlugin("accumulatedItemsGrid", add_accumulatedItemsGrid);
        PanelBuilder.addPlugin("annotationsGrid", add_annotationsGrid);
        PanelBuilder.addPlugin("clusteringDiagram", add_clusteringDiagram);
        PanelBuilder.addPlugin("dashboardSectionStatusDisplay", add_dashboardSectionStatusDisplay);
        PanelBuilder.addPlugin("excerptsList", add_excerptsList);
        PanelBuilder.addPlugin("graphBrowser", add_graphBrowser);
        PanelBuilder.addPlugin("questionAnswer", add_questionAnswer);
        PanelBuilder.addPlugin("questionsTable", add_questionsTable);
        PanelBuilder.addPlugin("quizScoreResult", add_quizScoreResult);
        PanelBuilder.addPlugin("recommendationTable", add_recommendationTable);
        PanelBuilder.addPlugin("report", add_report);
        PanelBuilder.addPlugin("storiesList", add_storiesList);
        PanelBuilder.addPlugin("storyBrowser", add_storyBrowser);
        PanelBuilder.addPlugin("storyThemer", add_storyThemer);
        PanelBuilder.addPlugin("templateList", add_templateList);
        PanelBuilder.addPlugin("trendsReport", add_trendsReport);
    }

    return loadAllApplicationWidgets;
});