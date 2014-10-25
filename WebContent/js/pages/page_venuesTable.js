"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_select(contentPane, model, "venue_primaryForGroup_type", ["individual interviews","group interviews","peer interviews","group story sessions","surveys","journals","narrative incident reports","gleaned stories","other"]);
        widgets.add_textarea(contentPane, model, "venue_primaryForGroup_plans");
        widgets.add_select(contentPane, model, "venue_secondaryForGroup_type", ["individual interviews","group interviews","peer interviews","group story sessions","surveys","journals","narrative incident reports","gleaned stories","other"]);
        widgets.add_textarea(contentPane, model, "venue_secondaryForGroup_plans");
    }

    return {
        "id": "page_venuesTable",
        "name": "Aspects table",
        "type": "questionsTable",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});