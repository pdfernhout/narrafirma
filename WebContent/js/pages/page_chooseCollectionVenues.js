// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "venuesIntro");
        widgets.add_recommendationTable(contentPane, model, "venueRecommendations", ["Venues"]);
        widgets.add_label(contentPane, model, "venueRecommendationsTable_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_venues", ["images/mockups/mockupRecTable.png"]);
        widgets.add_questionsTable(contentPane, model, "venuesTable", ["page_venuesTable","participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName"]);
    }

    var questions = [
        {"id":"venuesIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"venueRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false},
        {"id":"venueRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_venues", "type":"image", "isInReport":true, "isGridColumn":false},
        {"id":"venuesTable", "type":"questionsTable", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_chooseCollectionVenues",
        "name": "Choose collection venues",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});