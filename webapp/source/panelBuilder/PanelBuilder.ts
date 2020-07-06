import browser = require("./browser");
import translate = require("./translate");
import m = require("mithril");
import GridWithItemPanel = require("./GridWithItemPanel");
import standardWidgets = require("./standardWidgets");
import sanitizeHTML = require("../sanitizeHTML");
import _ = require("lodash");

// TODO: Ideally should not import Project; also a circular dependency
import Project = require("../Project");

"use strict";

// Developer local debug flag to cause an Exception if a widget type is missing instead of put in placeholder panel
const debugFailIfMissingWidgets = false;

// This is the tag to put into prompting text for functionResult items where you want the result to go
const ResultTagToReplace = "{{result}}";

// TODO: Need a better approach for calling JavaScript function than this
window["narraFirma_launchApplication"] = browser.launchApplication;

// TODO: Think about how to load plugins only as needed at runtime.
// Asynchronous callbacks are nice, until you realize you would need
// to refactor a lot to introduce one deep down in your application.
// In this case, it would be nice to load plugin functions only at runtime as panels require them.
// However, to use the AMD approach, that would mean everything that asked the builder
// to do anything would have to wait on a callback for the builder to finish.

function addButton(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    if (!callback) callback = panelBuilder.buttonClicked.bind(panelBuilder, model, fieldSpecification);

    const options: any = {
        onclick: callback
    };
    
    if (fieldSpecification.displayClass) options.class = fieldSpecification.displayClass;

    let displayPrompt = fieldSpecification.displayPrompt;
    if (typeof fieldSpecification.displayPrompt === "function") displayPrompt = displayPrompt(this, model, fieldSpecification);
    // TODO: Translate and changing display prompt won't mix well
    const text = m("span", {"class": "button-text"}, translate(fieldSpecification.id + "::prompt", displayPrompt));
 
    const parts = [text];
   
    if (fieldSpecification.displayIconClass) {
        const icon = m("span", {"class": fieldSpecification.displayIconClass});
        if (fieldSpecification.displayIconPosition === "right") {
            parts.push(icon);
        } else {
            parts.unshift(icon);
        }
    }

    const button = m("button", options, parts);

    // TODO: Improve the naming of displayPreventBreak, maybe by using displayConfiguration somehow, perhaps by changing the meaning of that field to something else

    if (fieldSpecification.displayPreventBreak) return button;
    return [button, m("br")];
}

function add_html(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    // add_html should only be called for NarraFirma application-supplied code, so trusting this should be OK
    return m("div.htmlWidget", {key: fieldSpecification.id}, m.trust(fieldSpecification.displayPrompt));
}

function add_image(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    const imageSource = fieldSpecification.displayConfiguration;
    const questionText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt || "");

    return m("div.narrafirma-image", { key: fieldSpecification.id }, [
        panelBuilder.addAllowedHTMLToPrompt(questionText),
        m("br"),
        m("img", {
            src: panelBuilder.applicationDirectory + imageSource,
            alt: "Image for question: " + questionText
        })
    ]);
}

function add_functionResult(panelBuilder: PanelBuilder, model, fieldSpecification, callback): any {
    // This should now be triggered via a Mithril redraw...
    
    const value = panelBuilder.calculateFunctionResult(model, fieldSpecification);
    
    const baseText = translate(fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
 
    const calculatedText = panelBuilder.calculateFunctionResult(model, fieldSpecification);
    
    const newLabelText = panelBuilder.substituteCalculatedResultInBaseText(baseText, calculatedText);
    
    return m("div.functionResult", panelBuilder.addAllowedHTMLToPrompt(newLabelText));
}

/* Defaults for displayConfiguration:
{
   itemPanelID: undefined,
   itemPanelSpecification: undefined,
   idProperty: "_id",
   gridConfiguration: {...}
}
 */
function add_grid(panelBuilder, model, fieldSpecification) {
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    return m("div", {"class": "narrafirma-question-type-grid-plus-prompt"}, [
        prompt,
        m.component(<any>GridWithItemPanel, {key: fieldSpecification.id, panelBuilder: panelBuilder, model: model, fieldSpecification: fieldSpecification, readOnly: panelBuilder.readOnly})
    ]);
}

function addStandardPlugins() {
    // shared with survey builder
    const displayQuestion = standardWidgets.displayQuestion;
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
    
    PanelBuilder.addPlugin("functionResult", add_functionResult);
    PanelBuilder.addPlugin("grid", add_grid);
    PanelBuilder.addPlugin("html", add_html);
    PanelBuilder.addPlugin("image", add_image);
}

const buildingFunctions = {};

// This class builds panels from field specifications.
// Field specifications define what widget to display and how to hook that widget to a model.
class PanelBuilder {
    panelSpecificationCollection = null;
    buttonClickedCallback = null;
    calculateFunctionResultCallback = null;
    addHelpIcons = false;
    currentHelpPage = null;
    currentHelpSection = null;
    
    // TODO: Should this be an absolute path based on whether running as WordPress plugin or NodeJS?
    applicationDirectory = "";
    
    idsMade = {};
    idCount = 0;
    
    readOnly = false;

    constructor(public application) {
    }
    
    static addPlugin(name, callback) {
        buildingFunctions[name] = callback;
    }
    
    // provide a way to find definitions needed to  build internal panels for some widgets like the GridWithItemPanel
    setPanelSpecifications(panelSpecificationCollection) {
        this.panelSpecificationCollection = panelSpecificationCollection;
    }
    
    // Convert arbitrary text to ids
    getIdForText(text) {
        if (!this.idsMade["$" + text]) {
            this.idsMade["$" + text] = this.idCount++;
        }
            
        return "panelField_" + this.idsMade["$" + text];
    }
    
    addMissingWidgetPlaceholder(panelBuilder, model, fieldSpecification) {
        const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
        return m("div", [
            prompt,
            m("b", "Unsupported widget type: " + fieldSpecification.displayType + " for: " + fieldSpecification.id)
         ]);
    }
    
    buildField(model, fieldSpecification) {
        let displayVisible = fieldSpecification.displayVisible;
        if (displayVisible === undefined) displayVisible = true;
        if (typeof displayVisible === "function") displayVisible = displayVisible(this, model, fieldSpecification);
        if (!displayVisible) return m("div"); 

        let addFunction = buildingFunctions[fieldSpecification.displayType];
        if (!addFunction) {
            if (debugFailIfMissingWidgets) {
                // Would be thrown if you forget to call "PanelBuilder.addStandardPlugins();" or similar at the beginning of your application
                const error = "ERROR: unsupported field display type: " + fieldSpecification.displayType;
                console.log(error);
                throw new Error(error);
            }
            addFunction = this.addMissingWidgetPlaceholder.bind(this);
        }
        if (_.isString(addFunction)) {
            const addFunctionName = addFunction;
            addFunction = this[addFunctionName];
            if (!addFunction) {
                const error2 = "ERROR: missing addFunction for: " + addFunctionName + " for field display type: " + fieldSpecification.displayType;
                console.log(error2);
                throw new Error(error2);
            }
        }
        
        try {
            return addFunction(this, model, fieldSpecification);
        } catch (e) {
            console.log("Exception creating widget", fieldSpecification, e);
            return m("div", {style: "border: 1px solid red; margin: 10px; padding: 10px"}, ["Problem creating widget type: " + fieldSpecification.displayType + " :: id: " + fieldSpecification.id, m("br"), "Exception: " + e]);
        }
    }
    
    // Returns array of widgets built from the fieldSpecifications
    buildFields(fieldSpecifications, model) {
        if (!fieldSpecifications) {
            throw new Error("fieldSpecifications are not defined");
        }
        
        const fields = [];
        for (let fieldSpecificationIndex = 0; fieldSpecificationIndex < fieldSpecifications.length; fieldSpecificationIndex++) {
            const fieldSpecification = fieldSpecifications[fieldSpecificationIndex];
            const widget = this.buildField(model, fieldSpecification);
            fields.push(widget);
        }
        return fields;
    }
    
    // Build an entire panel; panel can be either a string ID referring to a panel or it can be a panel definition itself
    buildPanel(panelOrPanelID, model) {
        let fieldSpecifications;
        if (_.isString(panelOrPanelID)) {
            const panel = this.getPanelDefinitionForPanelID(panelOrPanelID);
            fieldSpecifications = panel.panelFields;
        } else if (panelOrPanelID.buildPanel) {
            // Call explicit constructor function
            return panelOrPanelID.buildPanel(this, model);
        } else {
            fieldSpecifications = panelOrPanelID.panelFields;
        }
        return this.buildFields(fieldSpecifications, model);
    }
    
    // Set this correctly before building a page to provide default help when it is not in a field specification
    setCurrentHelpPageAndSection(helpPage, helpSection) {
        this.currentHelpPage = helpPage;
        this.currentHelpSection = helpSection;
    }

    /// Support functions
    
    getPanelDefinitionForPanelID(panelID) {
        if (!this.panelSpecificationCollection) {
            throw new Error("No panelSpecificationCollection set in PanelBuilder so can not resolve panelID: " + panelID);
        }
        
        const panelSpecification = this.panelSpecificationCollection.getPanelSpecificationForPanelID(panelID);
        
        if (!panelSpecification) {
            throw new Error("No panelSpecification found by PanelBuilder for panelID: " + panelID);
        }
        
        return panelSpecification;
    }
    
    // Convenience method for most common case of finding page specification
    getPageSpecificationForPageID(pageID) {
        if (!this.panelSpecificationCollection) {
            throw new Error("No panelSpecificationCollection set in PanelBuilder so can not resolve pageID: " + pageID);
        }
        
        const pageSpecification = this.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        
        if (!pageSpecification) {
            throw new Error("No pageSpecification found by PanelBuilder for pageID: " + pageID);
        }
        
        return pageSpecification;
    }
    
    // Provide a way to tell buttons what to do when clicked
    setButtonClickedCallback(callback) {
        this.buttonClickedCallback = callback;
    }
    
    buttonClicked(model, fieldSpecification, event) {
        if (_.isFunction(fieldSpecification.displayConfiguration)) {
            // Do callback; this can't be defined in JSON, but can be defined in an application
            fieldSpecification.displayConfiguration();
            return;
        }
        if (!this.buttonClickedCallback) {
            console.log("No buttonClickedCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No buttonClickedCallback set for PanelBuilder");
        }
        this.buttonClickedCallback(this, model, fieldSpecification, event);
    }
    
    setCalculateFunctionResultCallback(callback) {
        this.calculateFunctionResultCallback = callback;
    }
    
    calculateFunctionResult(model, fieldSpecification) {
        if (_.isFunction(fieldSpecification.displayConfiguration)) {
            // Do callback; this can't be defined in JSON, but can be defined in an application
            return fieldSpecification.displayConfiguration();
        }
        if (!this.calculateFunctionResultCallback) {
            console.log("No calculateFunctionResultCallback set in panelBuilder", this, fieldSpecification);
            throw new Error("No calculateFunctionResultCallback set for PanelBuilder");
        }
        return this.calculateFunctionResultCallback(this, model, fieldSpecification, fieldSpecification.displayConfiguration);
    }
    
    // This will only be valid during the building process for a page
    helpPageURLForField(fieldSpecification) {
        let section = fieldSpecification.helpSection;
        if (!section) section = this.currentHelpSection;
        let pageID = fieldSpecification.helpPage;
        if (!pageID) pageID = this.currentHelpPage;
        let helpID = fieldSpecification.helpID;
        if (!helpID) helpID = fieldSpecification.id;
        let url = "";   
        if (section && pageID) {
            url = '/help/' + section + "/help_" + pageID + '.html';
            if (helpID) url += '#' + helpID;
        }
        return url;
    }
                
    // TODO: Fix all this so attaching actual JavaScript function not text to be interpreted
    htmlForInformationIcon(url) {
        if (!url) return "";
        const template = '<img src="{iconFile}" height=16 width=16 title="{title}" onclick="window.narraFirma_launchApplication(\'{url}\', \'help\')">';
        const replacements = {
            // TODO: Remove unused images from project
            // "/images/Info_blauw.png"
            // "/images/Blue_question_mark_icon.svg"
            iconFile: this.applicationDirectory + 'images/Information_icon4.svg',
            title: "Click to open help system window on this topic...",
            url: url
        };
        
        function replace(template, values) {
            let result = template;
            for (const key in replacements) {
                result = result.split('{' + key + '}').join(replacements[key]);
                // result = result.replace(new RegExp('{' + key + '}', 'gi'), replacements[key]);
            }
            return result;
        }

        return replace(template, replacements);
    }
    
    addAllowedHTMLToPrompt(text) {
        try {
            const result = sanitizeHTML.generateSanitizedHTMLForMithril(text);
            return result;
        } catch (error) {
            alert(error);
            return text
        }
    }
    
    substituteCalculatedResultInBaseText(baseText: string, calculatedText: string): string {
        let newLabelText;
        if (baseText.indexOf(ResultTagToReplace) !== -1) {
            newLabelText = baseText.replace(ResultTagToReplace, calculatedText);
        } else {
            newLabelText = baseText + " " + calculatedText;
        }
        
        return newLabelText;
    }
    
    buildQuestionLabel(fieldSpecification) {
        return [
            // TODO: Generalize this css class name
            m("span", {"class": "questionPrompt", "style": fieldSpecification.displayPrompt ? "display: block" : "display: none"}, this.addAllowedHTMLToPrompt(fieldSpecification.displayPrompt))
        ];
    }
}

addStandardPlugins();

export = PanelBuilder;
