"use strict";

define([
    "js/widgetBuilder"
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

    return {
        "id": "page_chooseCollectionVenues",
        "name": "Choose collection venues",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});