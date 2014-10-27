// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_questionsTable(contentPane, model, "outcomesTable", ["page_outcomesTable","participants_firstGroupName","participants_secondGroupName","participants_thirdGroupName"]);
    }

    var questions = [
        {"id":"outcomesTable", "type":"questionsTable", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_projectOutcomesForIntervention",
        "name": "Answer questions about project outcomes",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});