define([], function() {
    "use strict";
    return [
        {
            id: "panel_addPresentationElement",
            displayName: "Add element to project presentation outline",
            displayType: "panel",
            section: "return",
            modelClass: "PresentationElementModel"
        },
        {
            id: "projectPresentationElement_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "What name would you like to give this element in your presentation?"
        },
        {
            id: "projectPresentationElement_statement",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "How would you like to describe this element in your presentation?"
        },
        {
            id: "projectPresentationElement_evidence",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Evidence",
            displayPrompt: "What evidence does this element present that your project met its goals?"
        },
        {
            id: "projectPresentationElement_QA",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Q&A",
            displayPrompt: "What questions do you anticipate about this element, and how would you like to answer them?"
        },
        {
            id: "projectPresentationElement_notes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any other notes you want to remember about this element as you present it."
        }
    ];
});
