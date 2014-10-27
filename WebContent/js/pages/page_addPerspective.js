// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "perspective_name");
        widgets.add_textarea(contentPane, model, "perspective_description");
        widgets.add_annotationsGrid(contentPane, model, "perspective_linkedResultsList", ["page_annotateResultForPerspective"]);
        widgets.add_annotationsGrid(contentPane, model, "perspective_linkedExcerptsList", ["page_annotateExcerptForPerspective"]);
        widgets.add_annotationsGrid(contentPane, model, "perspective_linkedInterpretationsList", ["page_annotateInterpretationForPerspective"]);
    }

    var questions = [
        {"id":"perspective_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"perspective_description", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"perspective_linkedResultsList", "type":"annotationsGrid", "isReportable":true, "isHeader":false},
        {"id":"perspective_linkedExcerptsList", "type":"annotationsGrid", "isReportable":true, "isHeader":false},
        {"id":"perspective_linkedInterpretationsList", "type":"annotationsGrid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_addPerspective",
        "name": "Add or change perspective",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});