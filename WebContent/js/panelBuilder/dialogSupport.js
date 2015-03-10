define([
    "dojox/mvc/at",
    "dijit/form/Button",
    'dgrid/extensions/ColumnResizer',
    "dijit/ConfirmDialog",
    "dijit/layout/ContentPane",
    'dojo/_base/declare',
    "dijit/Dialog",
    'dgrid/extensions/DijitRegistry',
    'dgrid/Grid',
    'dgrid/Keyboard',
    "dojo/_base/lang",
    "dijit/layout/LayoutContainer",
    "dojo/query",
    'dgrid/Selection',
    "dojo/Stateful",
    "dijit/form/Textarea",
    "./translate",
    "./widgetSupport",
    "dojo/_base/window"
], function(
    at,
    Button,
    ColumnResizer,
    ConfirmDialog,
    ContentPane,
    declare,
    Dialog,
    DijitRegistry,
    Grid,
    Keyboard,
    lang,
    LayoutContainer,
    query,
    Selection,
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
        console.log("openDialog", model, dialogConfiguration.dialogTitle); // JSON.stringify(dialogConfiguration));
        
        var dialog;
        var dialogContentPane = new ContentPane({
            // min-height: 100%; min-width: 100%"
        });
        
        function hideDialogMethod(status) {
            dialog.hide();
        }
        
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
                
        dialog.show();
        
        // Calling this after dialog opened so dgrid resizes headers correctly for data
        dialogConfiguration.dialogConstructionFunction(dialogContentPane, model, hideDialogMethod, dialogConfiguration); 
    }
    
    // Caller needs to call the hideDialogMethod returned as the second arg of dialogOKCallback to close the dialog
    function openTextEditorDialog(text, dialogTitle, dialogOKButtonLabel, dialogOKCallback) {
        if (!dialogTitle) dialogTitle = "Editor";
        if (!dialogOKButtonLabel) dialogOKButtonLabel = "OK";
        
        var model = new Stateful({text: text});
        
        var dialogConfiguration = {
            dialogTitle: dialogTitle,
            dialogStyle: undefined,
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
            placeHolder: dialogConfiguration.placeHolder,
            region: 'center',  
            style: "min-height: 400px; min-width: 600px; max-height: 800px; max-width: 800px; overflow: auto"
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
        if (!dialogTitle) dialogTitle = "Choices";
        if (!dialogOKButtonLabel) dialogOKButtonLabel = "Choose";
        
        var model = new Stateful({choice: initialChoice});
        
        var dialogConfiguration = {
            dialogTitle: dialogTitle,
            dialogStyle: undefined,
            dialogConstructionFunction: buildListChoiceDialogContent,
            dialogOKButtonLabel: dialogOKButtonLabel,
            dialogOKCallback: dialogOKCallback,
            choices: choices,
            columns: columns
        };
        
        openDialog(model, dialogConfiguration);
    }
    
    function buildListChoiceDialogContent(dialogContentPane, model, hideDialogMethod, dialogConfiguration) {
        console.log("buildListChoiceDialogContent", dialogConfiguration.dialogTitle);
        var layout = new LayoutContainer({
            style: "min-height: 400px; min-width: 600px; max-height: 800px; max-width: 800px"
        });
        
        // Including DijitRegistry because nesting the grid inside of dijit layout container
        var grid = new (declare([Grid, Selection, Keyboard, DijitRegistry, ColumnResizer]))({
            columns: dialogConfiguration.columns,
            region: 'center',
            selectionMode: 'single'
            // style: "min-height: 400px; min-width: 600px;"
        });

        var okButton = new Button({
            label: translate(dialogConfiguration.dialogOKButtonLabel),
            type: "button",
            onClick: function() {
                console.log("grid selection", grid.selection);
                var value = null;
                // Find first selection (and there should only be one)
                for (var key in grid.selection) {
                    if (grid.selection[key]) value = dialogConfiguration.choices[key];
                    break;
                }
                console.log("Selected value", value);
                hideDialogMethod();
                dialogConfiguration.dialogOKCallback(value, dialogConfiguration);
            },
            region: 'top'
        });
        
        layout.addChild(grid);
        layout.addChild(okButton);
        
        layout.placeAt(dialogContentPane);
        
        grid.renderArray(dialogConfiguration.choices);
        
        var selectedIndex = dialogConfiguration.choices.indexOf(model.get("choice"));
        if (selectedIndex !== -1) {
            grid.select(selectedIndex);
        }
        
        dialogConfiguration.grid = grid;
    }

    return {
        "addButtonThatLaunchesDialog": addButtonThatLaunchesDialog,
        "confirm": confirm,
        "openDialog": openDialog,
        "openTextEditorDialog": openTextEditorDialog,
        "openListChoiceDialog": openListChoiceDialog,
    };
   
});