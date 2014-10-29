// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"collectionSessionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectionSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["collectionSessions"]},
        {"id":"collectionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_collection", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"project_collectionSessionPlansList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addStoryCollectionSession"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_planStoryCollectionSessions",
        "name": "Plan story collection sessions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});