define([], function() {
    "use strict";
    return [
        {
            id: "page_collectionProcess",
            displayName: "Collection process",
            displayType: "page",
            isHeader: true,
            section: "collection_process",
            modelClass: "ProjectModel"
        },
        {
            id: "collectionProcessIntro",
            dataType: "none",
            displayType: "label",
            displayPrompt: "In the collection process phase of your PNI project, you will review incoming stories and enter records of story collection sessions."
        },
        {
            id: "project_generalNotes_collectionProcess",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Collection process notes",
            displayPrompt: "You can enter some general notes on your collection process in this project here."
        }
    ];
});
