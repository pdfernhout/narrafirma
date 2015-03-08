define([], function() {
    "use strict";
    return [
        {
            id: "page_reviewExcerpts",
            displayName: "Review excerpts",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "project_savedExcerptsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_createNewExcerpt",
            displayName: "Story excerpts",
            displayPrompt: "These are the story excerpts you have saved."
        }
    ];
});
