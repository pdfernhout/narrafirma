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
        return new MithrilDialog();
    }
    
    static view(controller) {
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
            }, "class": "narrafirma-dialog-ok-button"}, translate(args.dialogOKButtonLabel || "OK")));
        }
        
        if (dialogConfiguration.dialogCancelButtonLabel) {
           parts.push(m("button", {onclick: function() {
                hideDialogMethod();
            }, "class": "narrafirma-dialog-cancel-button"}, translate(args.dialogCancelButtonLabel)));
        }
        return m("div.overlay", m("div.modal-content", {"class": dialogConfiguration.dialogClass}, parts));
    }
}

export function openDialog(dialogConfiguration) {  
    if (!dialogConfiguration.key) dialogConfiguration.key = "standardDialog";
    
    globalDialogConfiguration = dialogConfiguration; 
}

// Caller needs to call the hideDialogMethod returned as the second arg of dialogOKCallback to close the dialog
export function openTextEditorDialog(text, dialogTitle, dialogOKButtonLabel, dialogOKCallback, showCancelButton = true, readOnly = false) {
    if (!dialogTitle) dialogTitle = "Editor";
    if (!dialogOKButtonLabel) dialogOKButtonLabel = "OK";
    
    var model = {text: text};
    
    var dialogConfiguration = {
        dialogModel: model,
        dialogTitle: dialogTitle,
        dialogClass: undefined,
        dialogReadOnly: readOnly,
        dialogConstructionFunction: build_textEditorDialogContent,
        dialogOKButtonLabel: dialogOKButtonLabel,
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { dialogOKCallback(model.text, hideDialogMethod); },
        dialogCancelButtonLabel: showCancelButton ? "Cancel" : ""
    };
    
    openDialog(dialogConfiguration);
}

function build_textEditorDialogContent(dialogConfiguration, hideDialogMethod) {
    return m("div", [
        m("textarea", 
            {
                key: "standardTextEditorTextarea", 
                class: "textEditorInDialog", 
                onchange: function(event) { dialogConfiguration.dialogModel.text = event.target.value; }, 
                value: dialogConfiguration.dialogModel.text,
                disabled: dialogConfiguration.dialogReadOnly
            }
        ) 
    ]);
}

// Caller needs to call the hideDialogMethod returned as the second arg of dialogOKCallback to close the dialog
export function openProgressDialog(progressText, dialogTitle, cancelButtonLabel, dialogCancelCallback) {
    if (!dialogTitle) dialogTitle = "Progress";
    if (!cancelButtonLabel) cancelButtonLabel = "Cancel";
    
    var model = {
        progressText: progressText,
        hideDialogMethod: hideDialogMethod,
        redraw: m.redraw,
        cancelled: false,
        failed: false
    };
    
    var dialogConfiguration = {
        dialogModel: model,
        dialogTitle: dialogTitle,
        dialogClass: undefined,
        dialogConstructionFunction: build_progressDialogContent,
        // Use OK button isntead of Cancel because it has a callback and represents the action button
        dialogOKButtonLabel: cancelButtonLabel,
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { dialogCancelCallback(dialogConfiguration, hideDialogMethod); }
    };
    
    openDialog(dialogConfiguration);
    
    return model;
}

function build_progressDialogContent(dialogConfiguration, hideDialogMethod) {
    return m("div", dialogConfiguration.dialogModel.progressText);
}

export function openFinishedDialog(finishedText, dialogTitle, okButtonLabel, cancelButtonLabel, dialogOKCallback) {
    if (!dialogTitle) dialogTitle = "Finished";
    if (!okButtonLabel) okButtonLabel = "OK";
    if (!cancelButtonLabel) cancelButtonLabel = "Cancel";
    
    var model = {
        finishedText: finishedText,
        hideDialogMethod: hideDialogMethod,
        redraw: m.redraw,
        cancelled: false,
        failed: false
    };
    
    var dialogConfiguration = {
        dialogModel: model,
        dialogTitle: dialogTitle,
        dialogClass: undefined,
        dialogConstructionFunction: build_finishedDialogContent,
        // Use OK button instead of Cancel because it has a callback and represents the action button
        dialogOKButtonLabel: okButtonLabel,
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { dialogOKCallback(dialogConfiguration, hideDialogMethod); },
        dialogCancelButtonLabel: cancelButtonLabel
    };
    
    openDialog(dialogConfiguration);
    
    return model;
}

function build_finishedDialogContent(dialogConfiguration, hideDialogMethod) {
    return m("div", dialogConfiguration.dialogModel.finishedText);
}

// columns are currently ignored
// choices should be a list of objects with a name field, like: {name: "test", other: "???}
export function openListChoiceDialog(initialChoice, choices, columns, dialogTitle, dialogOKButtonLabel, isNewAllowed, dialogOKCallback) {
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
        dialogOKButtonHidden: true,
        isNewAllowed: isNewAllowed
    };
    
    openDialog(dialogConfiguration);
}

function build_listChooserDialogContent(dialogConfiguration, hideDialogMethod) {
    
    function selectionMade(args, choice) {
        hideDialogMethod();
        args.dialogOKCallback(choice);
    }
    
    function makeNewListItem(args, choice) {
        // TODO: Translate
        var name = prompt("New project name?");
        if (!name) return;
        hideDialogMethod();
        args.dialogOKCallback({id: name, name: name, isNew: true});
    }

    // style: "min-height: 400px; min-width: 600px; max-height: 800px; max-width: 800px; overflow: auto"
    return [
        dialogConfiguration.dialogOKButtonLabel, 
        m("br"),
        dialogConfiguration.choices.sort((a, b) => {return a.name.localeCompare(b.name); }).map((choice) => {
            return [
                m("button", {onclick: selectionMade.bind(null, dialogConfiguration, choice)}, choice.name), m("br")
            ];
        }),
        m("br"),
        dialogConfiguration.isNewAllowed ?
            m("button", {onclick: makeNewListItem.bind(null, dialogConfiguration)}, "[Make new project]") 
        : 
            m("div")
    ];
}



