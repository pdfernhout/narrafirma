"use strict";

// TODO: Remove unused imports
define([
        "dojo/_base/array",
        "dojox/mvc/at",
        "dojo/_base/declare",
        "dojo/dom",
        "js/domain",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/_base/lang",
        "dojo/on",
        "dijit/registry",
        "js/translate",
        "js/utility",
        "dojox/charting/plot2d/Bars",
        "dijit/form/Button",
        "js/widgets/checkboxes",
        "dijit/form/CheckBox",
        "dijit/layout/ContentPane",
        "dijit/form/FilteringSelect",
        "js/widgets/grid-table",
        "dijit/form/HorizontalRule",
        "dijit/form/HorizontalRuleLabels",
        "dijit/form/HorizontalSlider",
        "dojo/store/Memory",
        "js/widgets/questions-table",
        "dijit/form/RadioButton",
        "js/widgets/radio-buttons",
        "dijit/form/Select",
        "dijit/form/SimpleTextarea",
        "js/widgets/story-browser",
        "dijit/form/TextBox",
        "dijit/form/ToggleButton",
        "dijit/_WidgetBase"
    ], function(
        array,
        at,
        declare,
        dom,
        domain,
        domConstruct,
        domStyle,
        lang,
        on,
        registry,
        translate,
        utility,
        Bars,
        Button,
        CheckBoxes,
        CheckBox,
        ContentPane,
        FilteringSelect,
        GridTable,
        HorizontalRule,
        HorizontalRuleLabels,
        HorizontalSlider,
        Memory,
        QuestionsTable,
        RadioButton,
        RadioButtons,
        Select,
        SimpleTextarea,
        StoryBrowser,
        TextBox,
        ToggleButton,
        _WidgetBase
    ){
    
    function add_label(contentPane, model, id, options) {
        var label = new ContentPane({
            content: translate(id + "::prompt")
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_header(contentPane, model, id, options) {
        var label = new ContentPane({
            content: "<b>" + translate(id + "::prompt") + "</b>"
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_image(contentPane, model, id, options) {
        var imageSource = options[0];
        var questionText = translate(id + "::prompt", "");
        var label = new ContentPane({
            content: "<br>" + '<img src="' + imageSource + '" alt="Image for question: ' + questionText + '">'
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function addPromptTextIfNeeded(contentPane, id) {
        var questionText = translate(id + "::prompt", "");
        if (questionText) {
            var label = new ContentPane({
                content: questionText
            });
            label.placeAt(contentPane);
            label.startup();        
        }
    }
    
    function add_text(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        var textBox = new TextBox({
            value: at(model, id)
        });
        textBox.placeAt(contentPane);
        textBox.startup();
        return textBox;
    }
    
    function add_textarea(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id); 
        var textarea = new SimpleTextarea({
            rows: "4",
            cols: "80",
            style: "width:auto;",
            value: at(model, id)
        });
        textarea.placeAt(contentPane);
        textarea.startup();
        return textarea;
    }
    
    function add_grid(contentPane, model, id, options) {
        // Grid with list of objects
        // console.log("add_grid");
        
        addPromptTextIfNeeded(contentPane, id);
        
        var popupPageDefinition = domain.pageDefinitions[options[0]];
        
        if (!popupPageDefinition) {
            console.log("Trouble: no popupPageDefinition for options: ", id, options);
        }
        
        var value = model[id];
        
        return GridTable.insertGridTableBasic(id, contentPane, popupPageDefinition, value, true);
    }
    
    function add_select(contentPane, model, id, questionOptions, addNoSelectionOption) {
        addPromptTextIfNeeded(contentPane, id);
        
        var options = [];
        // TODO: Translate label for no selection
        if (addNoSelectionOption) options.push({name: " -- select -- ", id: "", selected: true});
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
        
        select.placeAt(contentPane);
        select.startup();
        return select;
    }
    
    function add_boolean(contentPane, model, id, questionOptions) {
        addPromptTextIfNeeded(contentPane, id);
        
        var radioButtons = new RadioButtons({
            choices: null,
            // TODO: translate options
            optionsString: "yes\nno",
            value: at(model, id)
        });
        
        radioButtons.placeAt(contentPane);
        radioButtons.startup();
        return radioButtons;
    }

    function add_checkbox(contentPane, model, id, questionOptions) {
        addPromptTextIfNeeded(contentPane, id);
        
        var checkbox = new CheckBox({
            value: at(model, id)
        });
        
        checkbox.placeAt(contentPane);
        checkbox.startup();
        return checkbox;
    }
    
    function add_radiobuttons(contentPane, model, id, questionOptions) {
        addPromptTextIfNeeded(contentPane, id);

        var radioButtons = new RadioButtons({
            choices: questionOptions,
            // optionsString: optionsString,
            value: at(model, id)
        });
         
        radioButtons.placeAt(contentPane);
        radioButtons.startup();
        return radioButtons;
    }
    
    function add_checkboxes(contentPane, model, id, questionOptions) {
        addPromptTextIfNeeded(contentPane, id);

        var checkBoxes = new CheckBoxes({
            choices: questionOptions,
            // optionsString: optionsString,
            value: at(model, id)
        });
        
        checkBoxes.placeAt(contentPane);
        checkBoxes.startup();
        return checkBoxes;
    }
    
    // TODO: Need to translate true/false
    function add_toggleButton(contentPane, model, id, questionOptions) {
        addPromptTextIfNeeded(contentPane, id);
        
        // Toggle button maintains a "checked" flag, so we need to set value ourselves
        var toggleButton = new ToggleButton({
            label: "" + model.get(id),
            value: at(model, id),
            onChange: function(value) {this.set("label", value); this.set("value", value); model.buttonClicked(id, value);}
        });
        
        toggleButton.placeAt(contentPane);
        toggleButton.startup();
        
        return toggleButton;
    }
    
    // TODO: Probably not correct...
    function add_button(contentPane, model, id, questionOptions, callback) {
        // addPromptTextIfNeeded(contentPane, id);
        
        var button = new Button({
            label: translate(id + "::prompt"),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        button.startup();
        return button;
    }
    
    function add_slider(contentPane, model, id, questionOptions) {
        addPromptTextIfNeeded(contentPane, id);
        
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
            id: id,
            minimum: 0,
            maximum: 100,
            discreteValues: 101,
            showButtons: true,
            // Doesn;t work: style: "align: center; width: 80%;"
            style: "width: 80%;"

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
            id: id + "_content",
            content: panelDiv
        });

        sliderContentPane.placeAt(contentPane);
        
        slider.startup();
        sliderRules.startup();
        sliderLabels.startup();
        sliderContentPane.startup();
        
        return contentPane;
    }
    
    function add_report(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_report: " + id + "</b>"       		
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_recommendationTable(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_recommendationTable: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_storyThemer(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_storyThemer: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_questionsTable(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_questionsTable: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    // TODO: Fix
    function add_questionAnswer(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_questionAnswer: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_graphBrowser(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_graphBrowser: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_trendsReport(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_trendsReport: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_clusterSpace(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var label = new ContentPane({
            // content: translate(id + "::prompt")
            content: "<b>UNFINISHED add_clusterSpace: " + id + "</b>"             
        });
        label.placeAt(contentPane);
        label.startup();
        return label;
    }
    
    function add_storyBrowser(contentPane, model, id, options) {
        addPromptTextIfNeeded(contentPane, id);
        
        var storyBrowser = StoryBrowser.insertStoryBrowser(id, contentPane, domain.pageDefinitions);
        return storyBrowser;
    }
    
    return {
        "add_label": add_label,
        "add_header": add_header,
        "add_image": add_image,
        "add_text": add_text,
        "add_textarea": add_textarea,
        "add_grid": add_grid,
        "add_select": add_select,
        "add_boolean": add_boolean,
        "add_checkbox": add_checkbox,
        "add_toggleButton": add_toggleButton,
        "add_button": add_button,
        "add_slider": add_slider,
        "add_report": add_report,
        "add_recommendationTable": add_recommendationTable,
        "add_questionsTable": add_questionsTable,
        "add_storyBrowser": add_storyBrowser,
        "add_storyThemer": add_storyThemer,
        "add_questionAnswer": add_questionAnswer,
        "add_graphBrowser": add_graphBrowser,
        "add_trendsReport": add_trendsReport,
        "add_clusterSpace": add_clusterSpace
    };
});