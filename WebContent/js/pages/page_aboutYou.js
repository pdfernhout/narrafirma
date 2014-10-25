"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_header(contentPane, model, "aspects_youHeader");
        widgets.add_select(contentPane, model, "aboutYou_experience", ["none","a little","some","a lot"]);
        widgets.add_select(contentPane, model, "aboutYou_help", ["none","a little","some","a lot"]);
        widgets.add_select(contentPane, model, "aboutYou_tech", ["none","a little","some","a lot"]);
    }

    return {
        "id": "page_aboutYou",
        "name": "About you",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});