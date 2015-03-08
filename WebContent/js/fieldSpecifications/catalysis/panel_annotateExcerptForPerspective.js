define([], function() {
    "use strict";
    return [
        {
            id: "panel_annotateExcerptForPerspective",
            displayName: "Annotate excerpt for perspective",
            displayType: "panel",
            section: "catalysis",
            modelClass: "AnnotateExcerptForPerspectiveModel"
        },
        {
            id: "perspective_excerptLinkageNotes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes you want to remember about this excerpt with respect to this perspective."
        }
    ];
});
