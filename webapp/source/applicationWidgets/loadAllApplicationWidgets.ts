import add_catalysisReportQuestionChooser = require("./add_catalysisReportQuestionChooser");
import add_clusteringDiagram = require("./add_clusteringDiagram");
import add_dashboardSectionStatusDisplay = require("./add_dashboardSectionStatusDisplay");
import add_dashboardStoryCollectionStatusDisplay = require("./add_dashboardStoryCollectionStatusDisplay");
import add_graphBrowser = require("./add_graphBrowser");
import add_questionAnswer = require("./add_questionAnswer");
import add_questionsTable = require("./add_questionsTable");
import add_quizScoreResult = require("./add_quizScoreResult");
import add_recommendationTable = require("./add_recommendationTable");
import add_report = require("./add_report");
import add_storiesList = require("./add_storiesList");
import add_storyBrowser = require("./add_storyBrowser");
import add_templateList = require("./add_templateList");
import add_patternExplorer = require("./add_patternExplorer");

"use strict";
    
function loadAllApplicationWidgets(PanelBuilder) {
    // plugins
    PanelBuilder.addPlugin("catalysisReportQuestionChooser", add_catalysisReportQuestionChooser);
    PanelBuilder.addPlugin("clusteringDiagram", add_clusteringDiagram);
    PanelBuilder.addPlugin("dashboardSectionStatusDisplay", add_dashboardSectionStatusDisplay);
    PanelBuilder.addPlugin("dashboardStoryCollectionStatusDisplay", add_dashboardStoryCollectionStatusDisplay);
    PanelBuilder.addPlugin("graphBrowser", add_graphBrowser);
    PanelBuilder.addPlugin("questionAnswer", add_questionAnswer);
    PanelBuilder.addPlugin("questionsTable", add_questionsTable);
    PanelBuilder.addPlugin("quizScoreResult", add_quizScoreResult);
    PanelBuilder.addPlugin("recommendationTable", add_recommendationTable);
    PanelBuilder.addPlugin("report", add_report);
    PanelBuilder.addPlugin("storiesList", add_storiesList);
    PanelBuilder.addPlugin("storyBrowser", add_storyBrowser);
    PanelBuilder.addPlugin("templateList", add_templateList);
    PanelBuilder.addPlugin("patternExplorer", add_patternExplorer);
}

export = loadAllApplicationWidgets;
