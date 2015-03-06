// TODO: Remove unused imports
define([
    "./add_recommendationTable",
    "./add_slider",
    "./add_templateList",
    "dojo/_base/array",
    "dojox/mvc/at",
    "js/browser",
    "./clusteringDiagram",
    "dojo/_base/declare",
    "./dialogSupport",
    "js/domain",
    'dojo/dom-class',
    "dojo/dom-construct",
    "exports",
    "dojo/_base/lang",
    "js/translate",
    "dijit/form/Button",
    "./CheckBoxesWidget",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dijit/form/FilteringSelect",
    "./graphBrowser",
    "./gridTable",
    "dojo/store/Memory",
    "dstore/Memory",
    "./radioButtons",
    "dijit/form/SimpleTextarea",
    "./storyBrowser",
    "./storyThemer",
    "dijit/form/TextBox",
    "dijit/form/ToggleButton"
], function(
    add_recommendationTable,
    add_slider,
    add_templateList,
    array,
    at,
    browser,
    clusteringDiagram,
    declare,
    dialogSupport,
    domain,
    domClass,
    domConstruct,
    exports,
    lang,
    translate,
    Button,
    CheckBoxesWidget,
    CheckBox,
    ContentPane,
    FilteringSelect,
    GraphBrowser,
    GridTable,
    Memory,
    MemoryDstore,
    RadioButtons,
    SimpleTextarea,
    StoryBrowser,
    StoryThemer,
    TextBox,
    ToggleButton
){
"use strict";

var entryTypes = [
    "boolean",
    "checkbox",
    "checkboxes",
    "text",
    "textarea", 
    "select",
    "radio",
    "slider",
    "toggleButton"
 ];
  
 var supportedTypes = [
     "boolean",
     "label",
     "header",
     "checkbox",
     "checkboxes",
     "text",
     "textarea", 
     "select",
     "radio",
     "slider",
     "questionAnswer",
     "questionAnswerCountOfTotalOnPage",
     "listCount",
     "function",
     "toggleButton",
     "image",
     "quizScoreResult"
];
 
// TODO: Need a better approach for calling JavaScript function than this
document.__narraFirma_launchApplication = browser.launchApplication;
 
// TODO: Fix all this so attaching actual JavaScript function not text to be interpreted
function htmlForInformationIcon(url) {
    var template = '<img src="{iconFile}" height=16 width=16 title="{title}" onclick="document.__narraFirma_launchApplication(\'{url}\', \'help\')">';
    return lang.replace(template, {
        // TODO: Remove unused images from project
        // "/images/Info_blauw.png"
        // "/images/Blue_question_mark_icon.svg"
        iconFile:'/images/Information_icon4.svg',
        title: "Click to open help system window on this topic...",
        url: url
    });
}

// TODO: Remove this -- just for testing/demo purposes
function randomHelpPageURL(id) {
    var index = (Math.floor(Math.random() * 8) + 1);
    var url = 'http://www.kurtz-fernhout.com/help100/0000000' + index + '.htm' + "#" + id;
    return url;
}

// TODO: Think about where this goes!!!
// TODO: When do these get removed?  When page removed???
var questionsRequiringRecalculationOnPageChanges = {};

var buildingFunctions = {
    "label": "add_label",
    "header": "add_header",
    "image": "add_image",
    "text": "add_text",
    "textarea": "add_textarea",
    "grid": "add_grid",
    "select": "add_select",
    "boolean": "add_boolean",
    "checkbox": "add_checkbox",
    "checkboxes": "add_checkboxes",
    "clusteringDiagram": "add_clusteringDiagram",
    "radiobuttons": "add_radiobuttons",
    "toggleButton": "add_toggleButton",
    "button": "add_button",
    "report": "add_report",
    "questionsTable": "add_questionsTable",
    "storyBrowser": "add_storyBrowser",
    "storyThemer": "add_storyThemer",
    "graphBrowser": "add_graphBrowser",
    "trendsReport": "add_trendsReport",
    "clusterSpace": "add_clusterSpace",
    "annotationsGrid": "add_annotationsGrid",
    "accumulatedItemsGrid": "add_accumulatedItemsGrid",
    "excerptsList": "add_excerptsList",
    "storiesList": "add_storiesList",
    "questionAnswer": "add_questionAnswer",
    "questionAnswerCountOfTotalOnPage": "add_questionAnswerCountOfTotalOnPage",
    "listCount": "add_listCount",
    "function": "add_function",
    "quizScoreResult": "add_quizScoreResult"
};

function addPlugin(name, callback) {
    buildingFunctions[name] = callback;
}

// plugins
addPlugin("templateList", add_templateList);
addPlugin("slider", add_slider);
addPlugin("recommendationTable", add_recommendationTable);

// The applicationBuilder is needed to build popup panels for some widgets like the grid
var applicationBuilder = null;

// This class builds panels from question definitions
var PanelBuilder = declare(null, {
    
    constructor: function(kwArgs) {
        lang.mixin(this, kwArgs);
        // TODO: What should go here?
    },
    
    // TODO: Perhaps should handle contentPane differently, since it is getting overwritten by these next three methods
    
    addQuestionWidget: function(contentPane, model, fieldSpecification) {
        console.log("addQuestionWidget", fieldSpecification);
        
        var addFunction = buildingFunctions[fieldSpecification.displayType];
        if (!addFunction) {
            var error = "ERROR: unsupported field display type: " + fieldSpecification.displayType;
            console.log(error);
            throw new Error(error);
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
        
        var widgets = {};
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var widget = this.addQuestionWidget(contentPane, model, question);
            widgets[question.id] = widget;
        }
        return widgets;
    },
    
    // Build an entire panel; panel can be either a string ID referring to a panel or it can be a panel definition itself
    buildPanel: function(panelOrID, contentPane, model) {
        var questions;
        if (lang.isString(panelOrID)) {
            questions = applicationBuilder.buildQuestionsForPanel(panelOrID);
        } else if (panelOrID.buildPanel) {
            // Call explicit constructor function
            return panelOrID.buildPanel(this, contentPane, model);
        } else {
            questions = panelOrID.questions;
        }
        this.addQuestions(questions, contentPane, model);
    },
    
                  
    /////////////
    
    createQuestionContentPaneWithPrompt: function(contentPane, fieldSpecification) {
        // triangle&#8227; 
        // double arrow &#187;
        // Arrow with hook &#8618;
        // Three rightwards arrows &#21F6; (doesn't work)
        // "*** " + 
        if (!fieldSpecification) throw new Error("null, undefined, or empty string for fieldSpecification");
        if (!fieldSpecification.id) throw new Error("null, undefined, or empty string for fieldSpecification id: " + JSON.stringify(fieldSpecification));
        var id = fieldSpecification.id;
        var questionText = translate("#" + id + "::prompt", fieldSpecification.displayPrompt);
        var questionContentPane = new ContentPane({
        });
        domClass.add(questionContentPane.domNode, "questionExternal");
        questionContentPane.setAttribute("data-js-question-id", id);
        // questionContentPane.setAttribute("data-js-question-type", question.displayType);
        // TODO: Fix the help that correct help actually pops up
        if (questionText) {
            var label = new ContentPane({
                content: htmlForInformationIcon(randomHelpPageURL(id)) + "&nbsp;&nbsp;" + questionText
                });
            label.placeAt(questionContentPane);
        }
        questionContentPane.placeAt(contentPane);
        
        /* var helpWidget = add_button(questionContentPane, null, "button_help", [], function() {
            alert("Help!");
        });
        */
        
        var internalContentPane = new ContentPane({
        });
        domClass.add(internalContentPane.domNode, "questionInternal");
        internalContentPane.placeAt(questionContentPane);
        
        return internalContentPane;
    },
    
    ////////////////
    
    add_label: function(panelBuilder, contentPane, model, fieldSpecification) {
        var label = new ContentPane({
            content: htmlForInformationIcon(randomHelpPageURL(fieldSpecification.id)) + "&nbsp;&nbsp;" + translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt)
        });
        label.placeAt(contentPane);
        return label;
    },
    
    add_header: function(panelBuilder, contentPane, model, fieldSpecification) {
        var label = new ContentPane({
            content: htmlForInformationIcon(randomHelpPageURL(fieldSpecification.id)) + "&nbsp;&nbsp;" + "<b>" + translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt) + "</b>"
        });
        label.placeAt(contentPane);
        return label;
    },
    
    add_image: function(panelBuilder, contentPane, model, fieldSpecification) {
        var imageSource = fieldSpecification.displayConfiguration;
        var questionText = translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt || "");
        var image = new ContentPane({
            content: questionText + "<br>" + '<img src="' + imageSource + '" alt="Image for question: ' + questionText + '">'
        });
        image.placeAt(contentPane);
        return image;
    },
    
    add_text: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        var textBox = new TextBox({
            value: at(model, fieldSpecification.id)
        });
        textBox.set("style", "width: 40em");
        textBox.placeAt(questionContentPane);
        return textBox;
    },
    
    add_textarea: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification); 
        var textarea = new SimpleTextarea({
            rows: "4",
            cols: "80",
            style: "width:auto;",
            value: at(model, fieldSpecification.id)
        });
        textarea.placeAt(questionContentPane);
        return textarea;
    },
    
    add_clusteringDiagram: function(panelBuilder, contentPane, model, fieldSpecification) {
        // clustering diagram using a list of 2D objects
        console.log("add_clusteringDiagram", model, fieldSpecification);
        // console.log("clusteringDiagram module", clusteringDiagram);
        
        var diagramName = fieldSpecification.displayConfiguration;
        
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        return clusteringDiagram.insertClusteringDiagram(questionContentPane, model, fieldSpecification.id, diagramName, true);
    },
    
    add_grid: function(panelBuilder, contentPane, model, fieldSpecification) {
        // Grid with list of objects
        // console.log("add_grid");
        
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var popupPageDefinition = domain.panelDefinitions[fieldSpecification.displayConfiguration];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition for options: ", fieldSpecification);
        }
        
        var data = model.get(fieldSpecification.id);
        if (!data) {
            data = [];
            model.set(fieldSpecification.id, data);
        }
        
        // Store will modify underlying array
        var dataStore = new MemoryDstore({
            data: data,
            idProperty: "_id"
        });
        
        var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};
        return GridTable.insertGridTableBasic(panelBuilder, questionContentPane, fieldSpecification.id, dataStore, popupPageDefinition, configuration);
    },
    
    add_select: function(panelBuilder, contentPane, model, fieldSpecification, addNoSelectionOption) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var options = [];
        if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made"), id: "", selected: true});
        var choices = fieldSpecification.dataOptions;
        if (choices) {
            array.forEach(choices, function(each) {
                var label;
                // console.log("choice", id, each);
                if (lang.isString(each)) {
                    label = translate("#" + fieldSpecification.id + "::selection:" + each, each);
                    options.push({name: label, id: each});
                } else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    label = translate("#" + fieldSpecification.id + "::selection:" + each.label, each.label);
                    options.push({name: label, id: each.value});
                }
            });           
        } else {
            console.log("No choices or options defined for select", fieldSpecification.id);
        }
        
        var dataStore = new Memory({"data": options});
        
        var select = new FilteringSelect({
                store: dataStore,
                searchAttr: "name",
                // TODO: Work on validation...
                required: false,
                // style: "width: 100%"
                value: at(model, fieldSpecification.id)
        });
        
        select.placeAt(questionContentPane);
        return select;
    },
    
    add_boolean: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var radioButtons = new RadioButtons({
            choices: null,
            // TODO: translate options
            optionsString: "yes\nno",
            value: at(model, fieldSpecification.id)
        });
        
        radioButtons.placeAt(questionContentPane);
        return radioButtons;
    },

    add_checkbox: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var checkbox = new CheckBox({
            value: at(model, fieldSpecification.id)
        });
        
        checkbox.placeAt(questionContentPane);
        return checkbox;
    },
    
    add_radiobuttons: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var radioButtons = new RadioButtons({
            questionID: fieldSpecification.id,
            choices: fieldSpecification.dataOptions,
            // optionsString: optionsString,
            value: at(model, fieldSpecification.id)
        });
         
        radioButtons.placeAt(questionContentPane);
        return radioButtons;
    },
    
    add_checkboxes: function(panelBuilder, contentPane, model, fieldSpecification) {
        // console.log("add_checkboxes", contentPane, model, fieldSpecification);
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);

        // Checkboxes modifies a dictionary which contains whether each checkbox is checked
        // It does not use an "at" since the checkboxes will modify the data directly
        // Ensure that there is a place to store data about each checkbox
        if (!model.get(fieldSpecification.id)) model.set(fieldSpecification.id, {});

        var checkboxes = new CheckBoxesWidget({
            questionID: fieldSpecification.id,
            choices: fieldSpecification.dataOptions,
            // optionsString: optionsString,
            value: model.get(fieldSpecification.id)
        });
        
        checkboxes.placeAt(questionContentPane);
        return checkboxes;
    },
    
    // TODO: Need to translate true/false
    add_toggleButton: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        // Toggle button maintains a "checked" flag, so we need to set value ourselves
        var toggleButton = new ToggleButton({
            label: "" + model.get(fieldSpecification.id),
            value: at(model, fieldSpecification.id),
            onChange: function(value) {
                this.set("label", value);
                this.set("value", value);
                domain.buttonClicked(contentPane, model, fieldSpecification, value);
            }
        });
        
        toggleButton.placeAt(questionContentPane);
        
        return toggleButton;
    },
    
    add_button: function(panelBuilder, contentPane, model, fieldSpecification, callback) {
        if (!callback) callback = lang.partial(domain.buttonClicked, contentPane, model, fieldSpecification);
        
        var button = new Button({
            label: translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        return button;
    },
    
    addButtonThatLaunchesDialog: function(contentPane, model, fieldSpecification, dialogConfiguration) {
        // if (!callback) callback = lang.partial(domain.buttonClicked, contentPane, model, id, questionOptions);
        var callback = function() {
            dialogSupport.openDialog(model, dialogConfiguration);
        };
        
        var button = new Button({
            label: translate("#" + fieldSpecification.id, fieldSpecification.displayPrompt),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        
        var wrap = new ContentPane({
            content: "<br>"
        });
        wrap.placeAt(contentPane);
        
        return button;
    },
          
    add_storyThemer: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyThemer = StoryThemer.insertStoryThemer(panelBuilder, questionContentPane, model, fieldSpecification.id, domain.panelDefinitions);
        questionContentPane.resize();
        return storyThemer;
    },
    
    add_questionsTable: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_questionsTable: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    // TODO: Fix UNFINISHED widgets
    
    add_graphBrowser: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var graphBrowser = GraphBrowser.insertGraphBrowser(questionContentPane, model, fieldSpecification.id, domain.panelDefinitions);
        questionContentPane.resize();
        return graphBrowser;
    },
    
    add_trendsReport: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_trendsReport: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_clusterSpace: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_clusterSpace: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_annotationsGrid: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_annotationsGrid: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_storiesList: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_storiesList: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
        
    add_accumulatedItemsGrid: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED accumulatedItemsGrid: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_excerptsList: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt", fieldSpecification.displayPrompt)
            content: "<b>UNFINISHED add_excerptsList: " + fieldSpecification.id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_storyBrowser: function(panelBuilder, contentPane, model, fieldSpecification) {
        var questionContentPane = panelBuilder.createQuestionContentPaneWithPrompt(contentPane, fieldSpecification);
        
        var storyBrowser = StoryBrowser.insertStoryBrowser(panelBuilder, questionContentPane, model, fieldSpecification.id, domain.panelDefinitions);
        questionContentPane.resize();
        return storyBrowser;
    },
    
    ////// Support for questions that recalculate based on other questions
    
    updateLabelUsingCalculation: function(data) {
        // console.log("recalculating label", data);
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

    calculate_questionAnswer: function(panelBuilder, model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) value = translate("#question_not_yet_answered");
        if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            throw new Error("ERROR: missing question: " + referencedQuestionID);            
        }
        // console.log("domain.questions", domain, domain.questions);
        var question = domain.questions[referencedQuestionID];
        if (question) {
            if (question.displayType === "select" ||  question.displayType === "checkboxes" || question.displayType === "radiobuttons") {
                // TODO: This may not translate correctly for checkboxes; may need to be translated individually
                // console.log("trying to translate select", value);
                value = translate("#" + value, value);
            }
        } else {
            console.log("calculate_questionAnswer: missing question definition for: ", referencedQuestionID);
        }
        return "<b>" + value + "<b>";
    },

    calculate_questionAnswerCountOfTotalOnPage: function(panelBuilder, model, panelID) {
        var panel = domain.panelDefinitions[panelID];
        if (!panel) {
            console.log("ERROR: panel not found for: ", panelID);
            return "ERROR: panel not found for: " + panelID + " at: " + new Date();
        }
        // console.log("found panel", panel);
        var questionAskedCount = 0;
        var questionAnsweredCount = 0;
        for (var pageQuestionIndex in panel.questions) {
            var pageQuestion = panel.questions[pageQuestionIndex];
            // console.log("pageQuestion", pageQuestion);
            if (array.indexOf(entryTypes, pageQuestion.displayType) !== -1) {
                questionAskedCount++;
                var pageQuestionValue = model.get(pageQuestion.id);
                if (pageQuestionValue !== undefined && pageQuestionValue !== "" && pageQuestionValue !== null) questionAnsweredCount++;
            }
        }
        // var percentComplete = Math.round(100 * questionAnsweredCount / questionAskedCount);
        // if (questionAskedCount === 0) percentComplete = 0;
        var template = translate("#calculate_questionAnswerCountOfTotalOnPage_template");
        var response = template.replace("{{questionAnsweredCount}}", questionAnsweredCount).replace("{{questionAskedCount}}", questionAskedCount);
        return "<b>" + response + "</b>";
    },
    
    calculate_listCount: function(panelBuilder, model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) {
            return "0";
        } else if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            return "<b>ERROR: missing question: " + referencedQuestionID + "</b>";            
        } else {
            return "<b>" + value.length + "</b>";
        }
    },
    
    calculate_function: function(panelBuilder, functionName, fieldSpecification) {
        return domain.callDashboardFunction(functionName, fieldSpecification);
    },
    
    _add_calculatedText: function(panelBuilder, contentPane, fieldSpecification, calculate) {
        // var calculatedText = "(Initializing...)";
        var calculatedText = calculate();
        var baseText = translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var label = new ContentPane({
            content: baseText + calculatedText
        });
        label.placeAt(contentPane);
        
        // TODO: How do these updates get removed????
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        questionsRequiringRecalculationOnPageChanges[fieldSpecification.id] = updateInfo;

        return label;
    },
    
    add_questionAnswer: function(panelBuilder, contentPane, model, fieldSpecification) {
        var referencedQuestionID = fieldSpecification.displayConfiguration;
        if (!referencedQuestionID) throw new Error("missing referencedQuestionID for field: " + fieldSpecification.id + " all: " + JSON.stringify(fieldSpecification));
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_questionAnswer, panelBuilder, model, referencedQuestionID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    },
    
    add_questionAnswerCountOfTotalOnPage: function(panelBuilder, contentPane, model, fieldSpecification) {
        var panelID = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_questionAnswerCountOfTotalOnPage, panelBuilder, model, panelID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    },
    
    add_listCount: function(panelBuilder, contentPane, model, fieldSpecification) {
        var referencedQuestionID = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_listCount, panelBuilder, model, referencedQuestionID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    },

    add_function: function(panelBuilder, contentPane, model, fieldSpecification) {
        var functionName = fieldSpecification.displayConfiguration;
     // TODO: Fix when refactor
        var calculate = lang.partial(panelBuilder.calculate_function, panelBuilder, functionName, fieldSpecification);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    },
    
    add_quizScoreResult: function(panelBuilder, contentPane, model, fieldSpecification) {
        var dependsOn = fieldSpecification.displayConfiguration;
        var calculate = lang.partial(domain.calculate_quizScoreResult, model, dependsOn);
     // TODO: Fix when refactor
        var label = panelBuilder._add_calculatedText(contentPane, fieldSpecification, calculate);
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate("#" + fieldSpecification.id + "::prompt", fieldSpecification.displayPrompt);
        var updateInfo = {"id": fieldSpecification.id, "label": label, "baseText": baseText, "calculate": calculate};
        // Ensure this value is recalculated when dependent questions change by using watch
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // TODO: When do these watches get removed?
            // console.log("setting up watch on", questionID, "for", id, model);
         // TODO: Fix when refactor
            model.watch(questionID, lang.partial(panelBuilder.updateLabelUsingCalculation, panelBuilder, updateInfo));
        }
        return label;
    },
    
    add_report: function(panelBuilder, contentPane, model, fieldSpecification) {
        var headerPageID = "page_" + fieldSpecification.displayConfiguration;
        var calculate = lang.partial(domain.calculate_report, model, headerPageID);
     // TODO: Fix when refactor
        return panelBuilder._add_calculatedText(panelBuilder, contentPane, fieldSpecification, calculate);
    }
    
    });

    // Class function: Call this once for the application
    PanelBuilder.setApplicationBuilder = function(newApplicationBuilder) {
        applicationBuilder = newApplicationBuilder;
    };

    function usageIdeas(contentPane) {
        var panelBuilder = new PanelBuilder({contentPane: contentPane});
        panelBuilder.addButton("Click me", function () {console.log("clicked");});
        panelBuilder.addButton("#someTranslationID Some text if translation not found", "someDomainAction");
        panelBuilder.addButton({id: "someQuestionID", displayConfiguration: "someDomainAction"});
        
        var newPanel = panelBuilder.addPanel();
        // Widgets will go in new panel
        panelBuilder.popPanel(); 
    }
    
    return PanelBuilder;
});