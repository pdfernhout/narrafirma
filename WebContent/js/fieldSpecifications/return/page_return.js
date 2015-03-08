define([], function() {
    "use strict";
    return [
        {
            id: "page_return",
            displayName: "Return",
            displayType: "page",
            isHeader: true,
            section: "return",
            modelClass: "ProjectModel"
        },
        {
            id: "returnIntroLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "In the return phase of your PNI project, you will gather feedback, reflect on the project, possibly present\nthe project to someone, and help people with requests about the project."
        },
        {
            id: "project_generalNotes_return",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Return phase notes",
            displayPrompt: "You can enter some general notes on the return phase of this project here."
        }
    ];
});
