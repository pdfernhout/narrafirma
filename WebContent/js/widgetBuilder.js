"use strict";

// TODO: Remove unused imports
define([
        "dojo/_base/array",
        "dojox/mvc/at",
        "js/widgets/clusteringDiagram",
        "dojo/dom",
        "js/domain",
        'dojo/dom-class',
        "dojo/dom-construct",
        "dojo/dom-style",
        "exports",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/query",
        "js/templates/recommendations",
        "dijit/registry",
        "js/translate",
        "js/templates/templates",
        "js/utility",
        "js/widgets/widgetSupport",
        "dojox/charting/plot2d/Bars",
        "dijit/form/Button",
        "js/widgets/checkboxes",
        "dijit/form/CheckBox",
        "dijit/layout/ContentPane",
        "dijit/form/FilteringSelect",
        "js/widgets/graph-browser",
        "js/widgets/grid-table",
        "dijit/form/HorizontalRule",
        "dijit/form/HorizontalRuleLabels",
        "dijit/form/HorizontalSlider",
        "dojo/store/Memory",
        "dijit/form/RadioButton",
        "js/widgets/radio-buttons",
        "dijit/form/Select",
        "dijit/form/SimpleTextarea",
        "js/widgets/story-browser",
        "dojox/layout/TableContainer",
        "dijit/form/TextBox",
        "dijit/form/ToggleButton",
        "dijit/_WidgetBase"
    ], function(
        array,
        at,
        clusteringDiagram,
        dom,
        domain,
        domClass,
        domConstruct,
        domStyle,
        exports,
        lang,
        on,
        query,
        recommendations,
        registry,
        translate,
        templates,
        utility,
        widgetSupport,
        Bars,
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
        RadioButton,
        RadioButtons,
        Select,
        SimpleTextarea,
        StoryBrowser,
        TableContainer,
        TextBox,
        ToggleButton,
        _WidgetBase
    ){
    
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
                  
    /////////////

    function createQuestionContentPaneWithPrompt(contentPane, id) {
        // triangle&#8227; 
        // double arrow &#187;
        // Arrow with hook &#8618;
        // Three rightwards arrows &#21F6; (doesn't work)
        // "*** " + 
        var questionText = translate(id + "::prompt", "ERROR: missing text for: " + id + "::prompt");
        var questionContentPane = new ContentPane({
        });
        domClass.add(questionContentPane.domNode, "questionExternal");
        questionContentPane.setAttribute("data-js-question-id", id);
        // questionContentPane.setAttribute("data-js-question-type", question.type);
        if (questionText) {
            var label = new ContentPane({
                content: questionText
            });
            label.placeAt(questionContentPane);
        }
        questionContentPane.placeAt(contentPane);
        
        var internalContentPane = new ContentPane({
        });
        domClass.add(internalContentPane.domNode, "questionInternal");
        internalContentPane.placeAt(questionContentPane);
        
        return internalContentPane;
    }
    
    ////////////////
    
    function add_label(contentPane, model, id, options) {
        var label = new ContentPane({
            content: translate(id + "::prompt")
        });
        label.placeAt(contentPane);
        return label;
    }
    
    function add_header(contentPane, model, id, options) {
        var label = new ContentPane({
            content: "<b>" + translate(id + "::prompt") + "</b>"
        });
        label.placeAt(contentPane);
        return label;
    }
    
    function add_image(contentPane, model, id, options) {
        var imageSource = options[0];
        var questionText = translate(id + "::prompt", "");
        var image = new ContentPane({
            content: questionText + "<br>" + '<img src="' + imageSource + '" alt="Image for question: ' + questionText + '">'
        });
        image.placeAt(contentPane);
        return image;
    }
    
    function add_text(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        var textBox = new TextBox({
            value: at(model, id)
        });
        textBox.set("style", "width: 40em");
        textBox.placeAt(questionContentPane);
        return textBox;
    }
    
    function add_textarea(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id); 
        var textarea = new SimpleTextarea({
            rows: "4",
            cols: "80",
            style: "width:auto;",
            value: at(model, id)
        });
        textarea.placeAt(questionContentPane);
        return textarea;
    }
    
    function add_clusteringDiagram(contentPane, model, id, options) {
        // clustering diagram using a list of 2D objects
        console.log("add_clusteringDiagram", model, id, options);
        // console.log("clusteringDiagram module", clusteringDiagram);
        
        var diagramName = options[0];
        
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        return clusteringDiagram.insertClusteringDiagram(questionContentPane, model, id, diagramName, true);
    }
    
    function add_grid(contentPane, model, id, options) {
        // Grid with list of objects
        // console.log("add_grid");
        
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var popupPageDefinition = domain.pageDefinitions[options[0]];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition for options: ", id, options);
        }
        
        var data = model.get(id);
        if (!data) {
            data = [];
            model.set(id, data);
        }
        
        // Store will modify underlying array
        var dataStore = new Memory({
            data: data,
            idProperty: "_id"
        });
        
        var configuration = {viewButton: true, addButton: true, removeButton: true, editButton: true, duplicateButton: true, moveUpDownButtons: true, includeAllFields: false};
        return GridTable.insertGridTableBasic(questionContentPane, id, dataStore, popupPageDefinition, configuration);
    }
    
    function add_select(contentPane, model, id, questionOptions, addNoSelectionOption) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var options = [];
        if (addNoSelectionOption) options.push({name: translate("selection_has_not_been_made"), id: "", selected: true});
        if (questionOptions) {
            array.forEach(questionOptions, function(each) {
                // console.log("choice", id, each);
                if (utility.isString(each)) {
                    var label = translate(id + "::selection:" + each);
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
    }
    
    function add_boolean(contentPane, model, id, questionOptions) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var radioButtons = new RadioButtons({
            choices: null,
            // TODO: translate options
            optionsString: "yes\nno",
            value: at(model, id)
        });
        
        radioButtons.placeAt(questionContentPane);
        return radioButtons;
    }

    function add_checkbox(contentPane, model, id, questionOptions) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var checkbox = new CheckBox({
            value: at(model, id)
        });
        
        checkbox.placeAt(questionContentPane);
        return checkbox;
    }
    
    function add_radiobuttons(contentPane, model, id, questionOptions) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var radioButtons = new RadioButtons({
            questionID: id,
            choices: questionOptions,
            // optionsString: optionsString,
            value: at(model, id)
        });
         
        radioButtons.placeAt(questionContentPane);
        return radioButtons;
    }
    
    function add_checkboxes(contentPane, model, id, questionOptions) {
        // console.log("add_checkboxes", contentPane, model, id, questionOptions);
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);

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
    }
    
    // TODO: Need to translate true/false
    function add_toggleButton(contentPane, model, id, questionOptions) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
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
    }
    
    function add_button(contentPane, model, id, questionOptions, callback) {
        if (!callback) callback = lang.partial(domain.buttonClicked, contentPane, model, id, questionOptions);
        
        var button = new Button({
            label: translate(id + "::prompt"),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        return button;
    }
    
    function add_slider(contentPane, model, id, questionOptions) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        // A div that contains rules, labels, and slider
        var panelDiv = domConstruct.create("div");
        
        // TODO: Maybe these rules and labels need to go into a containing div?
        // TODO: But then what to return for this function if want to return actual slider to get value?
        
        var hasTextLabels = false;
        var labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        if (questionOptions) {
            labels = questionOptions;
            if (labels.length != 2) {
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
            // Doesn;t work: style: "align: center; width: 80%;"
            style: "width: 80%;",
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
        var labelsNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderLabels = new HorizontalRuleLabels({
            container: "bottomDecoration",
            style: "height: 1.5em; font-weight: bold",
            minimum: 0,
            maximum: 100,
            count: labels.length,
            numericMargin: 1,
            labels: labels
        }, labelsNode);

        // TODO: Issue -- should return a new sort of component that can be placed an includes the slider and the rules and labels
        var sliderContentPane = new ContentPane({
            content: panelDiv
        });

        sliderContentPane.placeAt(questionContentPane);
        
        return contentPane;
    }
    
    function add_recommendationTable(contentPane, model, id, options) {
        var dialogConfiguration = {
            dialogOpenButtonID: "button_showRecommendationsTable",
            dialogContentPaneID: "recommendationsTable",
            dialogTitleID: "title_recommendationsTable",
            dialogStyle: undefined,
            dialogConstructionFunction: build_recommendationTable
        };
        var button = widgetSupport.addButtonThatLaunchesDialog(contentPane, model, id, options, dialogConfiguration);
        return button;
    }
    
    function build_recommendationTable(contentPane, model, id, options) {

        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);

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
        
        function tagForRecommentationValue(recommendation) {
            if (recommendation === 1) {
                return "recommendationLow";
            } else if (recommendation === 2) {
                return "recommendationMedium";
            } else if (recommendation === 3) {
                return "recommendationHigh";
            }
            console.log("ERROR: Unexpected recommentadtion value", recommendation);
            return "";
        }
        
        for (var questionName in recommendations.questions) {
            var questionText = translate(questionName + "::prompt", "Missing translation for: " + questionName);
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
                if (recommendationsForAnswer) recommendationValue = recommendationsForAnswer[categoryName][fieldName];
                var fieldContentPane = new ContentPane({"content": "<i>" + recommendationValue + "</i>", "colspan": 1, "align": "right", "class": tagForRecommentationValue(recommendationNumber)});
                table.addChild(fieldContentPane);
            }
        }
        
        table.placeAt(questionContentPane);
        
        /*
        // TO DO WORKING HERE!!!! Experiment -- Trying to get full background color set for a cell
        for (var i = 0; i < recommendationsValues.length; i++) {
            var recommendation = recommendationsValues[i];
            // console.log("recommendation", i, recommendation);
            var tag = tagForRecommentationValue(recommendation);
            var widgets = query(".wwsRecommendationsTable-valueCell-" + i, table.domNode);
            if (widgets && widgets[0] && tag) widgets[0].className += " " + tag;
        }
        */
        
        return table;
    }
    
    function add_storyThemer(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_storyThemer: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    function add_questionsTable(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_questionsTable: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    // TODO: Fix UNFINISHED widgets
    
    function add_graphBrowser(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var graphBrowser = GraphBrowser.insertGraphBrowser(questionContentPane, model, id, domain.pageDefinitions);
        questionContentPane.resize();
        return graphBrowser;
    }
    
    function add_trendsReport(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_trendsReport: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    function add_clusterSpace(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_clusterSpace: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    function add_annotationsGrid(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_annotationsGrid: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    function add_storiesList(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_storiesList: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    // For add_templateList
    var add_templateList_elicitationQuestions = [
        {"id":"category", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"id", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"text", "type":"textarea", "isInReport":true, "isGridColumn":true},
    ];
   
   var add_templateList_storyOrParticipantQuestions = [
        {"id":"category", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"id", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"shortName", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"type", "type":"text", "isInReport":true, "isGridColumn":true}, // , "options":["boolean", "label", "header", "checkbox", "checkboxes", "text", "textarea", "select", "radiobuttons", "slider"]},
        {"id":"options", "type":"textarea", "isInReport":true, "isGridColumn":true}
        // {"id":"templateQuestion_help", "type":"textarea", "isInReport":true, "isGridColumn":true},
    ];
   
   var add_templateList_activityQuestions = [
        {"id":"name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"type", "type":"text", "isInReport":true, "isGridColumn":true}, // , "options":["ice-breaker", "encountering stories (no task)", "encountering stories (simple task)", "discussing stories", "twice-told stories exercise", "timeline exercise", "landscape exercise", "story elements exercise", "composite stories exercise", "my own exercise", "other"]},
        {"id":"plan", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"optionalParts", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"recording", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"spaces", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"facilitation", "type":"textarea", "isInReport":true, "isGridColumn":true},
    ];
    
    // TODO: Refactor this into its own widget module
    function add_templateList(contentPane, model, id, options) {
        var dialogConfiguration = {
            dialogOpenButtonID: "button_chooseATemplateToInsert",
            dialogContentPaneID: "templateList",
            dialogTitleID: "title_chooseATemplate",
            dialogStyle: "height: 900px",
            dialogConstructionFunction: makeTemplateListChooser
        };
        var button = widgetSupport.addButtonThatLaunchesDialog(contentPane, model, id, options, dialogConfiguration);
        return button;
    }
    
    function makeTemplateListChooser(contentPane, model, id, options, hideDialogCallback, dialogConfiguration) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
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
        
        var dataStore = new Memory({
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

         function buildPage(builder, contentPane, model) {
             builder.addQuestions(pageQuestions, contentPane, model);
         }
         
         var popupPageDefinition = {
             "id": "page_template",
             "type": "popup",
             "isHeader": false,
             "questions": pageQuestions,
             "buildPage": buildPage
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
        return GridTable.insertGridTableBasic(questionContentPane, id, dataStore, popupPageDefinition, configuration);
    }
    
    function add_accumulatedItemsGrid(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED accumulatedItemsGrid: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    function add_excerptsList(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_excerptsList: " + id + "</b>"             
        });
        label.placeAt(questionContentPane);
        return label;
    }
    
    function add_storyBrowser(contentPane, model, id, options) {
        var questionContentPane = createQuestionContentPaneWithPrompt(contentPane, id);
        
        var storyBrowser = StoryBrowser.insertStoryBrowser(questionContentPane, model, id, domain.pageDefinitions);
        questionContentPane.resize();
        return storyBrowser;
    }
    
    ////// Support for questions that recalculate based on other questions
    
    // TODO: When do these get removed?  When page removed???
    var questionsRequiringRecalculationOnPageChanges = {};
    
    function updateLabelUsingCalculation(data) {
        // console.log("recalculating label", data);
        var calculatedText = data.calculate();
        // console.log("calculatedText ", calculatedText);
        var newLabelText = data.baseText + " " + calculatedText; 
        data.label.set("content", newLabelText);
        // console.log("recalculated question: ", data.id, calculatedText);
    }
    
    // TODO: Make a version of this that can be more selective in updates
    function updateQuestionsForPageChange() {
        for (var questionID in questionsRequiringRecalculationOnPageChanges) {
            var data = questionsRequiringRecalculationOnPageChanges[questionID];
            updateLabelUsingCalculation(data);
        }
    }
    
    //////

    function calculate_questionAnswer(model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) value = translate("question_not_yet_answered");
        if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            return "ERROR: missing question: " + referencedQuestionID;            
        }
        // console.log("domain.questions", domain, domain.questions);
        var question = domain.questions[referencedQuestionID];
        if (question) {
            if (question.type === "select" ||  question.type === "checkboxes" || question.type === "radiobuttons") {
                // TODO: This may not translate correctly for checkboxes; may need to be translated individually
                // console.log("trying to translate select", value);
                value = translate(value, value);
            }
        } else {
            console.log("calculate_questionAnswer: missing question definition for: ", referencedQuestionID);
        }
        return "<b>" + value + "<b>";
    }

    function calculate_questionAnswerCountOfTotalOnPage(model, pageID) {
        var page = domain.pageDefinitions[pageID];
        if (!page) {
            console.log("ERROR: page not found for: ", pageID);
            return "ERROR: page not found for: " + pageID + " at: " + Date();
        }
        // console.log("found page", page);
        var questionAskedCount = 0;
        var questionAnsweredCount = 0;
        for (var pageQuestionIndex in page.questions) {
            var pageQuestion = page.questions[pageQuestionIndex];
            // console.log("pageQuestion", pageQuestion);
            if (array.indexOf(entryTypes, pageQuestion.type) !== -1) {
                questionAskedCount++;
                var pageQuestionValue = model.get(pageQuestion.id);
                if (pageQuestionValue !== undefined && pageQuestionValue !== "" && pageQuestionValue !== null) questionAnsweredCount++;
            }
        }
        // var percentComplete = Math.round(100 * questionAnsweredCount / questionAskedCount);
        // if (questionAskedCount === 0) percentComplete = 0;
        var template = translate("calculate_questionAnswerCountOfTotalOnPage_template");
        var response = template.replace("{{questionAnsweredCount}}", questionAnsweredCount).replace("{{questionAskedCount}}", questionAskedCount);
        return "<b>" + response + "</b>";
    }
    
    function calculate_listCount(model, referencedQuestionID) {
        var value = model.get(referencedQuestionID);
        if (value === null) {
            return "0";
        } else if (value === undefined) {
            console.log("ERROR: missing question: ", referencedQuestionID);
            return "<b>ERROR: missing question: " + referencedQuestionID + "</b>";            
        } else {
            return "<b>" + value.length + "</b>";
        }
    }
    
    function calculate_function(id, functionName, options) {
        var question = {id: id, options: options};
        return domain.callDashboardFunction(functionName, question);
    }
    
    function _add_calculatedText(contentPane, id, calculate) {
        // var calculatedText = "(Initializing...)";
        var calculatedText = calculate();
        var baseText = translate(id + "::prompt");
        var label = new ContentPane({
            content: baseText + calculatedText
        });
        label.placeAt(contentPane);
        
        // TODO: How do these updates get removes????
        var updateInfo = {"id": id, "label": label, "baseText": baseText, "calculate": calculate};
        questionsRequiringRecalculationOnPageChanges[id] = updateInfo;

        return label;
    }
    
    function add_questionAnswer(contentPane, model, id, options) {
        var referencedQuestionID = options[0];
        var calculate = lang.partial(calculate_questionAnswer, model, referencedQuestionID);
        return _add_calculatedText(contentPane, id, calculate);
    }
    
    function add_questionAnswerCountOfTotalOnPage(contentPane, model, id, options) {
        var pageID = options[0];
        var calculate = lang.partial(calculate_questionAnswerCountOfTotalOnPage, model, pageID);
        return _add_calculatedText(contentPane, id, calculate);
    }
    
    function add_listCount(contentPane, model, id, options) {
        var referencedQuestionID = options[0];
        var calculate = lang.partial(calculate_listCount, model, referencedQuestionID);
        return _add_calculatedText(contentPane, id, calculate);
    }

    function add_function(contentPane, model, id, options) {
        var functionName = options[0];
        var calculate = lang.partial(calculate_function, id, functionName, options);
        return _add_calculatedText(contentPane, id, calculate);
    }
    
    function add_quizScoreResult(contentPane, model, id, options) {
        var dependsOn = options;
        var calculate = lang.partial(domain.calculate_quizScoreResult, model, dependsOn);
        var label = _add_calculatedText(contentPane, id, calculate);
        // TODO: Recalculating next two variables wheres they are also calculated in _add_calculatedText
        var baseText = translate(id + "::prompt");
        var updateInfo = {"id": id, "label": label, "baseText": baseText, "calculate": calculate};
        // Ensure this value is recalculated when dependent questions change by using watch
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // TODO: When do these watches get removed?
            // console.log("setting up watch on", questionID, "for", id, model);
            model.watch(questionID, lang.partial(updateLabelUsingCalculation, updateInfo));
        }
        return label;
    }
    
    function add_report(contentPane, model, id, options) {
        var headerPageID = "page_" + options[0];
        var calculate = lang.partial(domain.calculate_report, model, headerPageID);
        return _add_calculatedText(contentPane, id, calculate);
    }
    
    /* TODO: code from questionEditor that has not yet been implemented
     
     } else if (utility.startsWith(question.type, "questionsTable")) {
            var questionsTable = widgetQuestionsTable.insertQuestionsTable(question, questionsPane, domain.pageDefinitions);

       var helpText = "";
        if (!question.help) {
            // Try to retrieve question help if not defined and present in helptexts.html
            helpText = translate(question.id + "_help", "");
        } else {
            // Otherwise, see if can translate the text if it is a tag
            helpText = translate(question.help, question.help);
        }
        // console.log("question help", question.id, question.help, helpText);
        
        var helpWidget = null;
        if (helpText) {
            // var helpText = question.help.replace(/\"/g, '\\x22').replace(/\'/g, '\\x27');
            helpWidget = widgets.newButton(question.id + "_help", "?", null, function() {
                alert(helpText);
            });
            // help = ' <button onclick="alert(\'' + helpText + '\')">?</button>';
        }
        
               if (question.type === "textarea" || question.type === "text") questionDiv.appendChild(document.createElement("br"));

        if (question.changed && widget) {
            widget.on("change", question.changed);
            //question.changed(widget.get("value"));
        }

        if (question.visible !== undefined && !question.visible) domStyle.set(questionDiv, "display", "none");

     */
    
    function addQuestionWidget(type, contentPane, model, id, options) {
        console.log("addQuestionWidget", type, id);
        var functionName = "add_" + type;
        var addFunction = exportedFunctions[functionName];
        if (!addFunction) {
            var error = "ERROR: unsupported question type: " + type + " as function is missing: " + functionName;
            console.log(error);
            throw error;
        }
        return addFunction(contentPane, model, id, options);
    }
    
    // Returns disctionary mapping from question IDs to widgets
    function addQuestions(questions, contentPane, model) {
        console.log("addQuestions", questions);
        var widgets = {};
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            var widget = addQuestionWidget(question.type, contentPane, model, question.id, question.options);
            widgets[question.id] = widget;
        }
        return widgets;
    }
    
    
    var exportedFunctions = {
        "updateQuestionsForPageChange": updateQuestionsForPageChange,
        "add_label": add_label,
        "add_header": add_header,
        "add_image": add_image,
        "add_text": add_text,
        "add_textarea": add_textarea,
        "add_grid": add_grid,
        "add_select": add_select,
        "add_boolean": add_boolean,
        "add_checkbox": add_checkbox,
        "add_checkboxes": add_checkboxes,
        "add_clusteringDiagram": add_clusteringDiagram,
        "add_radiobuttons": add_radiobuttons,
        "add_toggleButton": add_toggleButton,
        "add_button": add_button,
        "add_slider": add_slider,
        "add_report": add_report,
        "add_recommendationTable": add_recommendationTable,
        "add_questionsTable": add_questionsTable,
        "add_storyBrowser": add_storyBrowser,
        "add_storyThemer": add_storyThemer,
        "add_graphBrowser": add_graphBrowser,
        "add_trendsReport": add_trendsReport,
        "add_clusterSpace": add_clusterSpace,
        "add_annotationsGrid": add_annotationsGrid,
        "add_accumulatedItemsGrid": add_accumulatedItemsGrid,
        "add_excerptsList": add_excerptsList,
        "add_storiesList": add_storiesList,
        "add_templateList": add_templateList,
        "add_questionAnswer": add_questionAnswer,
        "add_questionAnswerCountOfTotalOnPage": add_questionAnswerCountOfTotalOnPage,
        "add_listCount": add_listCount,
        "add_function": add_function,
        "add_quizScoreResult": add_quizScoreResult,
        "addQuestionWidget": addQuestionWidget,
        "addQuestions": addQuestions,
    };
    
    lang.mixin(exports, exportedFunctions);
});