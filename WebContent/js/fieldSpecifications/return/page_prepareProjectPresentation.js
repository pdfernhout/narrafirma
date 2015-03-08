define([], function() {
    "use strict";
    return [
        {
            id: "page_prepareProjectPresentation",
            displayName: "Prepare outline of project presentation",
            displayType: "page",
            section: "return",
            modelClass: "ProjectModel"
        },
        {
            id: "project_presentationLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can build a presentation about your project to show to others."
        },
        {
            id: "project_presentationElementsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addPresentationElement",
            displayName: "Presentation elements",
            displayPrompt: "There are elements (points of discussion) to present about your project."
        },
        {
            id: "projectPresentation_presentationLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "After you finish adding elements for your presentation, you can export the elements, open them in your word processor, and add material\nfrom any of the stage reports (or the final project report)."
        },
        {
            id: "projectPresentation_exportPresentationOutlineButton",
            dataType: "none",
            displayType: "button",
            displayPrompt: "Export these elements"
        }
    ];
});
