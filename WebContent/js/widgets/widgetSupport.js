define([
    "dojo/_base/array",
    "dojox/mvc/at",
    "dijit/form/Button",
    "dijit/ConfirmDialog",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dojo/dom-construct",
    "dijit/form/FilteringSelect",
    "dojo/_base/lang",
    "dijit/layout/LayoutContainer",
    "dojo/store/Memory",
    "dijit/form/MultiSelect",
    "dojo/query",
    "dojo/Stateful",
    "dijit/form/Textarea",
    "../translate",
    "dojo/_base/window"
], function(
    array,
    at,
    Button,
    ConfirmDialog,
    ContentPane,
    Dialog,
    domConstruct,
    FilteringSelect,
    lang,
    LayoutContainer,
    Memory,
    MultiSelect,
    query,
    Stateful,
    Textarea,
    translate,
    win
){
    "use strict";
    
    function setOptionsInMultiSelect(widget, options) {
        // console.log("setOptionsInMultiSelect", widget, options);
        query('option', widget.domNode).forEach(function(node, index, arr) {
            domConstruct.destroy(node);
        }); 
        
        for (var i = 0; i < options.length; i++) {
            var c = win.doc.createElement('option');
            c.innerHTML = options[i].label;
            c.value = options[i].value;
            widget.domNode.appendChild(c);
        }
    }
    
    function newMultiSelect(options, value) {
        var widget = new MultiSelect({
            "size": 12,
            "style": "width: 100%;",
            value: value
        });
        
        setOptionsInMultiSelect(widget, options);
        
        return widget;
    }
    
    function buildOptions(id, choices, optionsString){
        var options = [];
        
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("each1", each);
                var label = translate("#" + id + "::selection:" + each, each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("each2", each);
                var translateID = id + "::selection:" + each;
                if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
                var label = translate("#" + translateID, each);
                options.push({label: label, value: each});
            });
        }
        
        return options;
    }
    
    // TODO: Two GUI components without translation here temporarily
    function newButton(id, label_translate_id, addToDiv, callback) {
        if (label_translate_id === null) label_translate_id = id;
        var label = translate("#" + label_translate_id);
        
        var button = new Button({
            id: id,
            label: label,
            type: "button",
            onClick: callback
        });
        if (lang.isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            button.placeAt(addToDiv);
        }
        return button;
    }
    
    // TODO: Remove optionsString parameter after checking for all users; perhaps check if "choices" is a string and if so split it?
    function newSelect(id, choices, optionsString, addToDiv, addNoSelectionOption) {
        var options = [];
        if (addNoSelectionOption) options.push({name: translate("#selection_has_not_been_made", "-- selection has not been made --"), id: "", selected: true});
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("choice", id, each);
                if (lang.isString(each)) {
                    // TODO: Add translation support here somehow
                    var label = each; // translate("#" + id + "_choice_" + each);
                    options.push({name: label, id: each});
                } else {
                    // TODO: Maybe bug in dojo select that it does not handle values that are not strings
                    // http://stackoverflow.com/questions/16205699/programatically-change-selected-option-of-a-dojo-form-select-that-is-populated-b
                    options.push({name: each.label, id: each.value});
                }
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("option", id, each);
                options.push({name: each, id: each});
            });
        } else {
            console.log("No choices or options defined for select", id);
        }
        
        var dataStore = new Memory({"data": options});
        
        var select = new FilteringSelect({
                id: id,
                store: dataStore,
                searchAttr: "name",
                // TODO: Work on validation...
                required: false
                // style: "width: 100%"
        });
        if (lang.isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            select.placeAt(addToDiv);
        }
        return select;
    }
    
    // Types of questions that have data associated with them for filters and graphs
    var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

    // function updateFilterPaneForCurrentQuestions(questions) {
    function optionsForAllQuestions(questions) {
        var questionOptions = [];
        array.forEach(questions, function (question) {
            if (array.indexOf(filterableQuestionTypes, question.displayType) !== -1) {
                questionOptions.push({label: translate("#" + question.id + "::shortName", question.displayName), value: question.id});
            }
        });
        return questionOptions;
    }
    
    // TODO: Translate: Change to taking a translate ID
    // TODO: Buttons don't show up if window to narrow for dialog
    function confirm(message, okCallback) {
        var dialog = new ConfirmDialog({
            title: "Confirm",
            content: message,
            style: "width: 300px",
            onExecute: okCallback
            // TODO: onCancel: cancelCallback
        });
        dialog.show();
    }
    
    /*
    var dialogConfiguration = {
        dialogOpenButtonID: "???",
        dialogContentPaneID: "???",
        dialogTitleID: "???",
        dialogStyle: "height: 500px",
        dialogConstructionFunction: ???
    };
    */
    function addButtonThatLaunchesDialog(contentPane, model, id, options, dialogConfiguration) {
        // if (!callback) callback = lang.partial(domain.buttonClicked, contentPane, model, id, questionOptions);
        var callback = function() {
            openDialog(model, id, options, dialogConfiguration);
        };
        
        var button = new Button({
            label: translate("#" + dialogConfiguration.dialogOpenButtonID),
            type: "button",
            onClick: callback
        });

        button.placeAt(contentPane);
        
        var wrap = new ContentPane({
            content: "<br>"
        });
        wrap.placeAt(contentPane);
        
        return button;
    }
    
    function openDialog(model, id, options, dialogConfiguration) {  
        console.log("openDialog model, id, options", model, id, options, JSON.stringify(dialogConfiguration));
        
        var dialog;
        var dialogContentPane = new ContentPane({id: dialogConfiguration.dialogContentPaneID});
        
        function hideDialogMethod(status) {
            dialog.hide();
        }
        
        dialogConfiguration.dialogConstructionFunction(dialogContentPane, model, id, options, hideDialogMethod, dialogConfiguration);
   
        dialog = new Dialog({
            // TODO: Translate
            title: translate("#" + dialogConfiguration.dialogTitleID),
            style: dialogConfiguration.dialogStyle,
            content: dialogContentPane
        });
        
        // This will free the dialog when we are done with it whether from OK or Cancel to avoid a memory leak
        dialog.connect(dialog, "onHide", function(e) {
            console.log("destroying dialog");
            dialog.destroyRecursive(); 
        });
                
        dialog.startup(); 
        dialog.show();
    }
    
    // dialogContentPaneID "textEditorDialog" dialogTitleID "title_textEditorDialog"
    function openTextEditorDialog(text, dialogContentPaneID, dialogTitleID, dialogOKButtonID, dialogOKCallback) {
        
        var model = new Stateful({text: text});
        
        var dialogConfiguration = {
                dialogContentPaneID: dialogContentPaneID,
                dialogTitleID: dialogTitleID,
                dialogStyle: "width: 600px; height: 800px",
                dialogConstructionFunction: build_textEditorDialogContent,
                dialogOKButtonID: dialogOKButtonID,
                dialogOKCallback: dialogOKCallback
            };
        
        openDialog(model, dialogContentPaneID, {}, dialogConfiguration);
    }
    
    function build_textEditorDialogContent(dialogContentPane, model, id, options, hideDialogMethod, dialogConfiguration) {
        // Experiment; lots of tries!!! http://jsfiddle.net/u3qcbxy4/37/
        
        var layout = new LayoutContainer({
        });
        
        // Maybe SimpleTextarea?
        var sourceTextarea = new Textarea({
            name: 'text',
            value: at(model, "text"),
            placeHolder: dialogConfiguration.placeHolder, // "[]",
            region: 'center',  
            style: "overflow: auto; height: 90%; max-height: 90%; width: 98%; max-width: 98%"
        });
        
        var okButton = new Button({
            label: translate("#" + dialogConfiguration.dialogOKButtonID),
            type: "button",
            onClick: function() {dialogConfiguration.dialogOKCallback(model.get("text"), hideDialogMethod, id, options, dialogConfiguration);},
            region: 'bottom'
        });
        
        layout.addChild(sourceTextarea);
        layout.addChild(okButton);
 
        layout.placeAt(dialogContentPane);
    }
    
    function openListChoiceDialog(choices, initialChoice, dialogContentPaneID, dialogTitleID, dialogOKButtonID, dialogOKCallback) {
        
        var model = new Stateful({choice: initialChoice});
        
        var dialogConfiguration = {
                dialogContentPaneID: dialogContentPaneID,
                dialogTitleID: dialogTitleID,
                dialogStyle: "width: 600px; height: 800px",
                dialogConstructionFunction: buildListChoiceDialogContent,
                dialogOKButtonID: dialogOKButtonID,
                dialogOKCallback: dialogOKCallback,
                choices: choices
            };
        
        openDialog(model, dialogContentPaneID, {}, dialogConfiguration);
    }
    
    function buildListChoiceDialogContent(dialogContentPane, model, id, options, hideDialogMethod, dialogConfiguration) {    
        var layout = new LayoutContainer({
        });
        
        var choiceOptions = [];
        for (var index = 0; index < dialogConfiguration.choices.length; index++) {
            var choice = dialogConfiguration.choices[index];
            // TODO: Maybe translate?
            choiceOptions.push({label: "" + choice, value: choice});
        }
        
        var multiSelect = new MultiSelect({
            name: 'multiselect-popup',
            value: at(model, "choice"),
            option: choiceOptions,
            region: 'center',  
            style: "overflow: auto; height: 90%; max-height: 90%; width: 98%; max-width: 98%"            
        });
        
        var okButton = new Button({
            label: translate("#" + dialogConfiguration.dialogOKButtonID),
            type: "button",
            onClick: function() {dialogConfiguration.dialogOKCallback(model.get("choice"), hideDialogMethod, id, options, dialogConfiguration);},
            region: 'bottom'
        });
        
        layout.addChild(multiSelect);
        layout.addChild(okButton);
 
        layout.placeAt(dialogContentPane);
    }

    return {
        "buildOptions": buildOptions,
        "optionsForAllQuestions": optionsForAllQuestions,
        newButton: newButton,
        newSelect: newSelect,
        "confirm": confirm,
        "addButtonThatLaunchesDialog": addButtonThatLaunchesDialog,
        "openDialog": openDialog,
        "openTextEditorDialog": openTextEditorDialog,
        "openListChoiceDialog": openListChoiceDialog,
        setOptionsInMultiSelect: setOptionsInMultiSelect,
        newMultiSelect: newMultiSelect
    };
   
});