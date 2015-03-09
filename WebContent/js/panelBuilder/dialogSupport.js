define([
    "dojox/mvc/at",
    "dijit/form/Button",
    "dijit/ConfirmDialog",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    'dgrid/Grid',
    "dojo/_base/lang",
    "dijit/layout/LayoutContainer",
    "dojo/query",
    "dojo/Stateful",
    "dijit/form/Textarea",
    "./translate",
    "./widgetSupport",
    "dojo/_base/window"
], function(
    at,
    Button,
    ConfirmDialog,
    ContentPane,
    Dialog,
    Grid,
    lang,
    LayoutContainer,
    query,
    Stateful,
    Textarea,
    translate,
    widgetSupport,
    win
){
    "use strict";
    
    // TODO: Translate: Change to taking a translate ID
    // TODO: Buttons don't show up if window too narrow for dialog
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
        var dialogContentPane = new ContentPane();
        
        function hideDialogMethod(status) {
            dialog.hide();
        }
        
        dialogConfiguration.dialogConstructionFunction(dialogContentPane, model, hideDialogMethod, dialogConfiguration);
   
        dialog = new Dialog({
            // TODO: Translate
            title: translate(dialogConfiguration.dialogTitle),
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
    
    function openTextEditorDialog(text, dialogTitle, dialogOKButtonLabel, dialogOKCallback) {
        
        var model = new Stateful({text: text});
        
        var dialogConfiguration = {
            dialogTitle: dialogTitle,
            dialogStyle: "width: 600px; height: 800px",
            dialogConstructionFunction: build_textEditorDialogContent,
            dialogOKButtonLabel: dialogOKButtonLabel,
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
            label: translate(dialogConfiguration.dialogOKButtonLabel),
            type: "button",
            onClick: function() {
                var text = model.get("text");
                dialogConfiguration.dialogOKCallback(text, hideDialogMethod, dialogConfiguration);
            },
            region: 'bottom'
        });
        
        layout.addChild(sourceTextarea);
        layout.addChild(okButton);
 
        layout.placeAt(dialogContentPane);
    }
    
    // columns are in dgrid format
    function openListChoiceDialog(initialChoice, choices, columns, dialogTitle, dialogOKButtonLabel, dialogOKCallback) {
        
        var model = new Stateful({choice: initialChoice});
        
        var dialogConfiguration = {
            dialogTitle: dialogTitle,
            dialogStyle: "width: 600px; height: 800px",
            dialogConstructionFunction: buildListChoiceDialogContent,
            dialogOKButtonLabel: dialogOKButtonLabel,
            dialogOKCallback: dialogOKCallback,
            choices: choices,
            columns: columns
        };
        
        openDialog(model, dialogConfiguration);
    }
    
    function buildListChoiceDialogContent(dialogContentPane, model, hideDialogMethod, dialogConfiguration) {
        console.log("buildListChoiceDialogContent", dialogConfiguration.choices);
        var layout = new LayoutContainer({
        });
        
        var grid = new Grid({
            columns: dialogConfiguration.columns
        });

        var okButton = new Button({
            label: translate(dialogConfiguration.dialogOKButtonLabel),
            type: "button",
            onClick: function() {
                // var value = grid.get("value");
                // TODO: Fix
                var value = null;
                console.log("Selected value", value);
                hideDialogMethod();
                dialogConfiguration.dialogOKCallback(value, hideDialogMethod, dialogConfiguration);
            },
            region: 'bottom'
        });
        
        layout.addChild(grid);
        layout.addChild(okButton);
 
        layout.placeAt(dialogContentPane);
        
        grid.renderArray(dialogConfiguration.choices);
    }

    return {
        "addButtonThatLaunchesDialog": addButtonThatLaunchesDialog,
        "confirm": confirm,
        "openDialog": openDialog,
        "openTextEditorDialog": openTextEditorDialog,
        "openListChoiceDialog": openListChoiceDialog,
    };
   
});