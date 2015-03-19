define([
    "./standardWidgets/add_boolean",
    "./standardWidgets/add_button",
    "./standardWidgets/add_checkbox",
    "./standardWidgets/add_checkboxes",
    "./standardWidgets/add_functionResult",
    "./standardWidgets/add_grid",
    "./standardWidgets/add_header",
    "./standardWidgets/add_image",
    "./standardWidgets/add_label",
    "./standardWidgets/add_radiobuttons",
    "./standardWidgets/add_select",
    "./standardWidgets/add_slider",
    "./standardWidgets/add_text",
    "./standardWidgets/add_textarea",
    "./standardWidgets/add_toggleButton",
    
    "dojo/_base/array",
    "./browser",
    "dojo/_base/declare",
    'dojo/dom-class',
    "dojo/dom-construct",
    "dojo/_base/lang",
    "./translate",
    "dijit/layout/ContentPane"
], function(
    add_boolean,
    add_button,
    add_checkbox,
    add_checkboxes,
    add_functionResult,
    add_grid,
    add_header,
    add_image,
    add_label,
    add_radiobuttons,
    add_select,
    add_slider,
    add_text,
    add_textarea,
    add_toggleButton,
    
    array,
    browser,
    declare,
    domClass,
    domConstruct,
    lang,
    translate,
    ContentPane
){

"use strict";

// Developer local debug flag to cause an Exception if a widget type is missing instead of put in placeholder panel
var debugFailIfMissingWidgets = false;

// This is the tag to put into prompting text for functionResult items where you want the result to go
var ResultTagToReplace = "{{result}}";

// TODO: Need a better approach for calling JavaScript function than this
document.__narraFirma_launchApplication = browser.launchApplication;

var buildingFunctions = {};

function addPlugin(name, callback) {
    buildingFunctions[name] = callback;
}

// TODO: Think about how to load plugins only as needed at runtime.
// Asynchronous callbacks are nice, until you realize you would need
// to refactor a lot to introduce one deep down in your application.
// In this case, it would be nice to load plugin functions only at runtime as panels require them.
// However, to use the AMD approach, that would mean everything that asked the builder
// to do anything would have to wait on a callback for the builder to finish.

function addStandardPlugins() {
    // standard plugins
    addPlugin("boolean", add_boolean);
    addPlugin("button", add_button);
    addPlugin("checkbox", add_checkbox);
    addPlugin("checkboxes", add_checkboxes);
    addPlugin("functionResult", add_functionResult);
    addPlugin("grid", add_grid);
    addPlugin("header", add_header);
    addPlugin("image", add_image);
    addPlugin("label", add_label);
    addPlugin("radiobuttons", add_radiobuttons);
    addPlugin("select", add_select);
    addPlugin("slider", add_slider);
    addPlugin("text", add_text);
    addPlugin("textarea", add_textarea);
    addPlugin("toggleButton", add_toggleButton);
}

// This class builds panels from field specifications.
// Field specifications define what widget to display and how to hook that widget to a model.
var PanelBuilder = declare(null, {

    constructor: function(kwArgs) {
        this.currentQuestionContentPane = null;
        this.currentInternalContentPane = null;
        this.panelSpecificationCollection = null;
        this.buttonClickedCallback = null;
        this.calculateFunctionResultCallback = null;
        this.currentHelpPage = null;
        this.currentHelpSection = null;
        this.applicationDirectory = "/";
        
        lang.mixin(this, kwArgs);
    },
    
    // provide a way to find definitions needed to  build internal panels for some widgets like the GridWithItemPanel
    setPanelSpecifications: function(panelSpecificationCollection) {
        this.panelSpecificationCollection = panelSpecificationCollection;
    },
    
    addMissingWidgetPlaceholder: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>Unsupported widget type: " + fieldSpecification.displayType + " for: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    buildField: function(contentPane, model, fieldSpecification) {
        console.log("buildField", fieldSpecification);
        
        var addFunction = buildingFunctions[fieldSpecification.displayType];
        if (!addFunction) {
            if (debugFailIfMissingWidgets) {
                // Would be thrown if you forget to call "PanelBuilder.addStandardPlugins();" or similar at the beginning of your application
                var error = "ERROR: unsupported field display type: " + fieldSpecification.displayType;
                console.log(error);
                throw new Error(error);
            }
            addFunction = lang.hitch(this, this.addMissingWidgetPlaceholder);
        }
        if (_.isString(addFunction)) { 
            var addFunctionName = addFunction;
            addFunction = this[addFunctionName];
            if (!addFunction) {
                var error2 = "ERROR: missing addFunction for: " + addFunctionName + " for field display type: " + fieldSpecification.displayType;
                console.log(error2);
                throw new Error(error2);
            }
        }
        
        return addFunction(this, contentPane, model, fieldSpecification);
    },
    
    // Returns dictionary mapping from field IDs to widgets
    buildFields: function(fieldSpecifications, contentPane, model) {
        console.log("buildFields", fieldSpecifications);
        if (!fieldSpecifications) {
            throw new Error("fieldSpecifications are not defined");
        }
        
        var widgets = {};
        for (var fieldSpecificationIndex in fieldSpecifications) {
            var fieldSpecification = fieldSpecifications[fieldSpecificationIndex];
            var widget = this.buildField(contentPane, model, fieldSpecification);
            widgets[fieldSpecification.id] = widget;
        }
        return widgets;
    },
    
    // Build an entire panel; panel can be either a string ID referring to a panel or it can be a panel definition itself
    buildPanel: function(panelOrPanelID, contentPane, model) {
        console.log("buildPanel", panelOrPanelID);
        var fieldSpecifications;
        if (lang.isString(panelOrPanelID)) {
            var panel = this.panelDefinitionForPanelID(panelOrPanelID);
            fieldSpecifications = panel.panelFields;
        } else if (panelOrPanelID.buildPanel) {
            // Call explicit constructor function
            return panelOrPanelID.buildPanel(this, contentPane, model);
        } else {
            fieldSpecifications = panelOrPanelID.panelFields;
        }
        return this.buildFields(fieldSpecifications, contentPane, model);
    },
    
    addHTML: function(contentPane, htmlText) {
       var node = domConstruct.toDom(htmlText);
       domConstruct.place(node, contentPane.domNode);
    },
    
    newContentPane: function(configuration) {
        if (!configuration) return new ContentPane();
        return new ContentPane(configuration);
    },
    
    // Set this correctly before building a page to provide default help when it is not in a field specification
    setCurrentHelpPageAndSection: function(helpPage, helpSection) {
        this.currentHelpPage = helpPage;
        this.currentHelpSection = helpSection;
    },

    /// Suport functions
    
    // TODO: Maybe rename this getPanelSpecificationForPanelID to match PanelSpecificationCollection?
    panelDefinitionForPanelID: function(panelID) {
        if (!this.panelSpecificationCollection) {
            throw new Error("No panelSpecificationCollection set in PanelBuilder so can not resolve panelID: " + panelID);
        }
        
        var panelSpecification = this.panelSpecificationCollection.getPanelSpecificationForPanelID(panelID);
        
        if (!panelSpecification) {
            throw new Error("No panelSpecification found by PanelBuilder for panelID: " + panelID);
        }
        
        console.log("panelDefinitionForPanelID", panelID, panelSpecification);
        return panelSpecification;
    },
    
    // Provide a way to tell buttons what to do when clicked
    setButtonClickedCallback: function(callback) {
        this.buttonClickedCallback = callback;
    },
    
    buttonClicked: function(contentPane, model, fieldSpecification, value) {
        if (_.isFunction(fieldSpecification.displayConfiguration)) {
            // Do callback; this can't be defined in JSON, but can be defined in an application
            fieldSpecification.displayConfiguration();
            return;
        }
        if (!this.buttonClickedCallback) {
            console.log("No buttonClickedCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No buttonClickedCallback set for PanelBuilder");
        }
        this.buttonClickedCallback(this, contentPane, model, fieldSpecification, value);
    },
    
    setCalculateFunctionResultCallback: function(callback) {
        this.calculateFunctionResultCallback = callback;
    },
    
    calculateFunctionResult: function(contentPane, model, fieldSpecification) {
        if (_.isFunction(fieldSpecification.displayConfiguration)) {
            // Do callback; this can't be defined in JSON, but can be defined in an application
            return fieldSpecification.displayConfiguration();
        }
        if (!this.calculateFunctionResultCallback) {
            console.log("No calculateFunctionResultCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No calculateFunctionResultCallback set for PanelBuilder");
        }
        return this.calculateFunctionResultCallback(this, contentPane, model, fieldSpecification, fieldSpecification.displayConfiguration);
    },
    
    // This will only be valid during the building process for a page
    helpPageURLForField: function(fieldSpecification) {
        var section = fieldSpecification.helpSection;
        if (!section) section = this.currentHelpSection;
        var pageID = fieldSpecification.helpPage;
        if (!pageID) pageID = this.currentHelpPage;
        var helpID = fieldSpecification.helpID;
        if (!helpID) helpID = fieldSpecification.id;
        console.log("helpPageURLForField", fieldSpecification, section, pageID, helpID);
        var url = "";   
        if (section && pageID) {
            url = '/help/' + section + "/help_" + pageID + '.html';
            if (helpID) url += '#' + helpID;
        }
        return url;
    },
                
    // TODO: Fix all this so attaching actual JavaScript function not text to be interpreted
    htmlForInformationIcon: function(url) {
        if (!url) return "";
        var template = '<img src="{iconFile}" height=16 width=16 title="{title}" onclick="document.__narraFirma_launchApplication(\'{url}\', \'help\')">';
        return lang.replace(template, {
            // TODO: Remove unused images from project
            // "/images/Info_blauw.png"
            // "/images/Blue_question_mark_icon.svg"
            iconFile: this.applicationDirectory + 'images/Information_icon4.svg',
            title: "Click to open help system window on this topic...",
            url: url
        });
    },
    
    createQuestionContentPaneWithPrompt: function(contentPane, fieldSpecification) {
        // triangle&#8227; 
        // double arrow &#187;
        // Arrow with hook &#8618;
        // Three rightwards arrows &#21F6; (doesn't work)
        // "*** " + 
        if (!fieldSpecification) throw new Error("null, undefined, or empty string for fieldSpecification");
        if (!fieldSpecification.id) throw new Error("null, undefined, or empty string for fieldSpecification id: " + JSON.stringify(fieldSpecification));
        
        var id = fieldSpecification.id;
   
        var questionContentPane = new ContentPane();
        
        domClass.add(questionContentPane.domNode, "questionExternal");
        questionContentPane.setAttribute("data-js-question-id", id);
        // questionContentPane.setAttribute("data-js-question-type", question.displayType);
        
        var questionText = translate(id + "::prompt", fieldSpecification.displayPrompt);
        // TODO: Fix the help that correct help actually pops up
        if (questionText) {
            var label = new ContentPane({
                content: this.htmlForInformationIcon(this.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + questionText
                });
            label.placeAt(questionContentPane);
        }
        
        questionContentPane.placeAt(contentPane);
        
        /* var helpWidget = add_button(questionContentPane, null, "button_help", [], function() {
            alert("Help!");
        });
        */
        
        var internalContentPane = new ContentPane();
        domClass.add(internalContentPane.domNode, "questionInternal");
        internalContentPane.placeAt(questionContentPane);
        
        this.currentQuestionContentPane = questionContentPane;
        this.currentInternalContentPane = internalContentPane;
        
        return internalContentPane;
    },
          
    ////// Support for fields that recalculate based on other fields
    
    updateLabelUsingCalculation: function(updateInfo) { 
        // console.log("recalculating label", data);
        if (!updateInfo) {
            throw new Error("updateLabelUsingCalculation: updateInfo should not be empty");
        }
        if (!_.isFunction(updateInfo.calculate)) {
            throw new Error("updateLabelUsingCalculation: updateInfo.calculate should be a function: " + JSON.stringify(updateInfo));
        }
        var calculatedText = updateInfo.calculate();
        // console.log("calculatedText ", calculatedText);
        var baseText = updateInfo.baseText;
        var newLabelText;
        if (baseText.indexOf(ResultTagToReplace) !== -1) {
            newLabelText = baseText.replace(ResultTagToReplace, calculatedText);
        } else {
            newLabelText = baseText + " " + calculatedText;
        }
        updateInfo.label.set("content", newLabelText);
        // console.log("recalculated label: ", updateInfo.id, calculatedText);
    },

    _add_calculatedText: function(panelBuilder, contentPane, fieldSpecification, calculate) {
        if (!calculate) {
            throw new Error("_add_calculatedText: calculate parameter should not be empty");
        }

        var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var label = new ContentPane();
        label.placeAt(contentPane);
        
        // TODO: How do these updates get removed????
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        label.updateInfo = updateInfo;
        
        this.updateLabelUsingCalculation(updateInfo);

        return label;
    }
    
    });

    PanelBuilder.addPlugin = addPlugin;

    addStandardPlugins();
    
    return PanelBuilder;
});