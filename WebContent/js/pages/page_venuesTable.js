// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_select(contentPane, model, "venue_primaryForGroup_type", ["individual interviews","group interviews","peer interviews","group story sessions","surveys","journals","narrative incident reports","gleaned stories","other"]);
        widgets.add_textarea(contentPane, model, "venue_primaryForGroup_plans");
        widgets.add_select(contentPane, model, "venue_secondaryForGroup_type", ["individual interviews","group interviews","peer interviews","group story sessions","surveys","journals","narrative incident reports","gleaned stories","other"]);
        widgets.add_textarea(contentPane, model, "venue_secondaryForGroup_plans");
    }

    var questions = [
        {"id":"venue_primaryForGroup_type", "type":"select", "isInReport":true, "isGridColumn":false},
        {"id":"venue_primaryForGroup_plans", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"venue_secondaryForGroup_type", "type":"select", "isInReport":true, "isGridColumn":false},
        {"id":"venue_secondaryForGroup_plans", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_venuesTable",
        "name": "Aspects table",
        "type": "questionsTable",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});