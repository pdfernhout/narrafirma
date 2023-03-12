import translate = require("./translate");
import m = require("mithril");
import toaster = require("./toaster");

"use strict";

// Only supports one dialog at a time -- no nesting!
// Use an standard alert or confirm for one more level of nesting if needed.

// TODO: Using a global here to avoid parameterizing mounted components until the following Mithril issue is resolved or clarified:
// https://github.com/lhorie/mithril.js/issues/638
// If this is null, no dialog is drawn. If this is a valid configuration, dialog will be displayed.
let globalDialogConfiguration = null;

// Leaving one dialog mounted all the time to try to get around with re-creation of grids when dialog opens; maybe Mithril bug?
export function initialize() {
    m.mount(document.getElementById("dialogDiv"), <any>MithrilDialog);
}

// TODO: Translate: Change to taking a translate ID
// TODO: Buttons don't show up if window too narrow for dialog
export function confirm(message, okCallback) {
    const confirmed = window.confirm(message);
    if (confirmed) okCallback();
}

export function addButtonThatLaunchesDialog(fieldSpecification, dialogConfiguration) {
    const parts = [m("span", {"class": "button-text"}, translate(fieldSpecification.id, fieldSpecification.displayPrompt))];
    if (fieldSpecification.displayIconClass) {
        const icon = m("span", {"class": "buttonWithTextImage " + fieldSpecification.displayIconClass});
        if (fieldSpecification.displayIconPosition === "right") {
            parts.push(icon);
        } else {
            parts.unshift(icon);
        }
    }
    const button = m("button", {
        "class": "narrafirma-dialog-launching-button", 
        onclick: function() {
            openDialog(dialogConfiguration);
        }
    }, parts);
    if (fieldSpecification.displayPreventBreak) return button;
    return [button, m("br")];
}

function hideDialogMethod() {
    globalDialogConfiguration = null;
}

class MithrilDialog {
    static controller() {
        return new MithrilDialog();
    }
    
    static view(controller) {
        let dialogContent = [];
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
        const dialogConfiguration = args;
        let internalView;
        try {
            internalView = dialogConfiguration.dialogConstructionFunction(dialogConfiguration, hideDialogMethod);
        } catch (e) {
            console.log("Problem creating view", args, e);
            internalView = m("div", "Problem creating view");
        }
        
        const parts = [
            m("b", translate(dialogConfiguration.dialogTitle)),
            m("div.modal-internal", internalView)
        ];
        
        const bottomPanelButtons = [];

        if (dialogConfiguration.dialogCopyButtonLabel) {
            bottomPanelButtons.push(
                m("button", {
                    onclick: function() 
                    {  
                        const textAreas = document.getElementsByClassName("textEditorInDialog");
                        if (textAreas.length) {
                            const value = (textAreas[0] as HTMLTextAreaElement).value;
                            window.navigator['clipboard'].writeText(value);
                            toaster.toast("Copied to clipboard", "message", 800);
                        }
                    }, 
                "class": "narrafirma-dialog-copy-button"}, 
                translate(args.dialogCopyButtonLabel)
                )
            );
        }

        if (!dialogConfiguration.dialogOKButtonHidden) {
            bottomPanelButtons.push(m("button", {onclick: function() {
                if (dialogConfiguration.dialogOKCallback) {
                    dialogConfiguration.dialogOKCallback(dialogConfiguration, hideDialogMethod);
                } else {
                    hideDialogMethod();
                }
            }, "class": "narrafirma-dialog-ok-button"}, translate(args.dialogOKButtonLabel || "OK")));
        }

        if (dialogConfiguration.dialogCancelButtonLabel) {
            bottomPanelButtons.push(m("button", {onclick: function() {
                hideDialogMethod();
            }, "class": "narrafirma-dialog-cancel-button"}, translate(args.dialogCancelButtonLabel)));
        }
        parts.push(m("div.modal-button-panel", bottomPanelButtons));
        return m("div.overlay", m("div.modal-content", {"class": dialogConfiguration.dialogClass}, parts));
    }
}

export function openDialog(dialogConfiguration) {  
    if (!dialogConfiguration.key) dialogConfiguration.key = "standardDialog";
    
    globalDialogConfiguration = dialogConfiguration; 
}

// Caller needs to call the hideDialogMethod returned as the second arg of dialogOKCallback to close the dialog
export function openTextEditorDialog(text, dialogTitle, dialogOKButtonLabel, dialogCopyButtonLabel, dialogOKCallback, showCancelButton = true, readOnly = false) {
    if (!dialogTitle) dialogTitle = "Editor";
    if (!dialogOKButtonLabel) dialogOKButtonLabel = "OK";
    
    const model = {text: text};
    const dialogConfiguration = {
        dialogModel: model,
        dialogTitle: dialogTitle,
        dialogClass: undefined,
        dialogReadOnly: readOnly,
        dialogCopyButtonLabel: dialogCopyButtonLabel,
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
    
    const model = {
        progressText: progressText,
        hideDialogMethod: hideDialogMethod,
        redraw: m.redraw,
        cancelled: false,
        failed: false
    };
    const dialogConfiguration = {
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
    
    const model = {
        finishedText: finishedText,
        hideDialogMethod: hideDialogMethod,
        redraw: m.redraw,
        cancelled: false,
        failed: false
    };
    const dialogConfiguration = {
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
    
    const dialogConfiguration = {
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
        const name = prompt("New project name?");
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


