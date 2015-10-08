import dialogSupport = require("../panelBuilder/dialogSupport");
import templates = require("../templates/templates");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import GridWithItemPanel = require("../panelBuilder/GridWithItemPanel");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

function add_templateList(panelBuilder: PanelBuilder, model, fieldSpecification) {
    var dialogConfiguration = {
        dialogModel: model,
        dialogTitle: "#title_chooseATemplate|Choose a template",
        dialogStyle: undefined, // "height: 1000px; width: 800px",
        dialogConstructionFunction: makeTemplateListChooser.bind(null, panelBuilder),
        dialogOKButtonLabel: "Cancel",
        fieldSpecification: fieldSpecification
    };
    
    return dialogSupport.addButtonThatLaunchesDialog(fieldSpecification, dialogConfiguration);
}

var add_templateList_elicitationQuestions = [
    {id: "category", valueType: "string", displayType: "text"},
    {id: "text", valueType: "string", displayType: "textarea"}
];

var add_templateList_storyOrParticipantQuestions = [
    {id: "category", valueType: "string", displayType: "text"},
    {id: "text", valueType: "string", displayType: "textarea"},
    {id: "type", valueType: "string", displayType: "text"}, 
    {id: "options", valueType: "string", displayType: "textarea"}
];

var add_templateList_activityQuestions = [
    {id: "shortName", valueType: "string", displayType: "text"},
    {id: "type", valueType: "string", displayType: "text"}, 
    {id: "duration", valueType: "string", displayType: "text"},
    {id: "plan", valueType: "string", displayType: "textarea"}
];

function useButtonClicked(panelBuilder: PanelBuilder, templateListChoice, model, hideDialogCallback, gridWithItemPanel: GridWithItemPanel) {
   // console.log("useButtonClicked", gridWithItemPanel);
   var selectedTemplate = gridWithItemPanel.getSelectedItem();
   // console.log("grid selectedTemplate", selectedTemplate);
    
    var storeValueInModel = Globals.project().tripleStore.makeModelFunction(model);
   
   if (selectedTemplate) {
       // TODO: not sure whether to confirm?
       // TODO: Translate
       dialogSupport.confirm("Copy selected template '" + selectedTemplate.shortName + "' into question definition?", function () {
           var uniqueName = selectedTemplate.shortName || selectedTemplate.id || "";
           if (templateListChoice === "elicitationQuestions") {
               storeValueInModel("elicitingQuestion_text", selectedTemplate.text || "");
               storeValueInModel("elicitingQuestion_shortName", uniqueName);
               // TODO: No data for type, and would need to copy over settings for checkboxes if such data existed
               // modelFunction("storyQuestion_type", selectedTemplate.text);
               storeValueInModel("elicitingQuestion_type", {});
           } else if (templateListChoice === "storyQuestions") {
               storeValueInModel("storyQuestion_text", selectedTemplate.text || "");
               storeValueInModel("storyQuestion_type", selectedTemplate.type || "");
               storeValueInModel("storyQuestion_shortName", uniqueName);
               storeValueInModel("storyQuestion_options", selectedTemplate.options || "");
           } else if (templateListChoice === "participantQuestions") {
               storeValueInModel("participantQuestion_text", selectedTemplate.text || "");
               storeValueInModel("participantQuestion_type", selectedTemplate.type || "");
               storeValueInModel("participantQuestion_shortName", uniqueName);
               storeValueInModel("participantQuestion_options", selectedTemplate.options || "");
           } else if (templateListChoice === "storyCollectionActivities") {
               storeValueInModel("collectionSessionActivity_name", uniqueName);
               storeValueInModel("collectionSessionActivity_type", selectedTemplate.type || "");
               storeValueInModel("collectionSessionActivity_plan", selectedTemplate.plan || "");
               storeValueInModel("collectionSessionActivity_optionalParts", selectedTemplate.optionalParts || "");
               storeValueInModel("collectionSessionActivity_duration", selectedTemplate.duration || "");
               storeValueInModel("collectionSessionActivity_recording", selectedTemplate.recording || "");
               storeValueInModel("collectionSessionActivity_materials", selectedTemplate.materials || "");
               storeValueInModel("collectionSessionActivity_spaces", selectedTemplate.spaces || "");
               storeValueInModel("collectionSessionActivity_facilitation", selectedTemplate.facilitation || "");
           } else if (templateListChoice === "sensemakingActivities") {
               storeValueInModel("sensemakingSessionPlan_activity_name", uniqueName);
               storeValueInModel("sensemakingSessionPlan_activity_type", selectedTemplate.type || "");
               storeValueInModel("sensemakingSessionPlan_activity_plan", selectedTemplate.plan || "");
               storeValueInModel("sensemakingSessionPlan_activity_optionalParts", selectedTemplate.optionalParts || "");
               storeValueInModel("sensemakingSessionPlan_activity_duration", selectedTemplate.duration || "");
               storeValueInModel("sensemakingSessionPlan_activity_recording", selectedTemplate.recording || "");
               storeValueInModel("sensemakingSessionPlan_activity_materials", selectedTemplate.materials || "");
               storeValueInModel("sensemakingSessionPlan_activity_spaces", selectedTemplate.spaces || "");
               storeValueInModel("sensemakingSessionPlan_activity_facilitation", selectedTemplate.facilitation || "");
           } else {
               var message = "ERROR: unsupported template type:" +  templateListChoice;
               console.log(message);
               alert(message);
           }
           // console.log("about to call hideDialogCallback");
           hideDialogCallback();
       });
   } else {
       // TODO: Translate
       alert("No template was selected");
   }
}

function makeTemplateListChooser(panelBuilder: PanelBuilder, dialogConfiguration, hideDialogCallback) {
    var fieldSpecification = dialogConfiguration.fieldSpecification;
   
    var prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    
    // TODO: questionContentPane.set("style", "min-height: 400px; min-width: 600px; max-width: 900px");
    
    var templateListChoice = fieldSpecification.displayConfiguration;
    // console.log("templateListChoice", templateListChoice);
    
    var templateCollection = templates[templateListChoice];
    // console.log("templateCollection", templateCollection);
    
    var templateQuestions;
    if (templateCollection) {
        templateQuestions = templateCollection.questions;
    } else {
        console.log("No templates defined yet for templateListChoice", templateListChoice);
        // alert("Unsupported templateListChoice: " + templateListChoice);
        templateQuestions = [];
    }
    
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

     function buildPanel(builder: PanelBuilder, model) {
         return builder.buildFields(pageQuestions, model);
     }
     
     var itemPanelSpecification = {
         id: "panel_template",
         modelClass: "Template",
         displayType: "panel",
         isHeader: false,
         panelFields: pageQuestions,
         buildPanel: buildPanel
     };
    
    var customButtonDefinition = {
        id: "useTemplate",
        customButtonLabel: "#button_UseTemplate|Use template",
        callback: useButtonClicked.bind(null, panelBuilder, templateListChoice, dialogConfiguration.dialogModel, hideDialogCallback)
    };
    
    var model = {templates: templateQuestions};
    
    var gridFieldSpecification = {
        id: "templates",
        displayConfiguration: {
            itemPanelSpecification: itemPanelSpecification,
            gridConfiguration: {
                idProperty: "id",
                columnsToDisplay: false,
                // viewButton: true,
                customButton: customButtonDefinition,
                navigationButtons: true
           }
        }
    };
 
    // TODO: Set class on div
    return m("div", [
        prompt,
        m.component(<any>GridWithItemPanel, {key: fieldSpecification.id + "_templatesListChooser", panelBuilder: panelBuilder, fieldSpecification: gridFieldSpecification, model: model})
        // m("button", {onclick: hideDialogCallback}, "Cancel")
    ]);
}

export = add_templateList;
