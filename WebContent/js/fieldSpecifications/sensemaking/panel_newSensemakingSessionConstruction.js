define([], function() {
    "use strict";
    return [
        {
            id: "panel_newSensemakingSessionConstruction",
            displayName: "Sensemaking construction",
            displayType: "panel",
            section: "sensemaking",
            modelClass: "NewSensemakingSessionConstructionModel"
        },
        {
            id: "sensemakingSessionRecord_construction_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this construction a name."
        },
        {
            id: "sensemakingSessionRecord_construction_type",
            dataType: "string",
            dataOptions: ["timeline","landscape","story elements","composite story","other"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What type of construction is it?"
        },
        {
            id: "sensemakingSessionRecord_construction_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please describe the construction (or include a description given by participants).\nYour description can include links to images or documents."
        }
    ];
});
