define([], function() {
    "use strict";
    return [
        {
            id: "page_intervention",
            displayName: "Intervention",
            displayType: "page",
            isHeader: true,
            section: "intervention",
            modelClass: "ProjectModel"
        },
        {
            id: "interventionIntroLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "In the intervention phase of your PNI project, you will plan interventions and record information about them."
        },
        {
            id: "project_generalNotes_intervention",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Intervention notes",
            displayPrompt: "You can enter some general notes on intervention in this project here."
        }
    ];
});
