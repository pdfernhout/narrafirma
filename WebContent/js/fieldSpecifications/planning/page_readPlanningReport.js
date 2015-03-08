define([], function() {
    "use strict";
    return [
        {
            id: "page_readPlanningReport",
            displayName: "Read planning report",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "project_readPlanningReportIntroductionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "This report shows all of the information entered in the pages grouped under \"Planning.\""
        },
        {
            id: "project_planningReport",
            dataType: "none",
            displayType: "report",
            displayConfiguration: "planning",
            displayPrompt: "Project planning report"
        }
    ];
});
