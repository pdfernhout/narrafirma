define([
    "dojox/mvc/at",
    "dijit/form/Button",
    "dijit/ConfirmDialog",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dojo/_base/lang",
    "dijit/layout/LayoutContainer",
    "dijit/form/MultiSelect",
    "dojo/query",
    "dojo/Stateful",
    "dijit/form/Textarea",
    "./translate",
    "dojo/_base/window"
], function(
    at,
    Button,
    ConfirmDialog,
    ContentPane,
    Dialog,
    lang,
    LayoutContainer,
    MultiSelect,
    query,
    Stateful,
    Textarea,
    translate,
    win
){
    "use strict";
    
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
        dialogContentPaneID: "???",
        dialogTitleID: "???",
        dialogStyle: "height: 500px",
        dialogConstructionFunction: ???
    };
    */
    
    // TODO: Should probably improve how IDs for translations work, by maybe just passing in string that either has # already or is used as is
    
    function addButtonThatLaunchesDialog(contentPane, model, fieldSpecification, dialogConfiguration) {
        var callback = function() {
            openDialog(model, dialogConfiguration);
        };
        
        var button = new Button({
            label: translate(fieldSpecification.id, fieldSpecification.displayPrompt),
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
    
    function openDialog(model, dialogConfiguration) {  
        console.log("openDialog", model, JSON.stringify(dialogConfiguration));
        
        var dialog;
        var dialogContentPane = new ContentPane({id: dialogConfiguration.dialogContentPaneID});
        
        function hideDialogMethod(status) {
            dialog.hide();
        }
        
        dialogConfiguration.dialogConstructionFunction(dialogContentPane, model, hideDialogMethod, dialogConfiguration);
   
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
        
        openDialog(model, dialogConfiguration);
    }
    
    function build_textEditorDialogContent(dialogContentPane, model, hideDialogMethod, dialogConfiguration) {
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
            onClick: function() {dialogConfiguration.dialogOKCallback(model.get("text"), hideDialogMethod, dialogConfiguration);},
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
        
        openDialog(model, dialogConfiguration);
    }
    
    function buildListChoiceDialogContent(dialogContentPane, model, hideDialogMethod, dialogConfiguration) {    
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
            label: translate(dialogConfiguration.dialogOKButtonID),
            type: "button",
            onClick: function() {dialogConfiguration.dialogOKCallback(model.get("choice"), hideDialogMethod, dialogConfiguration);},
            region: 'bottom'
        });
        
        layout.addChild(multiSelect);
        layout.addChild(okButton);
 
        layout.placeAt(dialogContentPane);
    }

    return {
        "addButtonThatLaunchesDialog": addButtonThatLaunchesDialog,
        "confirm": confirm,
        "openDialog": openDialog,
        "openTextEditorDialog": openTextEditorDialog,
        "openListChoiceDialog": openListChoiceDialog,
    };
   
});