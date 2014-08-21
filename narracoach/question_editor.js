"use strict";

define([
    "dojo/_base/array",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dijit/registry",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/Dialog",
    "dijit/form/Form",
], function(
    array,
    dom,
    domConstruct,
    domStyle,
    on,
    registry,
    translate,
    widgets,
    Dialog,
    Form
){
        
    var testPuppyQuestions = [
        {id: "name", type: "text", text: "Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "wantPuppy", type: "boolean", text: "Do you want a free puppy today?", help: "Enter yes or no"},
        {id: "reason", type: "text", text: "If yes, why do you want a free puppy?"},
    ];
    
    var createSurveyQuestions = [
        {id: "questionID", type: "text", text: "Question ID", help: 'TODO'},
        {id: "questionUse", type: "select", text: "Question Use", help: 'TODO', options: "story title\nstory text\nquestion about story\nquestion about participant"},
        {id: "questionType", type: "select", text: "Question Type", help: 'TODO', options: "text\ntextarea\nboolean\ncheckbox\nselect\nslider"},
        {id: "questionText", type: "textarea", text: "Question Text", help: 'TODO'},
        {id: "questionHelp", type: "textarea", text: "Question Help", help: 'TODO'},
        {id: "questionOptions", type: "textarea", text: "Question Options", help: 'Enter options here, one per line'},
    ];
        
    function insertQuestionIntoDiv(question, questionsDiv) {
        // console.log("question", question);
        var inputNode;
        if (question.type === "boolean") {
           inputNode = widgets.newBoolean(question.id);
        } else if (question.type === "checkbox") {
           inputNode = widgets.newCheckbox(question.id);
        } else if (question.type === "checkboxes") {
            inputNode = widgets.newCheckBoxes(question.id, question.choices, question.options);
        } else if (question.type === "text") {
            inputNode = widgets.newTextBox(question.id);
        } else if (question.type === "textarea") {
            inputNode = widgets.newSimpleTextArea(question.id);
        } else if (question.type === "select") {
            inputNode = widgets.newSelect(question.id, question.choices, question.options);
        } else if (question.type === "radio") {
            inputNode = widgets.newRadioButtons(question.id, question.choices, question.options);
        } else if (question.type === "slider") {
            inputNode = widgets.newSlider(question.id, question.options);
        } else {
            console.log("Unsupported question type: " + question.type);
            return;
        }

        var widget = registry.byId(question.id);
        if (!widget) console.log("No widget found for: " + question.id);
        if (question.value && widget) widget.set("value", question.value);

        var questionText;
        if (!question.text) {
            // Try to retrieve question help if not defined and present in translations.js
            questionText = translate(question.id);
        } else {
            // Otherwise, see if can translate the text if it is a tag
            questionText = translate(question.text, question.text);
        }

        var helpText = "";
        if (!question.help) {
            // Try to retrieve question help if not defined and present in helptexts.html
            helpText = translate(question.id + "_help", "");
        } else {
            // Otherwise, see if can translate the text if it is a tag
            helpText = translate(question.help, question.help);
        }
        // console.log("question help", question.id, question.help, helpText);
        
        var helpNode = null;
        if (helpText) {
            // var helpText = question.help.replace(/\"/g, '\\x22').replace(/\'/g, '\\x27');
            helpNode = widgets.newButton("?", null, function() {
                alert(helpText);
            });
            // help = ' <button onclick="alert(\'' + helpText + '\')">?</button>';
        }

        var questionDiv = document.createElement("div");
        questionDiv.id = question.id + "_div";
        questionDiv.className = "narracoachQuestion";
        questionDiv.setAttribute("data-narracoach-question-id", question.id);
        questionDiv.setAttribute("data-narracoach-question-type", question.type);
        questionDiv.appendChild(domConstruct.toDom(questionText));
        questionDiv.appendChild(document.createTextNode(" "));
        if (question.type === "textarea") questionDiv.appendChild(document.createElement("br"));
        questionDiv.appendChild(inputNode);
        if (helpNode) questionDiv.appendChild(helpNode);
        questionDiv.appendChild(document.createElement("br"));
        questionDiv.appendChild(domConstruct.toDom('<div id="' + question.id + '_trailer"/>'));
        questionDiv.appendChild(document.createElement("br"));
        questionsDiv.appendChild(questionDiv);

        if (question.changed && widget) {
            widget.on("change", question.changed);
            //question.changed(widget.get("value"));
        }

        if (question.visible !== undefined && !question.visible) domStyle.set(questionDiv, "display", "none");
    }
    
    function insertQuestionsIntoDiv(questions, questionsDiv) {
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            // console.log("insert", questionIndex, question);
            if (!question) console.log("ERROR in uestion definitions for ", questionsDiv, questionIndex, questions);
            question.index = questionIndex;
            insertQuestionIntoDiv(question, questionsDiv)
        }
    }
    
    function questionEditDialogOK(question, questionEditorDiv, form) {
        var changed = false;
        var queryFromNode = form.domNode;
        
        // TODO: Not reading data correctly
        
        var questionID = registry.byId("questionID").get("value");
        if (questionID !== question.id) {
            console.log("changed questionID");
            changed = true;
            question.id = questionID;
        }
        
        var questionType = registry.byId("questionType").get("value");
        if (questionType !== question.type) {
            console.log("changed questionType");
            changed = true;
            question.type = questionType;
        }
        
        var questionUse = registry.byId("questionUse").get("value");
        if (questionUse !== question.use) {
            console.log("changed questionUse");
            changed = true;
            question.use = questionUse;
        }
        
        var questionText = registry.byId("questionText").get("value");
        if (questionText !== question.text) {
            console.log("changed questionText");
            changed = true;
            question.text = questionText;
        }
        
        var questionHelp = registry.byId("questionHelp").get("value");
        if (questionHelp !== question.help) {
            console.log("changed questionHelp");
            changed = true;
            question.help = questionHelp;
        }
        
        var questionOptions = registry.byId("questionOptions").get("value");
        if (questionOptions !== question.options && (questionOptions || question.options)) {
            console.log("changed questionOptions");
            changed = true;
            question.options = questionOptions;
        }
        
        console.log("changed", changed);
        if (changed) {
            // empty does not seem to destroy widgets (as get duplicate dijit id warning later), but that seems wrong of dojo...
            // See: http://ibmmobiletipsntricks.com/2013/10/31/destroy-all-widgetsdijits-in-a-dom-node/
            var widgets = dijit.findWidgets(questionEditorDiv);
            array.forEach(widgets, function(widget) {
                widget.destroyRecursive(true);
            });
            domConstruct.empty(questionEditorDiv);
            insertQuestionEditorIntoDiv(question, questionEditorDiv);
        }
    }
    
    function showQuestionEditDialog(question, questionEditorDiv) {
        var questionEditDialog;
        
        var form = new Form();

        // Fill in defaults
        createSurveyQuestions[0].value = question.id;
        createSurveyQuestions[1].value = question.use;
        createSurveyQuestions[2].value = question.type;
        createSurveyQuestions[3].value = question.text;
        createSurveyQuestions[4].value = question.help;
        
        insertQuestionsIntoDiv(createSurveyQuestions, form.domNode);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("OK", form, function() {
            console.log("OK");
            questionEditDialog.hide();
            questionEditDialogOK(question, questionEditorDiv, form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("Cancel", form, function() {
            console.log("Cancel");
            questionEditDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        questionEditDialog = new Dialog({
            title: "Edit question " + question.index,
            content: form,
            style: "width: 600px; height 800px; overflow: auto;",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        questionEditDialog.startup();
        questionEditDialog.show();
    }
    
    function insertQuestionEditorIntoDiv(question, questionEditorDiv) {
        var idLabel = document.createElement("span");
        idLabel.innerHTML = "<b>" + question.id + "</b>";
        questionEditorDiv.appendChild(idLabel);
        var editButton = widgets.newButton("Edit", questionEditorDiv, function() {
            showQuestionEditDialog(question, questionEditorDiv);
        });
        var deleteButton = widgets.newButton("Delete", questionEditorDiv, function() {
            if (confirm("Proceed to delete question " + question.id + "?")) {
                questionEditorDiv.parentNode.removeChild(questionEditorDiv);
                }
        });
        questionEditorDiv.appendChild(document.createElement("br"));
        insertQuestionIntoDiv(question, questionEditorDiv);
        questionEditorDiv.appendChild(document.createElement("br"));
        questionEditorDiv.setAttribute("data-narracoach-question", JSON.stringify(question));
    }
        
    function insertQuestionEditorDivIntoDiv(question, questionsDiv) {
        var questionEditorDiv = document.createElement("div");
        questionEditorDiv.className = "narracoachQuestionEditor";
        insertQuestionEditorIntoDiv(question, questionEditorDiv);
        questionsDiv.appendChild(questionEditorDiv);
    }
    
    //insertQuestionsIntoDiv(testPuppyQuestions, questionsDiv);
    // insertQuestionsIntoDiv(createSurveyQuestions, questionsDiv);
    
    return {
    	"insertQuestionsIntoDiv": insertQuestionsIntoDiv,
    	"insertQuestionEditorDivIntoDiv": insertQuestionEditorDivIntoDiv
    };

});