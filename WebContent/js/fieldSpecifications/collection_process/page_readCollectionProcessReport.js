define([], function() {
    "use strict";
    return [
        {
            id: "page_readCollectionProcessReport",
            displayName: "Read collection process report",
            displayType: "page",
            section: "collection_process",
            modelClass: "ProjectModel"
        },
        {
            id: "project_collectionProcessReportLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "This report shows all of the information entered in the pages grouped under \"Collection process.\""
        },
        {
            id: "project_collectionProcessReport",
            dataType: "none",
            displayType: "report",
            displayConfiguration: "collectionProcess",
            displayPrompt: "Collection process report"
        }
    ];
});
