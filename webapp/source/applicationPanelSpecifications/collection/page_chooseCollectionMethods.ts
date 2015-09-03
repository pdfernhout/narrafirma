{
    "id": "page_chooseCollectionMethods",
    "displayName": "Choose collection methods",
    "displayType": "page",
    "section": "collection",
    "modelClass": "ChooseCollectionMethodsActivity",
    "panelFields": [
        {
            "id": "project_methodsIntro",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you will plan your story collection <strong>methods</strong>, or the ways you will collect stories."
        },
        {
            "id": "SPECIAL_methodRecommendations",
            "valueType": "none",
            "displayType": "recommendationTable",
            "displayConfiguration": "venues",
            "displayPrompt": "Method recommendations"
        },
        {
            "id": "project_methodsList",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": "panel_addStoryCollectionMethod",
            "displayName": "Story collection methods",
            "displayPrompt": "These are the ways you will be collecting stories."
        }
    ]
}