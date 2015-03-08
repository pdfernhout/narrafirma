define([], function() {
    "use strict";
    return [
        {
            id: "page_sensemaking",
            displayName: "Sensemaking",
            displayType: "page",
            isHeader: true,
            section: "sensemaking",
            modelClass: "ProjectModel"
        },
        {
            id: "sensemakingIntroLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "In the sensemaking phase of your PNI project, you will plan sensemaking sessions and record what happened in them."
        },
        {
            id: "project_generalNotes_sensemaking",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Sensemaking notes",
            displayPrompt: "You can enter some general notes on sensemaking in this project here."
        }
    ];
});
