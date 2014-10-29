// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"venuesIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"venueRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["Venues"]},
        {"id":"venueRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_venues", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"venuesTable", "type":"questionsTable", "isInReport":true, "isGridColumn":false, "options":["page_venuesTable", "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_chooseCollectionVenues",
        "name": "Choose collection venues",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});