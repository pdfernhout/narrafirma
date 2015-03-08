define([], function() {
    "use strict";
    return [
        {
            id: "page_readCollectionDesignReport",
            displayName: "Read collection design report",
            displayType: "page",
            section: "collection_design",
            modelClass: "ProjectModel"
        },
        {
            id: "project_readCollectionDesignReportIntroductionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "This report shows all of the information entered in the pages grouped under \"Collection design.\""
        },
        {
            id: "project_collectionDesignReport",
            dataType: "none",
            displayType: "report",
            displayConfiguration: "collectionDesign",
            displayPrompt: "Collection design report"
        }
    ];
});
