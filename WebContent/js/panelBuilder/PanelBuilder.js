// TODO: Remove unused imports
define([
    "./add_clusteringDiagram",
    "./add_recommendationTable",
    "./add_slider",
    "./add_templateList",
    
    "./add_accumulatedItemsGrid",
    "./add_annotationsGrid",
    "./add_boolean",
    "./add_button",
    "./add_checkbox",
    "./add_checkboxes",
    "./add_excerptsList",
    "./add_function",
    "./add_graphBrowser",
    "./add_grid",
    "./add_header",
    "./add_image",
    "./add_label",
    "./add_listCount",
    "./add_questionAnswer",
    "./add_questionAnswerCountOfTotalOnPage",
    "./add_questionsTable",
    "./add_quizScoreResult",
    "./add_radiobuttons",
    "./add_report",
    "./add_select",
    "./add_storiesList",
    "./add_storyBrowser",
    "./add_storyThemer",
    "./add_text",
    "./add_textarea",
    "./add_toggleButton",
    "./add_trendsReport",
    
    "dojo/_base/array",
    "js/browser",
    "dojo/_base/declare",
    "./dialogSupport",
    "js/domain",
    'dojo/dom-class',
    "dojo/_base/lang",
    "js/translate",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "./gridTable",
], function(
    add_clusteringDiagram,
    add_recommendationTable,
    add_slider,
    add_templateList,
    
    // TODO: Add the above alphabetically
    add_accumulatedItemsGrid,
    add_annotationsGrid,
    add_boolean,
    add_button,
    add_checkbox,
    add_checkboxes,
    add_excerptsList,
    add_function,
    add_graphBrowser,
    add_grid,
    add_header,
    add_image,
    add_label,
    add_listCount,
    add_questionAnswer,
    add_questionAnswerCountOfTotalOnPage,
    add_questionsTable,
    add_quizScoreResult,
    add_radiobuttons,
    add_report,
    add_select,
    add_storiesList,
    add_storyBrowser,
    add_storyThemer,
    add_text,
    add_textarea,
    add_toggleButton,
    add_trendsReport,
    
    array,
    browser,
    declare,
    dialogSupport,
    domain,
    domClass,
    lang,
    translate,
    Button,
    ContentPane,
    gridTable
){

"use strict";

// TODO: This list may get out of date relative to new widget type plugins -- need to think about it
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
 
// TODO: Need a better approach for calling JavaScript function than this
document.__narraFirma_launchApplication = browser.launchApplication;

// TODO: Think about where this goes!!!
// TODO: When do these get removed?  When page removed???
var questionsRequiringRecalculationOnPageChanges = {};

var buildingFunctions = {};

function addPlugin(name, callback) {
    buildingFunctions[name] = callback;
}

// plugins
// TODO: Alphabetize these with the rest
addPlugin("templateList", add_templateList);
addPlugin("slider", add_slider);
addPlugin("recommendationTable", add_recommendationTable);
addPlugin("clusteringDiagram", add_clusteringDiagram);

addPlugin("accumulatedItemsGrid", add_accumulatedItemsGrid);
addPlugin("annotationsGrid", add_annotationsGrid);
addPlugin("boolean", add_boolean);
addPlugin("button", add_button);
addPlugin("checkbox", add_checkbox);
addPlugin("checkboxes", add_checkboxes);
addPlugin("excerptsList", add_excerptsList);
addPlugin("function", add_function);
addPlugin("graphBrowser", add_graphBrowser);
addPlugin("grid", add_grid);
addPlugin("header", add_header);
addPlugin("image", add_image);
addPlugin("label", add_label);
addPlugin("listCount", add_listCount);
addPlugin("questionAnswer", add_questionAnswer);
addPlugin("questionAnswerCountOfTotalOnPage", add_questionAnswerCountOfTotalOnPage);
addPlugin("questionsTable", add_questionsTable);
addPlugin("quizScoreResult", add_quizScoreResult);
addPlugin("radiobuttons", add_radiobuttons);
addPlugin("report", add_report);
addPlugin("select", add_select);
addPlugin("storiesList", add_storiesList);
addPlugin("storyBrowser", add_storyBrowser);
addPlugin("storyThemer", add_storyThemer);
addPlugin("text", add_text);
addPlugin("textarea", add_textarea);
addPlugin("toggleButton", add_toggleButton);
addPlugin("trendsReport", add_trendsReport);

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
    
    panelDefinitionForPanelID: function(panelID) {
        // var questions = applicationBuilder.buildQuestionsForPanel(panelID);
        // console.log("panelDefinitionForPanelID", panelID, questions);
        var panelSpecification = domain.panelDefinitions[panelID];
        console.log("panelDefinitionForPanelID", panelID, panelSpecification);
        return panelSpecification;
    },
    
    // TODO: Remove this -- just for testing/demo purposes
    randomHelpPageURL: function(id) {
        var index = (Math.floor(Math.random() * 8) + 1);
        var url = 'http://www.kurtz-fernhout.com/help100/0000000' + index + '.htm' + "#" + id;
        return url;
    },
                
    // TODO: Fix all this so attaching actual JavaScript function not text to be interpreted
    htmlForInformationIcon: function(url) {
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
    
    /////////////
    
    buttonClicked: function(contentPane, model, fieldSpecification, value) {
        domain.buttonClicked(contentPane, model, fieldSpecification, value);
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
        var questionText = translate("#" + id + "::prompt", fieldSpecification.displayPrompt);
        var questionContentPane = new ContentPane({
        });
        domClass.add(questionContentPane.domNode, "questionExternal");
        questionContentPane.setAttribute("data-js-question-id", id);
        // questionContentPane.setAttribute("data-js-question-type", question.displayType);
        // TODO: Fix the help that correct help actually pops up
        if (questionText) {
            var label = new ContentPane({
                content: this.htmlForInformationIcon(this.randomHelpPageURL(id)) + "&nbsp;&nbsp;" + questionText
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
        if (!calculate) {
            throw new Error("_add_calculatedText: calculate parameter should not be empty");
        }
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