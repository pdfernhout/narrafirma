// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"venue_primaryForGroup_type", "type":"select", "isInReport":true, "isGridColumn":false, "options":["individual interviews", "group interviews", "peer interviews", "group story sessions", "surveys", "journals", "narrative incident reports", "gleaned stories", "other"]},
        {"id":"venue_primaryForGroup_plans", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"venue_secondaryForGroup_type", "type":"select", "isInReport":true, "isGridColumn":false, "options":["individual interviews", "group interviews", "peer interviews", "group story sessions", "surveys", "journals", "narrative incident reports", "gleaned stories", "other"]},
        {"id":"venue_secondaryForGroup_plans", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_venuesTable",
        "name": "Aspects table",
        "type": "questionsTable",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});