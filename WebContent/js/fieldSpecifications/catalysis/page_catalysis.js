define([], function() {
    "use strict";
    return [
        {
            id: "page_catalysis",
            displayName: "Catalysis",
            displayType: "page",
            isHeader: true,
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "catalysisIntro",
            dataType: "none",
            displayType: "label",
            displayPrompt: "In the catalysis phase of your PNI project, you will look for patterns\nand prepare materials for use in sensemaking."
        },
        {
            id: "project_generalNotes_catalysis",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Catalysis notes",
            displayPrompt: "You can enter some general notes on catalysis in this project here."
        }
    ];
});
