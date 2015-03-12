define([
    "./add_boolean",
    "./add_button",
    "./add_checkbox",
    "./add_checkboxes",
    "./add_grid",
    "./add_header",
    "./add_image",
    "./add_label",
    "./add_radiobuttons",
    "./add_select",
    "./add_slider",
    "./add_text",
    "./add_textarea",
    "./add_toggleButton",
    
    "dojo/_base/array",
    "./browser",
    "dojo/_base/declare",
    'dojo/dom-class',
    "dojo/_base/lang",
    "./translate",
    "dijit/layout/ContentPane"
], function(
    add_boolean,
    add_button,
    add_checkbox,
    add_checkboxes,
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
    lang,
    translate,
    ContentPane
){

"use strict";

// Users should call PanelBuilder.addStandardPlugins(); at the beginning of their application unless they add each plugin manually

// Developer local debug flag to cause an Exception if a widget type is missing instead of put in placeholder panel
var debugFailIfMissingWidgets = false;

// TODO: Need a better approach for calling JavaScript function than this
document.__narraFirma_launchApplication = browser.launchApplication;

// TODO: Think about where this goes!!!
// TODO: When do these get removed?  When page removed???
var questionsRequiringRecalculationOnPageChanges = {};

var buildingFunctions = {};

function addPlugin(name, callback) {
    buildingFunctions[name] = callback;
}

// This function needs to be called at the start of an application by users as a class method, like:"PanelBuilder.addStandardPlugins();"
function addStandardPlugins() {
    // standard plugins
    addPlugin("boolean", add_boolean);
    addPlugin("button", add_button);
    addPlugin("checkbox", add_checkbox);
    addPlugin("checkboxes", add_checkboxes);
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

// This class builds panels from question definitions
var PanelBuilder = declare(null, {

    constructor: function(kwArgs) {
        this.currentQuestionContentPane = null;
        this.currentInternalContentPane = null;
        this.panelSpecifications = null;
        this.buttonClickedCallback = null;
        
        lang.mixin(this, kwArgs);
    },
    
    // provide a way to find definitions needed to  build internal panels for some widgets like the GridWithItemPanel
    setPanelSpecifications: function(panelSpecifications) {
        this.panelSpecifications = panelSpecifications;
    },
    
    panelDefinitionForPanelID: function(panelID) {
        if (!this.panelSpecifications) {
            throw new Error("No panelSpecifications set in PanelBuilder so can not resolve panelID: " + panelID);
        }
        
        var panelSpecification;
        
        if (_.isFunction(this.panelDefinitions)) {
            panelSpecification = this.panelSpecifications(panelID);
        } else {
            panelSpecification = this.panelSpecifications[panelID];
        }
        
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
        if (!this.buttonClickedCallback) {
            console.log("No buttonClickedCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No buttonClickedCallback set for PanelBuilder");
        }
        this.buttonClickedCallback(this, contentPane, model, fieldSpecification, value);
    },
    
    // TODO: Perhaps should handle contentPane differently, since it is getting overwritten by these next three methods
    
    addMissingWidgetPlaceholder: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>Unsupported widget type: " + fieldSpecification.displayType + " for: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    addQuestionWidget: function(contentPane, model, fieldSpecification) {
        console.log("addQuestionWidget", fieldSpecification);
        
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
    
    // Returns dictionary mapping from question IDs to widgets
    addQuestions: function(questions, contentPane, model) {
        console.log("addQuestions", questions);
        if (!questions) {
            throw new Error("questions are not defined");
        }
        
        var widgets = {};
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var widget = this.addQuestionWidget(contentPane, model, question);
            widgets[question.id] = widget;
        }
        return widgets;
    },
    
    // Build an entire panel; panel can be either a string ID referring to a panel or it can be a panel definition itself
    buildPanel: function(panelOrPanelID, contentPane, model) {
        console.log("buildPanel", panelOrPanelID);
        var questions;
        if (lang.isString(panelOrPanelID)) {
            var panel = this.panelDefinitionForPanelID(panelOrPanelID);
            questions = panel.questions;
        } else if (panelOrPanelID.buildPanel) {
            // Call explicit constructor function
            return panelOrPanelID.buildPanel(this, contentPane, model);
        } else {
            questions = panelOrPanelID.questions;
        }
        this.addQuestions(questions, contentPane, model);
    },
    
    /// Suport functions
    
    helpPageURLForField: function(fieldSpecification) {
        var section = fieldSpecification.helpSection;
        var pageID = fieldSpecification.helpPage;
        console.log("helpPageURLForField", fieldSpecification, section, pageID);
        var url = "";   
        if (section && pageID) {
            url = '/help/' + section + "/help_" + pageID + '.html';
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
            iconFile:'/images/Information_icon4.svg',
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
          
    ////// Support for questions that recalculate based on other questions
    
    updateLabelUsingCalculation: function(data) {
        // console.log("recalculating label", data);
        if (!data) {
            throw new Error("updateLabelUsingCalculation: data should not be empty");
        }
        if (!_.isFunction(data.calculate)) {
            throw new Error("updateLabelUsingCalculation: data.calculate should be a function: " + JSON.stringify(data));
        }
        var calculatedText = data.calculate();
        // console.log("calculatedText ", calculatedText);
        var newLabelText = data.baseText + " " + calculatedText; 
        data.label.set("content", newLabelText);
        // console.log("recalculated question: ", data.id, calculatedText);
    },
    
    // TODO: Make a version of this that can be more selective in updates
    updateQuestionsForPageChange: function() {
        for (var questionID in questionsRequiringRecalculationOnPageChanges) {
            var data = questionsRequiringRecalculationOnPageChanges[questionID];
            this.updateLabelUsingCalculation(data);
        }
    },

    _add_calculatedText: function(panelBuilder, contentPane, fieldSpecification, calculate) {
        // var calculatedText = "(Initializing...)";
        if (!calculate) {
            throw new Error("_add_calculatedText: calculate parameter should not be empty");
        }
        var calculatedText = calculate();
        var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var label = new ContentPane({
            content: baseText + calculatedText
        });
        label.placeAt(contentPane);
        
        // TODO: How do these updates get removed????
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        questionsRequiringRecalculationOnPageChanges[fieldSpecification.id] = updateInfo;

        return label;
    }
    
    });

    PanelBuilder.addPlugin = addPlugin;
    PanelBuilder.addStandardPlugins = addStandardPlugins;
    
    return PanelBuilder;
});