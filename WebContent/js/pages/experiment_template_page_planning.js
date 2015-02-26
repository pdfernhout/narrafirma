/*
    {
        "id": "page_planning",
        "name": "Planning",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "project_projectPlanningLabel",
                "text": "In the planning phase of your PNI project, you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_planning",
                "text": "You can enter some general notes on planning in this project here.",
                "shortText": "Project general notes",
                "type": "textarea"
            }
        ]
    },
*/

define([
    "js/widgetBuilder"
], function(
    widgetBuilder
){
    "use strict";

    function addWidgets(contentPane, model) {
    
        // TODO: Text would go into translation table...
        // "project_projectPlanningLabel": "In the planning phase of your PNI project, you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.",
        widgetBuilder.add_label(contentPane, "project_projectPlanningLabel", model);
        
        // "project_generalNotes_planning_prompt": "You can enter some general notes on planning in this project here.",
        // "project_generalNotes_planning_header": "Project general notes",
        widgetBuilder.add_textarea(contentPane, "project_generalNotes_planning", model);
    }
    
    return {
        "id": "page_planning",
        "name": "Planning",
        "isHeader": true,
        "addWidgets": addWidgets
    };
    
});