import translate = require("./translate");
import m = require("mithril");

"use strict";

// TODO: Using a global here to avoid parameterizing mounted components until the following Mithril issue is resolved or clarified:
// https://github.com/lhorie/mithril.js/issues/638
var globalDialogConfiguration;

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
    // Remove the dialog when current event is finished being handled
    setTimeout(function() {
        m.mount(document.getElementById("dialogDiv"), null);
    }, 0);
}

class MithrilDialog {
    static controller() {
        console.log("Making MithrilDialog");
        return new MithrilDialog();
    }
    
    static view(controller) {
        console.log("MithrilDialog view called");
        try {
            return controller.calculateView(globalDialogConfiguration);
        } catch (e) {
            console.log("Problem creating dialog", e);
            alert("Problem creating dialog");
            hideDialogMethod();
            return m("div", "Problem creating dialog");
        }
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
        
        return m("div.overlay", m("div.modal-content", [
            m("b", translate(dialogConfiguration.dialogTitle)),
            m("div.modal-internal", internalView),
            m("button", {onclick: function() {
                if (dialogConfiguration.dialogOKCallback) {
                    dialogConfiguration.dialogOKCallback(dialogConfiguration, hideDialogMethod);
                } else {
                    hideDialogMethod();
                }
            }}, translate(args.dialogOKButtonLabel || "OK"))
        ]));
    }
}

export function openDialog(dialogConfiguration) {  
    console.log("openDialog", dialogConfiguration.dialogTitle); // JSON.stringify(dialogConfiguration));
    if (!dialogConfiguration.key) dialogConfiguration.key = "standardDialog";
    
    globalDialogConfiguration = dialogConfiguration; 
    setTimeout(function() {
        m.mount(document.getElementById("dialogDiv"), <any>MithrilDialog);
    }, 0);
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

// TODO: Have ListChooser use regular dialog to open it

class ListChooser {
    static controller() {
        console.log("Making ListChooser");
        return new ListChooser();
    }
    
    static view(controller) {
        console.log("ListChooser view called");
        
        return controller.calculateView(globalDialogConfiguration);
    }
    
    calculateView(args) {
        return m("div.overlay", m("div.modal-content", [
            m("b", args.dialogTitle),
            m("br"),
            args.dialogOKButtonLabel,
            m("br"),
            args.choices.map((choice) => {
                return m("button", {onclick: this.selectionMade.bind(this, args, choice)}, choice.name);
            })
        ]));
    }
    
    selectionMade(args, choice) {
        hideDialogMethod();
        args.dialogOKCallback(choice);
    }
    
}

// columns are currently ignored
// choices should be a list of objects with a name field, like: {name: "test", other: "???}
export function openListChoiceDialog(initialChoice, choices, columns, dialogTitle, dialogOKButtonLabel, dialogOKCallback) {
    if (!dialogTitle) dialogTitle = "Choices";
    if (!dialogOKButtonLabel) dialogOKButtonLabel = "Choose";
    
    globalDialogConfiguration = {
        key: "standardListChooser",
        initialChoice: initialChoice,
        choices: choices,
        columns: columns,
        dialogTitle: dialogTitle,
        dialogOKButtonLabel: dialogOKButtonLabel, 
        dialogOKCallback: dialogOKCallback
    };
    
    setTimeout(function() {
        m.mount(document.getElementById("dialogDiv"), <any>ListChooser);
    }, 0);
}

