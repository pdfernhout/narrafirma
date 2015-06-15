import add_accumulatedItemsGrid = require("./add_accumulatedItemsGrid");
import add_annotationsGrid = require("./add_annotationsGrid");
import add_clusteringDiagram = require("./add_clusteringDiagram");
import add_dashboardSectionStatusDisplay = require("./add_dashboardSectionStatusDisplay");
import add_excerptsList = require("./add_excerptsList");
import add_graphBrowser = require("./add_graphBrowser");
import add_questionAnswer = require("./add_questionAnswer");
import add_questionsTable = require("./add_questionsTable");
import add_quizScoreResult = require("./add_quizScoreResult");
import add_recommendationTable = require("./add_recommendationTable");
import add_report = require("./add_report");
import add_storiesList = require("./add_storiesList");
import add_storyBrowser = require("./add_storyBrowser");
import add_storyThemer = require("./add_storyThemer");
import add_templateList = require("./add_templateList");
import add_trendsReport = require("./add_trendsReport");

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

export = loadAllApplicationWidgets;
