define([], function() {
    "use strict";
    return [
        {
            id: "page_planning",
            displayName: "Planning",
            displayType: "page",
            isHeader: true,
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "project_projectPlanningLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "In the planning phase of your PNI project, you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project."
        },
        {
            id: "project_generalNotes_planning",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Planning notes",
            displayPrompt: "You can enter some general notes on planning in this project here."
        }
    ];
});
