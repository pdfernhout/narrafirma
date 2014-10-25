"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "sensemakingSessionRecord_construction_name");
        widgets.add_select(contentPane, model, "sensemakingSessionRecord_construction_type", ["timeline","landscape","story elements","composite story","other"]);
        widgets.add_textarea(contentPane, model, "sensemakingSessionRecord_construction_description");
    }

    return {
        "id": "page_newSensemakingSessionConstruction",
        "name": "Sensemaking construction",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});