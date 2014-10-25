"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_select(contentPane, model, "sensemakingSessionRecord_outcome_type", ["discovery","opportunity","issue","idea","recommendation","perspective","dilemma","other"]);
        widgets.add_text(contentPane, model, "sensemakingSessionRecord_outcome_name");
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_outcome_description");
    }

    return {
        "id": "page_newSensemakingSessionOutcome",
        "name": "Sensemaking session outcome",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});