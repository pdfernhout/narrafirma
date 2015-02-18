// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"webStoryCollection_stopCollectionLabel2", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_disableWebStoryFormAfterStoryCollectionButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["storyCollectionStop"]},
        {"id":"webStoryCollection_enabledTracker2", "type":"function", "isInReport":true, "isGridColumn":false, "options":["isStoryCollectingEnabled"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_stopStoryCollection",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});