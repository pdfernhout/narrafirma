// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"graphBrowserLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"graphBrowserDisplay", "type":"graphBrowser", "isInReport":true, "isGridColumn":false},
        {"id":"graphBrowserMockupLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_graphBrowser", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupGraphs.png"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_browseGraphs",
        "name": "Browse graphs",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});