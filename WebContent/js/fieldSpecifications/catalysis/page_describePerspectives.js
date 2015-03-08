define([], function() {
    "use strict";
    return [
        {
            id: "page_describePerspectives",
            displayName: "Describe perspectives",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "project_perspectivesLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will describe the perspectives that resulted from clustering\nyour interpretations."
        },
        {
            id: "project_perspectivesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addPerspective",
            displayName: "Catalysis perspectives",
            displayPrompt: "These are the perspectives you have created from interpretations."
        }
    ];
});
