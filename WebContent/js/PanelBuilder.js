// TODO: Remove unused imports
define([
    "dojo/_base/array",
    "dojox/mvc/at",
    "js/browser",
    "js/widgets/clusteringDiagram",
    "dojo/_base/declare",
    "js/domain",
    'dojo/dom-class',
    "dojo/dom-construct",
    "exports",
    "dojo/_base/lang",
    "js/templates/recommendations",
    "js/translate",
    "js/templates/templates",
    "js/widgets/widgetSupport",
    "dijit/form/Button",
    "js/widgets/checkboxes",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dijit/form/FilteringSelect",
    "js/widgets/graphBrowser",
    "js/widgets/gridTable",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dijit/form/HorizontalSlider",
    "dojo/store/Memory",
    "dstore/Memory",
    "js/widgets/radioButtons",
    "dijit/form/SimpleTextarea",
    "js/widgets/storyBrowser",
    "js/widgets/storyThemer",
    "dojox/layout/TableContainer",
    "dijit/form/TextBox",
    "dijit/form/ToggleButton"
], function(
    array,
    at,
    browser,
    clusteringDiagram,
    declare,
    domain,
    domClass,
    domConstruct,
    exports,
    lang,
    recommendations,
    translate,
    templates,
    widgetSupport,
    Button,
    CheckBoxes,
    CheckBox,
    ContentPane,
    FilteringSelect,
    GraphBrowser,
    GridTable,
    HorizontalRule,
    HorizontalRuleLabels,
    HorizontalSlider,
    Memory,
    MemoryDstore,
    RadioButtons,
    SimpleTextarea,
    StoryBrowser,
    StoryThemer,
    TableContainer,
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
    "slider": "add_slider",
    "report": "add_report",
    "recommendationTable": "add_recommendationTable",
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
    "templateList": "add_templateList",
    "questionAnswer": "add_questionAnswer",
    "questionAnswerCountOfTotalOnPage": "add_questionAnswerCountOfTotalOnPage",
    "listCount": "add_listCount",
    "function": "add_function",
    "quizScoreResult": "add_quizScoreResult"
};

// The applicationBuilder is needed to build popup panels for some widgets like the grid
var applicationBuilder = null;

// This class builds panels from question definitions
var PanelBuilder = declare(null, {
    // content panes can be pushed down on the stack when working on nested panes
    contentPaneStack: [],
    contentPane: null,
    
    constructor: function(kwArgs) {
        lang.mixin(this, kwArgs);
        // TODO: What should go here?
    },
    
    // TODO: Perhaps should handle contentPane differently, since it is getting overwritten by these next three methods
    
    addQuestionWidget: function(type, contentPane, model, id, dataOptions, displayConfiguration) {
        console.log("addQuestionWidget", type, id);
        this.contentPane = contentPane;
        var addFunctionName = buildingFunctions[type];
        if (!addFunctionName) {
            var error = "ERROR: unsupported question type: " + type;
            console.log(error);
            throw new Error(error);
        }

        // TODO: Refactor: Legacy from when just one options field in questions
        // TODO: Maybe, should maybe have all widgets have some more complex configuration approach with two arguments or a dictionary with configuration info
        var options = dataOptions;
        if (!options) options = displayConfiguration;
        if (lang.isString(options)) options = [options];
        
        var addFunction = this[addFunctionName];
        if (!addFunctionName) {
            var error2 = "ERROR: missing addFunction for: " + addFunctionName + " for type: " + type;
            console.log(error2);
            throw new Error(error2);
        }
        
        return lang.hitch(this, addFunction)(contentPane, model, id, options);
    },
    
    // Returns dictionary mapping from question IDs to widgets
    addQuestions: function(questions, contentPane, model) {
        console.log("addQuestions", questions);
        this.contentPane = contentPane;
        var widgets = {};
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var widget = this.addQuestionWidget(question.displayType, contentPane, model, question.id, question.dataOptions, question.displayConfiguration);
            widgets[question.id] = widget;
        }
        return widgets;
    },
    
    // Build an entire panel; panel can be either a string ID referring to a panel or it can be a panel definition itself
    buildPanel: function(panelOrID, contentPane, model) {
        this.contentPane = contentPane;
        var questions;
        if (lang.isString(panelOrID)) {
            questions = applicationBuilder.buildQuestionsForPanel(panelOrID);
        } else if (panelOrID.buildPanel) {
            return panelOrID.buildPanel(this, contentPane, model);
        } else {
            questions = panelOrID.questions;
        }
        this.addQuestions(questions, contentPane, model);
    },
    
                  
    /////////////
    
    createQuestionContentPaneWithPrompt: function(contentPane, id) {
        // triangle&#8227; 
        // double arrow &#187;
        // Arrow with hook &#8618;
        // Three rightwards arrows &#21F6; (doesn't work)
        // "*** " + 
        var questionText = translate("#" + id + "::prompt", "ERROR: missing text for: " + id + "::prompt");
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
    
    add_label: function(contentPane, model, id, options) {
        var label = new ContentPane({
            content: htmlForInformationIcon(randomHelpPageURL(id)) + "&nbsp;&nbsp;" + translate("#" + id + "::prompt")
        });
        label.placeAt(contentPane);
        return label;
    },
    
    add_header: function(contentPane, model, id, options) {
        var label = new ContentPane({
            content: htmlForInformationIcon(randomHelpPageURL(id)) + "&nbsp;&nbsp;" + "<b>" + translate("#" + id + "::prompt") + "</b>"
        });
        label.placeAt(contentPane);
        return label;
    },
    
    add_image: function(contentPane, model, id, options) {
        var imageSource = options[0];
        var questionText = translate("#" + id + "::prompt", "");
        var image = new ContentPane({
            content: questionText + "<br>" + '<img src="' + imageSource + '" alt="Image for question: ' + questionText + '">'
        });
        image.placeAt(contentPane);
        return image;
    },
    
    add_text: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        var textBox = new TextBox({
            value: at(model, id)
        });
        textBox.set("style", "width: 40em");
        textBox.placeAt(questionContentPane);
        return textBox;
    },
    
    add_textarea: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id); 
        var textarea = new SimpleTextarea({
            rows: "4",
            cols: "80",
            style: "width:auto;",
            value: at(model, id)
        });
        textarea.placeAt(questionContentPane);
        return textarea;
    },
    
    add_clusteringDiagram: function(contentPane, model, id, options) {
        // clustering diagram using a list of 2D objects
        console.log("add_clusteringDiagram", model, id, options);
        // console.log("clusteringDiagram module", clusteringDiagram);
        
        var diagramName = options[0];
        
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        return clusteringDiagram.insertClusteringDiagram(questionContentPane, model, id, diagramName, true);
    },
    
    add_grid: function(contentPane, model, id, options) {
        // Grid with list of objects
        // console.log("add_grid");
        
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var popupPageDefinition = domain.panelDefinitions[options[0]];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition for options: ", id, options);
        }
        
        var data = model.get(id);
        if (!data) {
            data = [];
            model.set(id, data);
        }
        
        // Store will modify underlying array
        var dataStore = new MemoryDstore({
            data: data,
            idProperty: "_id"
        });
        
        var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};
        return GridTable.insertGridTableBasic(this, questionContentPane, id, dataStore, popupPageDefinition, configuration);
    },
    
    add_select: function(contentPane, model, id, questionOptions, addNoSelectionOption) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var options = [];
        if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made"), id: "", selected: true});
        if (questionOptions) {
            array.forEach(questionOptions, function(each) {
                // console.log("choice", id, each);
                if (lang.isString(each)) {
                    var label = translate("#" + id + "::selection:" + each);
                    options.push({name: label, id: each});
                } else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    options.push({name: each.label, id: each.value});
                }
            });           
        } else {
            console.log("No choices or options defined for select", id);
        }
        
        var dataStore = new Memory({"data": options});
        
        var select = new FilteringSelect({
                store: dataStore,
                searchAttr: "name",
                // TODO: Work on validation...
                required: false,
                // style: "width: 100%"
                value: at(model, id)
        });
        
        select.placeAt(questionContentPane);
        return select;
    },
    
    add_boolean: function(contentPane, model, id, questionOptions) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var radioButtons = new RadioButtons({
            choices: null,
            // TODO: translate options
            optionsString: "yes\nno",
            value: at(model, id)
        });
        
        radioButtons.placeAt(questionContentPane);
        return radioButtons;
    },

    add_checkbox: function(contentPane, model, id, questionOptions) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var checkbox = new CheckBox({
            value: at(model, id)
        });
        
        checkbox.placeAt(questionContentPane);
        return checkbox;
    },
    
    add_radiobuttons: function(contentPane, model, id, questionOptions) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var radioButtons = new RadioButtons({
            questionID: id,
            choices: questionOptions,
            // optionsString: optionsString,
            value: at(model, id)
        });
         
        radioButtons.placeAt(questionContentPane);
        return radioButtons;
    },
    
    add_checkboxes: function(contentPane, model, id, questionOptions) {
        // console.log("add_checkboxes", contentPane, model, id, questionOptions);
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);

        // Checkboxes modifies a dictionary which contains whether each checkbox is checked
        // It does not use an "at" since the checkboxes will modify the data directly
        // Ensure that there is a place to store data about each checkbox
        if (!model.get(id)) model.set(id, {});

        var checkboxes = new CheckBoxes({
            questionID: id,
            choices: questionOptions,
            // optionsString: optionsString,
            value: model.get(id)
        });
        
        checkboxes.placeAt(questionContentPane);
        return checkboxes;
    },
    
    // TODO: Need to translate true/false
    add_toggleButton: function(contentPane, model, id, questionOptions) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        // Toggle button maintains a "checked" flag, so we need to set value ourselves
        var toggleButton = new ToggleButton({
            label: "" + model.get(id),
            value: at(model, id),
            onChange: function(value) {
                this.set("label", value);
                this.set("value", value);
                domain.buttonClicked(contentPane, model, id, questionOptions, value);
            }
        });
        
        toggleButton.placeAt(questionContentPane);
        
        return toggleButton;
    },
    
    add_button: function(contentPane, model, id, questionOptions, callback) {
        if (!callback) callback = lang.partial(domain.buttonClicked, contentPane, model, id, questionOptions);
        
        var button = new Button({
            label: translate("#" + id + "::prompt"),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        return button;
    },
    
    add_slider: function(contentPane, model, id, questionOptions) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        // A div that contains rules, labels, and slider
        var panelDiv = domConstruct.create("div");
        
        // TODO: Maybe these rules and labels need to go into a containing div?
        // TODO: But then what to return for this function if want to return actual slider to get value?
        
        var hasTextLabels = false;
        var labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        if (questionOptions && questionOptions.length !== 0) {
            // console.log("questionOptions", questionOptions);
            labels = questionOptions;
            if (labels.length !== 2) {
                console.log("Need to specify low and high labels for question: ", id);
            } else {
                hasTextLabels = true;
                var labelLow = labels[0].trim();
                var labelHigh = labels[1].trim();
                labels = [labelLow, labelHigh];
            }
        }
        
        // console.log("labels", labels, labels.length);
        
        var slider = new HorizontalSlider({
            minimum: 0,
            maximum: 100,
            discreteValues: 101,
            showButtons: true,
            // Doesn't work: style: "align: center; width: 80%;"
            // style: "width: 98%; max-width: 98%",
            value: at(model, id)
        });
        
        slider.placeAt(panelDiv);
         
        //if (!hasTextLabels) {}
        // Create the rules
        var rulesNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderRules = new HorizontalRule({
            container: "bottomDecoration",
            count: labels.length,
            style: "height: 5px"
        }, rulesNode);
        //}

        // Create the labels
        if (!hasTextLabels) {
            var labelsNode = domConstruct.create("div", {}, slider.containerNode);
            var sliderLabels = new HorizontalRuleLabels({
                container: "bottomDecoration",
                style: "height: 1.5em", // ; font-weight: bold
                minimum: 0,
                maximum: 100,
                count: labels.length,
                numericMargin: 1,
                labels: labels
            }, labelsNode);
        } else {
            var nodeConstructor = '<div><span style="float: left">' + labels[0] + '</span><span style="float: right">' + labels[1] + '</span></div>';
            var textLabelsNode = domConstruct.toDom(nodeConstructor);
            // slider.containerNode
            panelDiv.appendChild(textLabelsNode);
        }

        // TODO: Issue -- should return a new sort of component that can be placed an includes the slider and the rules and labels
        var sliderContentPane = new ContentPane({
            content: panelDiv
        });

        sliderContentPane.placeAt(questionContentPane);
        
        return contentPane;
    },
    
    add_recommendationTable: function(contentPane, model, id, options) {
        var dialogConfiguration = {
            dialogOpenButtonID: "button_showRecommendationsTable",
            dialogContentPaneID: "recommendationsTable",
            dialogTitleID: "title_recommendationsTable",
            dialogStyle: undefined,
            dialogConstructionFunction: lang.hitch(this, this.build_recommendationTable)
        };
        var button = widgetSupport.addButtonThatLaunchesDialog(contentPane, model, id, options, dialogConfiguration);
        return button;
    },
    
    build_recommendationTable: function(contentPane, model, id, options) {

        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);

        var categoryName = options[0];
        console.log("add_recommendationTable category", categoryName);
        
        var fieldsForCategory = recommendations.categories[categoryName];
        if (!fieldsForCategory) {
            console.log("ERROR: No data for recommendationTable category: ", categoryName);
            fieldsForCategory = [];
        }
        
        var table = new TableContainer({
            customClass: "wwsRecommendationsTable",
            cols: fieldsForCategory.length + 4 + 2,
            showLabels: false,
            spacing: 0
        });
        
        var recommendationsValues = [];
        
        var columnHeader1ContentPane = new ContentPane({"content": "<i>Question</i>", "colspan": 4, "align": "right"});
        table.addChild(columnHeader1ContentPane);
        recommendationsValues.push(null);
        
        var columnHeader2ContentPane = new ContentPane({"content": "<i>Your answer</i>", "colspan": 2, "align": "right"});
        table.addChild(columnHeader2ContentPane);
        recommendationsValues.push(null);

        for (var headerFieldIndex in fieldsForCategory) {
            var headerFieldName = fieldsForCategory[headerFieldIndex];
            var columnHeaderFieldContentPane = new ContentPane({"content": "<i>" + headerFieldName + "</i>", "colspan": 1, "align": "right"});
            table.addChild(columnHeaderFieldContentPane);
            recommendationsValues.push(null);
        }
        
        function tagForRecommendationValue(recommendation) {
            if (recommendation === 1) {
                return "recommendationLow";
            } else if (recommendation === 2) {
                return "recommendationMedium";
            } else if (recommendation === 3) {
                return "recommendationHigh";
            }
            console.log("ERROR: Unexpected recommendation value", recommendation);
            return "";
        }
        
        for (var questionName in recommendations.questions) {
            var questionText = translate("#" + questionName + "::prompt", "Missing translation for: " + questionName);
            var yourAnswer = model.get(questionName);
            
            var questionTextContentPane = new ContentPane({"content": questionText, "colspan": 4, "align": "right"});
            table.addChild(questionTextContentPane);
            recommendationsValues.push(null);
            
            var yourAnswerContentPane = new ContentPane({"content": yourAnswer, "colspan": 2, "align": "right"});
            table.addChild(yourAnswerContentPane);
            recommendationsValues.push(null);

            var recommendationsForAnswer = recommendations.recommendations[questionName][yourAnswer];
            
            for (var fieldIndex in fieldsForCategory) {
                var fieldName = fieldsForCategory[fieldIndex];
                var recommendationNumber = Math.floor((Math.random() * 3) + 1);
                recommendationsValues.push(recommendationNumber);
                var recommendationValue = {1: "risky", 2: "maybe", 3: "good"}[recommendationNumber];
                if (recommendationsForAnswer) {
                    var recommendationsForCategory = recommendationsForAnswer[categoryName];
                    if (recommendationsForCategory) recommendationValue = recommendationsForCategory[fieldName];
                }
                var fieldContentPane = new ContentPane({"content": "<i>" + recommendationValue + "</i>", "colspan": 1, "align": "right", "class": tagForRecommendationValue(recommendationNumber)});
                // TODO: Does not work as faster alternative: var fieldContentPane = domConstruct.create("span", {innerHTML: "<i>" + recommendationValue + "</i>", "colspan": 1, "align": "right", "class": tagForRecommendationValue(recommendationNumber)});
                table.addChild(fieldContentPane);
            }
        }
        
        table.placeAt(questionContentPane);
        
        /*
        // TO DO WORKING HERE!!!! Experiment -- Trying to get full background color set for a cell
        for (var i = 0; i < recommendationsValues.length; i++) {
            var recommendation = recommendationsValues[i];
            // console.log("recommendation", i, recommendation);
            var tag = tagForRecommendationValue(recommendation);
            var widgets = query(".wwsRecommendationsTable-valueCell-" + i, table.domNode);
            if (widgets && widgets[0] && tag) widgets[0].className += " " + tag;
        }
        */
        
        return table;
    },
      
    add_storyThemer: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var storyThemer = StoryThemer.insertStoryThemer(this, questionContentPane, model, id, domain.panelDefinitions);
        questionContentPane.resize();
        return storyThemer;
    },
    
    add_questionsTable: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED add_questionsTable: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    // TODO: Fix UNFINISHED widgets
    
    add_graphBrowser: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var graphBrowser = GraphBrowser.insertGraphBrowser(questionContentPane, model, id, domain.panelDefinitions);
        questionContentPane.resize();
        return graphBrowser;
    },
    
    add_trendsReport: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED add_trendsReport: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_clusterSpace: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED add_clusterSpace: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_annotationsGrid: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED add_annotationsGrid: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_storiesList: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED add_storiesList: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    // TODO: Refactor this into its own widget module
    add_templateList: function(contentPane, model, id, options) {
        var dialogConfiguration = {
            dialogOpenButtonID: "button_chooseATemplateToInsert",
            dialogContentPaneID: "templateList",
            dialogTitleID: "title_chooseATemplate",
            dialogStyle: "height: 900px",
            dialogConstructionFunction: lang.hitch(this, this.makeTemplateListChooser)
        };
        var button = widgetSupport.addButtonThatLaunchesDialog(contentPane, model, id, options, dialogConfiguration);
        return button;
    },
    
    makeTemplateListChooser: function(contentPane, model, id, options, hideDialogCallback, dialogConfiguration) {
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
       
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var templateListChoice = options[0];
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
                
        function useButtonClicked(id, grid, store, popupPageDefinition, itemContentPane, event) {
            console.log("useButtonClicked", id, grid, store, popupPageDefinition, itemContentPane, event);
            var selectedTemplate = grid.getSelectedItem(grid, store);
            console.log("grid selectedTemplate", selectedTemplate);
            
            if (selectedTemplate) {
                // TODO: not sure whether to confirm?
                // TODO: Translate
                widgetSupport.confirm("Copy selected template '" + selectedTemplate.id + "' into question definition?", function () {
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
        return GridTable.insertGridTableBasic(this, questionContentPane, id, dataStore, popupPageDefinition, configuration);
    },
    
    add_accumulatedItemsGrid: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED accumulatedItemsGrid: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_excerptsList: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate("#" + id + "::prompt")
            content: "<b>UNFINISHED add_excerptsList: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    },
    
    add_storyBrowser: function(contentPane, model, id, options) {
        var questionContentPane = this.createQuestionContentPaneWithPrompt(contentPane, id);
        
        var storyBrowser = StoryBrowser.insertStoryBrowser(this, questionContentPane, model, id, domain.panelDefinitions);
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
    
    //////

    calculate_questionAnswer: function(model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) value = translate("#question_not_yet_answered");
        if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            return "ERROR: missing question: " + referencedQuestionID;            
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

    calculate_questionAnswerCountOfTotalOnPage: function(model, panelID) {
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
    
    calculate_listCount: function(model, referencedQuestionID) {
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
    
    calculate_function: function(id, functionName, options) {
        var question = {id: id, displayConfiguration: options};
        return domain.callDashboardFunction(functionName, question);
    },
    
    _add_calculatedText: function(contentPane, id, calculate) {
        // var calculatedText = "(Initializing...)";
        var calculatedText = calculate();
        var baseText = translate("#" + id + "::prompt");
        var label = new ContentPane({
            content: baseText + calculatedText
        });
        label.placeAt(contentPane);
        
        // TODO: How do these updates get removed????
        var updateInfo = {"id": id, "label": label, "baseText": baseText, "calculate": calculate};
        questionsRequiringRecalculationOnPageChanges[id] = updateInfo;

        return label;
    },
    
    add_questionAnswer: function(contentPane, model, id, options) {
        var referencedQuestionID = options[0];
        var calculate = lang.hitch(this, this.calculate_questionAnswer, model, referencedQuestionID);
        return this._add_calculatedText(contentPane, id, calculate);
    },
    
    add_questionAnswerCountOfTotalOnPage: function(contentPane, model, id, options) {
        var panelID = options[0];
        var calculate = lang.hitch(this, this.calculate_questionAnswerCountOfTotalOnPage, model, panelID);
        return this._add_calculatedText(contentPane, id, calculate);
    },
    
    add_listCount: function(contentPane, model, id, options) {
        var referencedQuestionID = options[0];
        var calculate = lang.hitch(this, this.calculate_listCount, model, referencedQuestionID);
        return this._add_calculatedText(contentPane, id, calculate);
    },

    add_function: function(contentPane, model, id, options) {
        var functionName = options[0];
        var calculate = lang.hitch(this, this.calculate_function, id, functionName, options);
        return this._add_calculatedText(contentPane, id, calculate);
    },
    
    add_quizScoreResult: function(contentPane, model, id, options) {
        var dependsOn = options;
        var calculate = lang.partial(domain.calculate_quizScoreResult, model, dependsOn);
        var label = this._add_calculatedText(contentPane, id, calculate);
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate("#" + id + "::prompt");
        var updateInfo = {"id": id, "label": label, "baseText": baseText, "calculate": calculate};
        // Ensure this value is recalculated when dependent questions change by using watch
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // TODO: When do these watches get removed?
            // console.log("setting up watch on", questionID, "for", id, model);
            model.watch(questionID, lang.hitch(this, this.updateLabelUsingCalculation, updateInfo));
        }
        return label;
    },
    
    add_report: function(contentPane, model, id, options) {
        var headerPageID = "page_" + options[0];
        var calculate = lang.partial(domain.calculate_report, model, headerPageID);
        return this._add_calculatedText(contentPane, id, calculate);
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