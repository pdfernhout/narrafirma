"use strict";

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
        "dojox/charting/plot2d/Bars",
        "dijit/form/Button",
        "dijit/form/CheckBox",
        "dijit/layout/ContentPane",
        "dijit/form/FilteringSelect",
        "dijit/form/HorizontalRule",
        "dijit/form/HorizontalRuleLabels",
        "dijit/form/HorizontalSlider",
        "dojo/store/Memory",
        "dijit/form/RadioButton",
        "dijit/form/Select",
        "dijit/form/SimpleTextarea",
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
        Bars,
        Button,
        CheckBox,
        ContentPane,
        FilteringSelect,
        HorizontalRule,
        HorizontalRuleLabels,
        HorizontalSlider,
        Memory,
        RadioButton,
        Select,
        SimpleTextarea,
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
    
    return {
        "add_label": add_label,
        "add_image": add_image,
        "add_text": add_text,
        "add_textarea": add_textarea
    };
});