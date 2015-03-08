define([], function() {
    "use strict";
    return [
        {
            id: "page_projectReport",
            displayName: "Project report",
            displayType: "page",
            isHeader: true,
            section: "project_report",
            modelClass: "ProjectModel"
        },
        {
            id: "wholeProjectReportLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "This report shows all of the information entered in all of the pages of this software."
        },
        {
            id: "projectReport",
            dataType: "none",
            displayType: "report",
            displayConfiguration: "project",
            displayPrompt: "Project report"
        }
    ];
});
