import translate = require("./translate");
import m = require("mithril");

"use strict";

// Only supports one dialog at a time -- no nesting!
// Use an standard alert or confirm for one more level of nesting if needed.

// TODO: Using a global here to avoid parameterizing mounted components until the following Mithril issue is resolved or clarified:
// https://github.com/lhorie/mithril.js/issues/638
// If this is null, no dialog is drawn. If this is a valid configuration, dialog will be displayed.
var globalDialogConfiguration = null;

// Leaving one dialog mounted all the time to try to get around with re-creation of grids when dialog opens; maybe Mithril bug?
export function initialize() {
    m.mount(document.getElementById("dialogDiv"), <any>MithrilDialog);
}

// TODO: Translate: Change to taking a translate ID
// TODO: Buttons don't show up if window too narrow for dialog
export function confirm(message, okCallback) {
    var confirmed = window.confirm(message);
    if (confirmed) okCallback();
}

export function addButtonThatLaunchesDialog(fieldSpecification, dialogConfiguration) {
    return m("button", {
        "class": "narrafirma-dialog-launching-button", 
        onclick: function() {
            openDialog(dialogConfiguration);
        }
    }, translate(fieldSpecification.id, fieldSpecification.displayPrompt));
}

function hideDialogMethod() {
    globalDialogConfiguration = null;
}

class MithrilDialog {
    static controller() {
        console.log("Making MithrilDialog");
        return new MithrilDialog();
    }
    
    static view(controller) {
        console.log("MithrilDialog view called");
        var dialogContent = [];
        
        if (globalDialogConfiguration) {
            try {
                dialogContent = controller.calculateView(globalDialogConfiguration);
            } catch (e) {
                console.log("Problem creating dialog", e);
                alert("Problem creating dialog");
                hideDialogMethod();
                // dialogContent = m("div", "Problem creating dialog");
            }
        }
        
        return m("div.dialogContentWrapper", dialogContent); 
    }
    
    calculateView(args) {
        var dialogConfiguration = args;
        console.log("MithrilDalog calculateView", dialogConfiguration);
        
        var internalView;
        try {
            internalView = dialogConfiguration.dialogConstructionFunction(dialogConfiguration, hideDialogMethod);
        } catch (e) {
            console.log("Problem creating view", args, e);
            internalView = m("div", "Problem creating view");
        }
        
        var parts = [
            m("b", translate(dialogConfiguration.dialogTitle)),
            m("div.modal-internal", internalView)
        ];
        
        if (!dialogConfiguration.dialogOKButtonHidden) {
            parts.push(m("button", {onclick: function() {
                if (dialogConfiguration.dialogOKCallback) {
                    dialogConfiguration.dialogOKCallback(dialogConfiguration, hideDialogMethod);
                } else {
                    hideDialogMethod();
                }
            }}, translate(args.dialogOKButtonLabel || "OK")));
        }
        return m("div.overlay", m("div.modal-content", {"class": dialogConfiguration.dialogStyle}, parts));
    }
}

export function openDialog(dialogConfiguration) {  
    console.log("openDialog", dialogConfiguration.dialogTitle); // JSON.stringify(dialogConfiguration));
    if (!dialogConfiguration.key) dialogConfiguration.key = "standardDialog";
    
    globalDialogConfiguration = dialogConfiguration; 
}

// Caller needs to call the hideDialogMethod returned as the second arg of dialogOKCallback to close the dialog
export function openTextEditorDialog(text, dialogTitle, dialogOKButtonLabel, dialogOKCallback) {
    console.log("openTextEditorDialog called");
    if (!dialogTitle) dialogTitle = "Editor";
    if (!dialogOKButtonLabel) dialogOKButtonLabel = "OK";
    
    var model = {text: text};
    
    var dialogConfiguration = {
        dialogModel: model,
        dialogTitle: dialogTitle,
        dialogStyle: undefined,
        dialogConstructionFunction: build_textEditorDialogContent,
        dialogOKButtonLabel: dialogOKButtonLabel,
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { dialogOKCallback(model.text, hideDialogMethod); }
    };
    
    openDialog(dialogConfiguration);
}

function build_textEditorDialogContent(dialogConfiguration, hideDialogMethod) {
    // style: "min-height: 400px; min-width: 600px; max-height: 800px; max-width: 800px; overflow: auto"
    return m("div", [
        m("textarea", {key: "standardTextEditorTextarea", "class": "textEditorInDialog", onchange: function(event) { dialogConfiguration.dialogModel.text = event.target.value; }, value: dialogConfiguration.dialogModel.text }) 
    ]);
}

// columns are currently ignored
// choices should be a list of objects with a name field, like: {name: "test", other: "???}
export function openListChoiceDialog(initialChoice, choices, columns, dialogTitle, dialogOKButtonLabel, dialogOKCallback) {
    if (!dialogTitle) dialogTitle = "Choices";
    if (!dialogOKButtonLabel) dialogOKButtonLabel = "Choose";
    
    var dialogConfiguration = {
        key: "standardListChooser",
        initialChoice: initialChoice,
        choices: choices,
        columns: columns,
        dialogTitle: dialogTitle,
        dialogOKButtonLabel: dialogOKButtonLabel, 
        dialogOKCallback: dialogOKCallback,
        dialogConstructionFunction: build_listChooserDialogContent,
        dialogOKButtonHidden: true
    };
    
    openDialog(dialogConfiguration);
}

function build_listChooserDialogContent(dialogConfiguration, hideDialogMethod) {
    
    function selectionMade(args, choice) {
        hideDialogMethod();
        args.dialogOKCallback(choice);
    }
    
    // style: "min-height: 400px; min-width: 600px; max-height: 800px; max-width: 800px; overflow: auto"
    return m("div.overlay", m("div.modal-content", [
        m("b", dialogConfiguration.dialogTitle),
        m("br"),
        dialogConfiguration.dialogOKButtonLabel,
        m("br"),
        dialogConfiguration.choices.map((choice) => {
            return m("button", {onclick: selectionMade.bind(null, dialogConfiguration, choice)}, choice.name);
        })
    ]));
}



