define([], function() {
    "use strict";
    return [
        {
            id: "panel_annotateResultForPerspective",
            displayName: "Annotate result for perspective",
            displayType: "panel",
            section: "catalysis",
            modelClass: "AnnotateResultForPerspectiveModel"
        },
        {
            id: "perspective_resultLinkageNotes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes you want to remember about this result with respect to this perspective."
        }
    ];
});
