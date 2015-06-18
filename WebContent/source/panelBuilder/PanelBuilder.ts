import browser = require("./browser");
import declare = require("dojo/_base/declare");
import domClass = require('dojo/dom-class');
import domConstruct = require("dojo/dom-construct");
import translate = require("./translate");
import ContentPane = require("dijit/layout/ContentPane");
import surveyBuilder = require("../surveyBuilderMithril");

"use strict";

// Developer local debug flag to cause an Exception if a widget type is missing instead of put in placeholder panel
var debugFailIfMissingWidgets = false;

// This is the tag to put into prompting text for functionResult items where you want the result to go
var ResultTagToReplace = "{{result}}";

// TODO: Need a better approach for calling JavaScript function than this
window["narraFirma_launchApplication"] = browser.launchApplication;

// TODO: Think about how to load plugins only as needed at runtime.
// Asynchronous callbacks are nice, until you realize you would need
// to refactor a lot to introduce one deep down in your application.
// In this case, it would be nice to load plugin functions only at runtime as panels require them.
// However, to use the AMD approach, that would mean everything that asked the builder
// to do anything would have to wait on a callback for the builder to finish.

function addButton(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    if (!callback) callback = panelBuilder.buttonClicked.bind(panelBuilder, null, model, fieldSpecification);
 
    var options: any = {
        onclick: callback
    };
    
    if (fieldSpecification.displayClass) options.class = fieldSpecification.displayClass;
    if (fieldSpecification.displayIconClass) options.iconClass = fieldSpecification.displayIconClass;

    var button = m("button", options, translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt));

    // TODO: Improve the naming of displayPreventBreak, maybe by using displayConfiguration somehow, perhaps by changing the meaning of that field to something else

    if (fieldSpecification.displayPreventBreak) return button;
    return [button, m("br")];
}

function addHTML(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    return m.trust(fieldSpecification.displayPrompt);
}

function addImage(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    var imageSource = fieldSpecification.displayConfiguration;
    var questionText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt || "");

    return [
        m.trust(questionText),
        m("br"),
        m("img", {
            src: panelBuilder.applicationDirectory + imageSource,
            alt: "Image for question: " + questionText
        })
    ];
}

function addStandardPlugins() {
    // shared with survey builder
    var displayQuestion = surveyBuilder.displayQuestion;
    PanelBuilder.addPlugin("boolean", displayQuestion);
    PanelBuilder.addPlugin("checkbox", displayQuestion);
    PanelBuilder.addPlugin("checkboxes", displayQuestion);
    PanelBuilder.addPlugin("header", displayQuestion);
    PanelBuilder.addPlugin("label", displayQuestion);
    PanelBuilder.addPlugin("radiobuttons", displayQuestion);
    PanelBuilder.addPlugin("select", displayQuestion);
    PanelBuilder.addPlugin("slider", displayQuestion);
    PanelBuilder.addPlugin("text", displayQuestion);
    PanelBuilder.addPlugin("textarea", displayQuestion);
    
    // other
    PanelBuilder.addPlugin("button", addButton);
    
    PanelBuilder.addPlugin("functionResult", null);
    PanelBuilder.addPlugin("grid", null);
    PanelBuilder.addPlugin("html", addHTML);
    PanelBuilder.addPlugin("image", addImage);
}

var buildingFunctions = {};

// This class builds panels from field specifications.
// Field specifications define what widget to display and how to hook that widget to a model.
class PanelBuilder {
    currentQuestionContentPane = null;
    currentInternalContentPane = null;
    panelSpecificationCollection = null;
    buttonClickedCallback = null;
    calculateFunctionResultCallback = null;
    addHelpIcons = false;
    currentHelpPage = null;
    currentHelpSection = null;
    applicationDirectory = "/";
    
    // TODO: Maybe these should not be in builder?
    clientState = null;
    project = null;
    projectModel = null;

    constructor(kwArgs = {}) {
        
        for (var key in kwArgs) {
            this[key] = kwArgs[key];
        }
    }
    
    static addPlugin(name, callback) {
        buildingFunctions[name] = callback;
    }
    
    // provide a way to find definitions needed to  build internal panels for some widgets like the GridWithItemPanel
    setPanelSpecifications(panelSpecificationCollection) {
        this.panelSpecificationCollection = panelSpecificationCollection;
    }
    
    addMissingWidgetPlaceholder(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>Unsupported widget type: " + fieldSpecification.displayType + " for: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    buildField(contentPane, model, fieldSpecification) {
        // console.log("buildField", fieldSpecification);
        
        var addFunction = buildingFunctions[fieldSpecification.displayType];
        if (!addFunction) {
            if (debugFailIfMissingWidgets) {
                // Would be thrown if you forget to call "PanelBuilder.addStandardPlugins();" or similar at the beginning of your application
                var error = "ERROR: unsupported field display type: " + fieldSpecification.displayType;
                console.log(error);
                throw new Error(error);
            }
            addFunction = this.addMissingWidgetPlaceholder.bind(this);
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
        
        try {
            return addFunction(this, model, fieldSpecification);
        } catch (e) {
            console.log("Exception creating widget", fieldSpecification.id, e);
            return "Exception creating widget: " + fieldSpecification.id + " :: " + e;
        }
    }
    
    // Returns array of widgets built from the fieldSpecifications
    buildFields(fieldSpecifications, contentPane, model) {
        // console.log("buildFields", fieldSpecifications);
        if (!fieldSpecifications) {
            throw new Error("fieldSpecifications are not defined");
        }
        
        var fields = [];
        for (var fieldSpecificationIndex in fieldSpecifications) {
            var fieldSpecification = fieldSpecifications[fieldSpecificationIndex];
            var widget = this.buildField(contentPane, model, fieldSpecification);
            fields.push(widget);
        }
        return fields;
    }
    
    // Build an entire panel; panel can be either a string ID referring to a panel or it can be a panel definition itself
    buildPanel(panelOrPanelID, contentPane, model) {
        console.log("buildPanel", panelOrPanelID);
        var fieldSpecifications;
        if (_.isString(panelOrPanelID)) {
            var panel = this.getPanelDefinitionForPanelID(panelOrPanelID);
            fieldSpecifications = panel.panelFields;
        } else if (panelOrPanelID.buildPanel) {
            // Call explicit constructor function
            return panelOrPanelID.buildPanel(this, contentPane, model);
        } else {
            fieldSpecifications = panelOrPanelID.panelFields;
        }
        return this.buildFields(fieldSpecifications, contentPane, model);
    }
    
    addHTML(contentPane, htmlText) {
       var node = domConstruct.toDom(htmlText);
       domConstruct.place(node, contentPane.domNode);
    }
    
    newContentPane(configuration = null) {
        if (!configuration) return new ContentPane();
        return new ContentPane(configuration);
    }
    
    // Set this correctly before building a page to provide default help when it is not in a field specification
    setCurrentHelpPageAndSection(helpPage, helpSection) {
        this.currentHelpPage = helpPage;
        this.currentHelpSection = helpSection;
    }

    /// Suport functions
    
    getPanelDefinitionForPanelID(panelID) {
        if (!this.panelSpecificationCollection) {
            throw new Error("No panelSpecificationCollection set in PanelBuilder so can not resolve panelID: " + panelID);
        }
        
        var panelSpecification = this.panelSpecificationCollection.getPanelSpecificationForPanelID(panelID);
        
        if (!panelSpecification) {
            throw new Error("No panelSpecification found by PanelBuilder for panelID: " + panelID);
        }
        
        console.log("getPanelDefinitionForPanelID", panelID, panelSpecification);
        return panelSpecification;
    }
    
    // Convenience method for most common case of finding page specification
    getPageSpecificationForPageID(pageID) {
        if (!this.panelSpecificationCollection) {
            throw new Error("No panelSpecificationCollection set in PanelBuilder so can not resolve pageID: " + pageID);
        }
        
        var pageSpecification = this.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        
        if (!pageSpecification) {
            throw new Error("No pageSpecification found by PanelBuilder for pageID: " + pageID);
        }
        
        console.log("getPageSpecificationForPageID", pageID, pageSpecification);
        return pageSpecification;
    }
    
    // Provide a way to tell buttons what to do when clicked
    setButtonClickedCallback(callback) {
        this.buttonClickedCallback = callback;
    }
    
    buttonClicked(contentPane, model, fieldSpecification, event) {
        if (_.isFunction(fieldSpecification.displayConfiguration)) {
            // Do callback; this can't be defined in JSON, but can be defined in an application
            fieldSpecification.displayConfiguration();
            return;
        }
        if (!this.buttonClickedCallback) {
            console.log("No buttonClickedCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No buttonClickedCallback set for PanelBuilder");
        }
        this.buttonClickedCallback(this, contentPane, model, fieldSpecification, event);
    }
    
    setCalculateFunctionResultCallback(callback) {
        this.calculateFunctionResultCallback = callback;
    }
    
    calculateFunctionResult(contentPane, model, fieldSpecification) {
        if (_.isFunction(fieldSpecification.displayConfiguration)) {
            // Do callback; this can't be defined in JSON, but can be defined in an application
            return fieldSpecification.displayConfiguration();
        }
        if (!this.calculateFunctionResultCallback) {
            console.log("No calculateFunctionResultCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No calculateFunctionResultCallback set for PanelBuilder");
        }
        return this.calculateFunctionResultCallback(this, contentPane, model, fieldSpecification, fieldSpecification.displayConfiguration);
    }
    
    // This will only be valid during the building process for a page
    helpPageURLForField(fieldSpecification) {
        var section = fieldSpecification.helpSection;
        if (!section) section = this.currentHelpSection;
        var pageID = fieldSpecification.helpPage;
        if (!pageID) pageID = this.currentHelpPage;
        var helpID = fieldSpecification.helpID;
        if (!helpID) helpID = fieldSpecification.id;
        // console.log("helpPageURLForField", fieldSpecification, section, pageID, helpID);
        var url = "";   
        if (section && pageID) {
            url = '/help/' + section + "/help_" + pageID + '.html';
            if (helpID) url += '#' + helpID;
        }
        return url;
    }
                
    // TODO: Fix all this so attaching actual JavaScript function not text to be interpreted
    htmlForInformationIcon(url) {
        if (!url) return "";
        var template = '<img src="{iconFile}" height=16 width=16 title="{title}" onclick="window.narraFirma_launchApplication(\'{url}\', \'help\')">';
        var replacements = {
            // TODO: Remove unused images from project
            // "/images/Info_blauw.png"
            // "/images/Blue_question_mark_icon.svg"
            iconFile: this.applicationDirectory + 'images/Information_icon4.svg',
            title: "Click to open help system window on this topic...",
            url: url
        };
        
        function replace(template, values) {
            var result = template;
            for (var key in replacements) {
                result = result.split('{' + key + '}').join(replacements[key]);
                // result = result.replace(new RegExp('{' + key + '}', 'gi'), replacements[key]);
            }
            return result;
        }

        return replace(template, replacements);
    }
    
    createQuestionContentPaneWithPrompt(contentPane, fieldSpecification) {
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
        
        if (fieldSpecification.displayClass) {
        	domClass.add(questionContentPane.domNode, fieldSpecification.displayClass);
        }
        
        questionContentPane.setAttribute("data-js-question-id", id);
        // questionContentPane.setAttribute("data-js-question-type", question.displayType);
        
        var questionText = translate(id + "::prompt", fieldSpecification.displayPrompt);

        var content = questionText;
        if (this.addHelpIcons) {
            content = this.htmlForInformationIcon(this.helpPageURLForField(fieldSpecification)) + "&nbsp;&nbsp;" + content;
        }
        if (questionText) {
            var label = new ContentPane({
                content: content
            });
            label.placeAt(questionContentPane);
            domClass.add(label.domNode, "questionPrompt");
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
    }
          
    ////// Support for fields that recalculate based on other fields
    
    updateLabelUsingCalculation(updateInfo) { 
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
    }

    _add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate) {
        if (!calculate) {
            throw new Error("_add_calculatedText: calculate parameter should not be empty");
        }

        var baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var label = new ContentPane();
        label.placeAt(contentPane);
        
        // TODO: How do these updates get removed????
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        label["updateInfo"] = updateInfo;
        
        this.updateLabelUsingCalculation(updateInfo);

        return label;
    }
}

addStandardPlugins();

export = PanelBuilder;
