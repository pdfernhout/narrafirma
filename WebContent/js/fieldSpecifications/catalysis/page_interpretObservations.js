define([], function() {
    "use strict";
    return [
        {
            id: "page_interpretObservations",
            displayName: "Review and interpret observations",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "project_observationsDisplayList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_createOrEditObservation",
            displayName: "Catalysis observations",
            displayPrompt: "These are the observations you have collected from the\nbrowse, graph, and trends pages."
        }
    ];
});
