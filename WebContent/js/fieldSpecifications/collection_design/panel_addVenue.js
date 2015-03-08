define([], function() {
    "use strict";
    return [
        {
            id: "panel_addVenue",
            displayName: "Plan story collection venue",
            displayType: "panel",
            section: "collection_design",
            modelClass: "VenueModel"
        },
        {
            id: "venue_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this venue plan a name."
        },
        {
            id: "venue_primary_type",
            dataType: "string",
            dataOptions: ["individual interviews","group interviews","peer interviews","group story sessions","surveys","journals","narrative incident reports","gleaned stories","other"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "Choose a primary means of story collection for this venue."
        },
        {
            id: "venue_participantGroups",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Participants",
            displayPrompt: "Which group(s) of participants will tell stories in this venue?"
        },
        {
            id: "venue_timeline",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Timeline",
            displayPrompt: "What is your timeline for collecting stories using this venue?"
        },
        {
            id: "venue_locations",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Locations",
            displayPrompt: "In what locations will stories be collected?"
        },
        {
            id: "venue_help",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Help",
            displayPrompt: "Will anyone be helping to collect stories? What are your plans for organizing your help?"
        },
        {
            id: "venue_resources",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Technology",
            displayPrompt: "What technologies, if any, will you use to collect stories?"
        },
        {
            id: "venue_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Describe any other details of your story collection plans for this venue."
        }
    ];
});
