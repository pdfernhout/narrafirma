define([], function() {
    "use strict";
    return [
        {
            id: "page_chooseCollectionVenues",
            displayName: "Choose collection venues",
            displayType: "page",
            section: "collection_design",
            modelClass: "ProjectModel"
        },
        {
            id: "project_venuesIntro",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will plan your story collection venues, or the ways you will collect stories."
        },
        {
            id: "SPECIAL_venueRecommendations",
            dataType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "Venues",
            displayPrompt: "Venue recommendations"
        },
        {
            id: "project_venuesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addVenue",
            displayName: "Story collection venues",
            displayPrompt: "These are the ways you will be collecting stories."
        }
    ];
});
