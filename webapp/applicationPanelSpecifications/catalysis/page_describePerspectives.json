{
    "id": "page_describePerspectives",
    "displayName": "Describe perspectives",
    "displayType": "page",
    "section": "catalysis",
    "modelClass": "DescribePerspectivesActivity",
    "panelFields": [
        {
            "id": "project_perspectivesLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you will describe the perspectives that resulted from clustering\nyour interpretations."
        },
        {
            "id": "catalysisReportDescriptPerspectives",
            "valuePath": "/clientState/catalysisReportIdentifier",
            "valueType": "string",
            "valueOptions": "project_catalysisReports",
            "valueOptionsSubfield": "catalysisReport_shortName",
            "required": true,
            "displayType": "select",
            "displayName": "Catalysis report",
            "displayPrompt": "Choose a catalysis report to work on"
        },
        {
            "id": "project_perspectivesList",
            "valuePath": "/clientState/catalysisReportIdentifier",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": "panel_addPerspective",
            "displayName": "Catalysis perspectives",
            "displayPrompt": "These are the perspectives you have created from interpretations."
        }
    ]
}