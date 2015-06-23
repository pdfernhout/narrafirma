import dialogSupport = require("../panelBuilder/dialogSupport");
import templates = require("../templates/templates");
import PanelBuilder = require("../panelBuilder/PanelBuilder");

"use strict";

function add_templateList(panelBuilder: PanelBuilder, contentPane, model, fieldSpecification) {
    var dialogConfiguration = {
        dialogTitle: "#title_chooseATemplate|Choose a template",
        dialogStyle: undefined, // "height: 1000px; width: 800px",
        dialogConstructionFunction: makeTemplateListChooser.bind(null, panelBuilder),
        fieldSpecification: fieldSpecification
    };
    var button = dialogSupport.addButtonThatLaunchesDialog(contentPane, model, fieldSpecification, dialogConfiguration);
    domClass.add(button.domNode, "narrafirma-template-button");
    return button;
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

function useButtonClicked(templateListChoice, model, hideDialogCallback, gridWithDetail, event) {
   console.log("useButtonClicked", gridWithDetail, event);
   var selectedTemplate = gridWithDetail.getSelectedItem();
   console.log("grid selectedTemplate", selectedTemplate);
   
   if (selectedTemplate) {
       // TODO: not sure whether to confirm?
       // TODO: Translate
       dialogSupport.confirm("Copy selected template '" + selectedTemplate.shortName + "' into question definition?", function () {
           if (templateListChoice === "elicitationQuestions") {
               model.elicitingQuestion_text = selectedTemplate.text || "";
               model.elicitingQuestion_shortName = selectedTemplate.shortName || "";
               // TODO: No data for type, and would need to copy over settings for checkboxes if such data existed
               // model.storyQuestion_type = selectedTemplate.text;
               model.elicitingQuestion_type = {};
           } else if (templateListChoice === "storyQuestions") {
               model.storyQuestion_text = selectedTemplate.text || "";
               model.storyQuestion_type = selectedTemplate.type || "";
               model.storyQuestion_shortName = selectedTemplate.shortName || "";
               model.storyQuestion_options = selectedTemplate.options || "";
           } else if (templateListChoice === "participantQuestions") {
               model.participantQuestion_text = selectedTemplate.text || "";
               model.participantQuestion_type = selectedTemplate.type || "";
               model.participantQuestion_shortName = selectedTemplate.shortName || "";
               model.participantQuestion_options = selectedTemplate.options || "";
           } else if (templateListChoice === "storyCollectionActivities") {
               model.collectionSessionActivity_name = selectedTemplate.shortName || "";
               model.collectionSessionActivity_type = selectedTemplate.type || "";
               model.collectionSessionActivity_plan = selectedTemplate.plan || "";
               model.collectionSessionActivity_optionalParts = selectedTemplate.optionalParts || "";
               model.collectionSessionActivity_duration = selectedTemplate.duration || "";
               model.collectionSessionActivity_recording = selectedTemplate.recording || "";
               model.collectionSessionActivity_materials = selectedTemplate.materials || "";
               model.collectionSessionActivity_spaces = selectedTemplate.spaces || "";
               model.collectionSessionActivity_facilitation = selectedTemplate.facilitation || "";
           } else if (templateListChoice === "sensemakingActivities") {
               model.sensemakingSessionPlan_activity_name = selectedTemplate.shortName || "";
               model.sensemakingSessionPlan_activity_type = selectedTemplate.type || "";
               model.sensemakingSessionPlan_activity_plan = selectedTemplate.plan || "";
               model.sensemakingSessionPlan_activity_optionalParts = selectedTemplate.optionalParts || "";
               model.sensemakingSessionPlan_activity_duration = selectedTemplate.duration || "";
               model.sensemakingSessionPlan_activity_recording = selectedTemplate.recording || "";
               model.sensemakingSessionPlan_activity_materials = selectedTemplate.materials || "";
               model.sensemakingSessionPlan_activity_spaces = selectedTemplate.spaces || "";
               model.sensemakingSessionPlan_activity_facilitation = selectedTemplate.facilitation || "";
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

function makeTemplateListChooser(panelBuilder: PanelBuilder, contentPane, model, hideDialogCallback, dialogConfiguration) {
    var fieldSpecification = dialogConfiguration.fieldSpecification;
   
    var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
    questionContentPane.set("style", "min-height: 400px; min-width: 600px; max-width: 900px");
    
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
    
    var dataStore = GridWithItemPanel["newMemoryTrackableStore"](templateQuestions, "id");
    
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
         builder.buildFields(pageQuestions, contentPane, model);
     }
     
     var itemPanelSpecification = {
         id: "page_template",
         displayType: "panel",
         isHeader: false,
         panelFields: pageQuestions,
         buildPanel: buildPanel
     };
    
    var customButtonDefinition = {
        id: "useTemplate",
        customButtonLabel: "#button_UseTemplate|Use template",
        callback: useButtonClicked.bind(null, templateListChoice, model, hideDialogCallback)
    };
    
    var configuration = {viewButton: true, includeAllFields: false, showTooltip: true, customButton: customButtonDefinition};
    
    var grid = new GridWithItemPanel(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, itemPanelSpecification, configuration, model);

    var cancelButtonSpecification = {
        id: "templateChooserCancelButton",
        displayType: "button",
        displayName: "Cancel",
        displayPrompt: "Cancel",
        displayConfiguration: function() { hideDialogCallback(); }
    };
    var cancelButton = panelBuilder.buildField(model, cancelButtonSpecification);
}

export = add_templateList;
