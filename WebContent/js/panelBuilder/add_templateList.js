define([
    "./dialogSupport",
    "dojo/_base/lang",
    "js/templates/templates",
    "./gridTable",
    "dstore/Memory"
], function(
    dialogSupport,
    lang,
    templates,
    gridTable,
    MemoryDstore
){
    "use strict";

    function add_templateList(panelBuilder, contentPane, model, fieldSpecification) {
        var dialogConfiguration = {
            dialogContentPaneID: "templateList",
            dialogTitleID: "title_chooseATemplate",
            dialogStyle: "height: 900px",
            dialogConstructionFunction: lang.partial(makeTemplateListChooser, panelBuilder),
            fieldSpecification: fieldSpecification
        };
        var button = dialogSupport.addButtonThatLaunchesDialog(contentPane, model, fieldSpecification, dialogConfiguration);
        return button;
    }
    
    function makeTemplateListChooser(panelBuilder, contentPane, model, hideDialogCallback, dialogConfiguration) {
        var fieldSpecification = dialogConfiguration.fieldSpecification;
        
        // For add_templateList
        var add_templateList_elicitationQuestions = [
            {"id":"category", dataType: "string", "type":"text", "isInReport":true, "isGridColumn":true},
            {"id":"id", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true},
            {"id":"text", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true}
        ];
       
       var add_templateList_storyOrParticipantQuestions = [
            {"id":"category", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true},
            {"id":"id", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":false},
            {"id":"shortName", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true},
            {"id":"text", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
            {"id":"type", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true}, // , "options":["boolean", "label", "header", "checkbox", "checkboxes", "text", "textarea", "select", "radiobuttons", "slider"]},
            {"id":"options", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true}
            // {"id":"templateQuestion_help", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
        ];
       
       var add_templateList_activityQuestions = [
            {"id":"name", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true},
            {"id":"type", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true}, // , "options":["ice-breaker", "encountering stories (no task)", "encountering stories (simple task)", "discussing stories", "twice-told stories exercise", "timeline exercise", "landscape exercise", "story elements exercise", "composite stories exercise", "my own exercise", "other"]},
            {"id":"plan", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
            {"id":"optionalParts", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
            {"id":"duration", dataType: "string", "displayType":"text", "isInReport":true, "isGridColumn":true},
            {"id":"recording", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
            {"id":"materials", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
            {"id":"spaces", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true},
            {"id":"facilitation", dataType: "string", "displayType":"textarea", "isInReport":true, "isGridColumn":true}
        ];
       
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var templateListChoice = fieldSpecification.displayConfiguration;
        console.log("templateListChoice", templateListChoice);
        var templateCollection = templates[templateListChoice];
        console.log("templateCollection", templateCollection);
        
        var templateQuestions;
        if (templateCollection) {
            templateQuestions = templateCollection.questions;
        } else {
            console.log("No templates defined yet for templateListChoice", templateListChoice);
            // alert("Unsupported templateListChoice: " + templateListChoice);
            templateQuestions = [];
        }
        
        var dataStore = new MemoryDstore({
            data: templateQuestions,
            idProperty: "id"
        });
        
        var pageQuestions;
        
        if (templateListChoice === "elicitationQuestions") {
            pageQuestions = add_templateList_elicitationQuestions;
        } else if (templateListChoice === "storyQuestions" || templateListChoice === "participantQuestions") {
            pageQuestions = add_templateList_storyOrParticipantQuestions;
        } else if (templateListChoice === "storyCollectionActivities" || templateListChoice === "sensemakingActivities") {
            pageQuestions = add_templateList_activityQuestions;
        } else {
            var message = "ERROR: unsupported template type:" +  templateListChoice;
            console.log(message);
            alert(message);
            pageQuestions = [];
        }

         function buildPanel(builder, contentPane, model) {
             builder.addQuestions(pageQuestions, contentPane, model);
         }
         
         var popupPageDefinition = {
             "id": "page_template",
             "displayType": "popup",
             "isHeader": false,
             "questions": pageQuestions,
             "buildPanel": buildPanel
         };
                
        function useButtonClicked(gridWithDetail, event) {
            console.log("useButtonClicked", gridWithDetail, event);
            var selectedTemplate = gridWithDetail.getSelectedItem();
            console.log("grid selectedTemplate", selectedTemplate);
            
            if (selectedTemplate) {
                // TODO: not sure whether to confirm?
                // TODO: Translate
                dialogSupport.confirm("Copy selected template '" + selectedTemplate.id + "' into question definition?", function () {
                    if (templateListChoice === "elicitationQuestions") {
                        model.set("elicitingQuestion_text", selectedTemplate.text || "");
                        // Use the ID here instead of non-existent shortName
                        model.set("elicitingQuestion_shortName", selectedTemplate.id || "");
                        // TODO: No data for type, and would need to copy over settings for checkboxes if such data existed
                        // model.set("storyQuestion_type", selectedTemplate.text);
                        model.set("elicitingQuestion_type", {});
                    } else if (templateListChoice === "storyQuestions") {
                        model.set("storyQuestion_text", selectedTemplate.text || "");
                        model.set("storyQuestion_type", selectedTemplate.type || "");
                        model.set("storyQuestion_shortName", selectedTemplate.shortName || "");
                        model.set("storyQuestion_options", selectedTemplate.options || "");
                    } else if (templateListChoice === "participantQuestions") {
                        model.set("participantQuestion_text", selectedTemplate.text || "");
                        model.set("participantQuestion_type", selectedTemplate.type || "");
                        model.set("participantQuestion_shortName", selectedTemplate.shortName || "");
                        model.set("participantQuestion_options", selectedTemplate.options || "");
                    } else if (templateListChoice === "storyCollectionActivities") {
                        model.set("collectionSessionActivity_name", selectedTemplate.name || "");
                        model.set("collectionSessionActivity_type", selectedTemplate.type || "");
                        model.set("collectionSessionActivity_plan", selectedTemplate.plan || "");
                        model.set("collectionSessionActivity_optionalParts", selectedTemplate.optionalParts || "");
                        model.set("collectionSessionActivity_duration", selectedTemplate.duration || "");
                        model.set("collectionSessionActivity_recording", selectedTemplate.recording || "");
                        model.set("collectionSessionActivity_materials", selectedTemplate.materials || "");
                        model.set("collectionSessionActivity_spaces", selectedTemplate.spaces || "");
                        model.set("collectionSessionActivity_facilitation", selectedTemplate.facilitation || "");
                    } else if (templateListChoice === "sensemakingActivities") {
                        model.set("sensemakingSessionPlan_activity_name", selectedTemplate.name || "");
                        model.set("sensemakingSessionPlan_activity_type", selectedTemplate.type || "");
                        model.set("sensemakingSessionPlan_activity_plan", selectedTemplate.plan || "");
                        model.set("sensemakingSessionPlan_activity_optionalParts", selectedTemplate.optionalParts || "");
                        model.set("sensemakingSessionPlan_activity_duration", selectedTemplate.duration || "");
                        model.set("sensemakingSessionPlan_activity_recording", selectedTemplate.recording || "");
                        model.set("sensemakingSessionPlan_activity_materials", selectedTemplate.materials || "");
                        model.set("sensemakingSessionPlan_activity_spaces", selectedTemplate.spaces || "");
                        model.set("sensemakingSessionPlan_activity_facilitation", selectedTemplate.facilitation || "");
                    } else {
                        var message = "ERROR: unsupported template type:" +  templateListChoice;
                        console.log(message);
                        alert(message);
                    }
                    console.log("about to call hideDialogCallback");
                    hideDialogCallback();
                });
            } else {
                // TODO: Translate
                alert("No template was selected");
            }
        }
        
        var configuration = {viewButton: true, includeAllFields: false, showTooltip: true, customButton: {id: "useTemplate", translationID: "button_UseTemplate", callback: useButtonClicked}};
        return gridTable.insertGridTableBasic(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, popupPageDefinition, configuration);
    }
    
    return add_templateList;
});