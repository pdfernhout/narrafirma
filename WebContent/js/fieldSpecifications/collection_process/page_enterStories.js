define([], function() {
    "use strict";
    return [
        {
            id: "page_enterStories",
            displayName: "Enter stories",
            displayType: "page",
            section: "collection_process",
            modelClass: "ProjectModel"
        },
        {
            id: "printQuestionsForm_enterStories",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "enterSurveyResult",
            displayPrompt: "Enter survey result"
        }
    ];
});
