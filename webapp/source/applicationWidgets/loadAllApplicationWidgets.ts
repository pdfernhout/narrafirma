import add_catalysisReportQuestionChooser = require("./add_catalysisReportQuestionChooser");
import add_printStoryCardsQuestionChooser = require("./add_printStoryCardsQuestionChooser");
import add_questionTypeChooser = require("./add_questionTypeChooser");
import add_translationDictionaryEditorPanel = require("./add_translationDictionaryEditorPanel");
import add_choiceQuestionAnswersManagementPanel = require("./add_choiceQuestionAnswersManagementPanel");
import add_checkboxQuestionConfigurationPanel = require("./add_checkboxQuestionConfigurationPanel");
import add_sliderQuestionConfigurationPanel = require("./add_sliderQuestionConfigurationPanel");
import add_shortNameQuestionConfigurationPanel = require("./add_shortNameQuestionConfigurationPanel");
import add_catalysisReportGraphTypesChooser = require("./add_catalysisReportGraphTypesChooser");
import add_catalysisReportPatternTableColumnsChooser = require("./add_catalysisReportPatternTableColumnsChooser");
import add_storyFormQuestionsChooser = require("./add_storyFormQuestionsChooser");
import add_catalysisReportFilterNotice = require("./add_catalysisReportFilterNotice");
import add_clusteringDiagram = require("./add_clusteringDiagram");
import add_dashboardStoryCollectionStatusDisplay = require("./add_dashboardStoryCollectionStatusDisplay");
import add_graphBrowser = require("./add_graphBrowser");
import add_annotationGraphBrowser = require("./add_annotationGraphBrowser");
import add_questionAnswer = require("./add_questionAnswer");
import add_quizScoreResult = require("./add_quizScoreResult");
import add_recommendationTable = require("./add_recommendationTable");
import add_storiesList = require("./add_storiesList");
import add_storyBrowser = require("./add_storyBrowser");
import add_storyAnnotationBrowser = require("./add_storyAnnotationBrowser");
import add_templateList = require("./add_templateList");
import add_patternExplorer = require("./add_patternExplorer");

"use strict";
    
function loadAllApplicationWidgets(PanelBuilder) {
    PanelBuilder.addPlugin("catalysisReportQuestionChooser", add_catalysisReportQuestionChooser);
    PanelBuilder.addPlugin("printStoryCardsQuestionChooser", add_printStoryCardsQuestionChooser);
    PanelBuilder.addPlugin("questionTypeChooser", add_questionTypeChooser);
    PanelBuilder.addPlugin("translationDictionaryEditorPanel", add_translationDictionaryEditorPanel);
    PanelBuilder.addPlugin("choiceQuestionAnswersManagementPanel", add_choiceQuestionAnswersManagementPanel);
    PanelBuilder.addPlugin("checkboxQuestionConfigurationPanel", add_checkboxQuestionConfigurationPanel);
    PanelBuilder.addPlugin("sliderQuestionConfigurationPanel", add_sliderQuestionConfigurationPanel);
    PanelBuilder.addPlugin("shortNameQuestionConfigurationPanel", add_shortNameQuestionConfigurationPanel);
    PanelBuilder.addPlugin("catalysisReportFilterNotice", add_catalysisReportFilterNotice);
    PanelBuilder.addPlugin("catalysisReportGraphTypesChooser", add_catalysisReportGraphTypesChooser);
    PanelBuilder.addPlugin("catalysisReportPatternTableColumnsChooser", add_catalysisReportPatternTableColumnsChooser);
    PanelBuilder.addPlugin("storyFormQuestionsChooser", add_storyFormQuestionsChooser);
    PanelBuilder.addPlugin("clusteringDiagram", add_clusteringDiagram);
    PanelBuilder.addPlugin("dashboardStoryCollectionStatusDisplay", add_dashboardStoryCollectionStatusDisplay);
    PanelBuilder.addPlugin("graphBrowser", add_graphBrowser);
    PanelBuilder.addPlugin("annotationGraphBrowser", add_annotationGraphBrowser);
    PanelBuilder.addPlugin("questionAnswer", add_questionAnswer);
    PanelBuilder.addPlugin("quizScoreResult", add_quizScoreResult);
    PanelBuilder.addPlugin("recommendationTable", add_recommendationTable);
    PanelBuilder.addPlugin("storiesList", add_storiesList);
    PanelBuilder.addPlugin("storyBrowser", add_storyBrowser);
    PanelBuilder.addPlugin("storyAnnotationBrowser", add_storyAnnotationBrowser);
    PanelBuilder.addPlugin("templateList", add_templateList);
    PanelBuilder.addPlugin("patternExplorer", add_patternExplorer);
}

export = loadAllApplicationWidgets;
