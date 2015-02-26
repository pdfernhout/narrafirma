define([
    "dojo/_base/array",
    "dojox/mvc/at",
    "dojo/_base/lang",
    "../translate",
    "dijit/form/Button",
    "dijit/ConfirmDialog",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/layout/LayoutContainer",
    "dojo/Stateful",
    "dijit/form/Textarea"
], function(
    array,
    at,
    lang,
    translate,
    Button,
    ConfirmDialog,
    ContentPane,
    Dialog,
    LayoutContainer,
    Stateful,
    Textarea
){
    "use strict";
    
    function buildOptions(id, choices, optionsString){
        var options = [];
        
        if (choices) {
            array.forEach(choices, function(each) {
                // console.log("each1", each);
                var label = translate(id + "::selection:" + each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                // console.log("each2", each);
                var translateID = id + "::selection:" + each;
                if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
                var label = translate(translateID);
                options.push({label: label, value: each});
            });
        }
        
        return options;
    }
    
    // Types of questions that have data associated with them for filters and graphs
    var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

    // function updateFilterPaneForCurrentQuestions(questions) {
    function optionsForAllQuestions(questions) {
        var questionOptions = [];
        array.forEach(questions, function (question) {
            if (array.indexOf(filterableQuestionTypes, question.type) !== -1) {
                questionOptions.push({label: translate(question.id + "::shortName", "*FIXME -- Missing shortName translation for: " + question.id), value: question.id});
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
            label: translate(dialogConfiguration.dialogOpenButtonID),
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
            title: translate(dialogConfiguration.dialogTitleID),
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
            label: translate(dialogConfiguration.dialogOKButtonID),
            type: "button",
            onClick: function() {dialogConfiguration.dialogOKCallback(model.get("text"), hideDialogMethod, id, options, dialogConfiguration);},
            region: 'bottom'
        });
        
        layout.addChild(sourceTextarea);
        layout.addChild(okButton);
 
        layout.placeAt(dialogContentPane);
    }

    return {
        "buildOptions": buildOptions,
        "optionsForAllQuestions": optionsForAllQuestions,
        "confirm": confirm,
        "addButtonThatLaunchesDialog": addButtonThatLaunchesDialog,
        "openDialog": openDialog,
        "openTextEditorDialog": openTextEditorDialog
    };
   
});