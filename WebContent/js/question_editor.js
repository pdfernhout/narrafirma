"use strict";

define([
    "dojo/_base/array",
    "dojo/dom",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dijit/registry",
    "js/translate",
    "js/widgets",
    "dijit/Dialog",
    "dijit/form/Form",
], function(
    array,
    dom,
    domain,
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
    
    var entryTypes = [
        "boolean",
        "checkbox",
        "checkboxes",
        "text",
        "textarea", 
        "select",
        "radio",
        "slider"
    ];
 
    var supportedTypes = [
        "boolean",
        "label",
        "header",
        "checkbox",
        "checkboxes",
        "text",
        "textarea", 
        "select",
        "radio",
        "slider",
        "questionAnswer",
        "questionAnswerCountOfTotalOnPage"
     ];

    var unsupportedTypes = {};
    var questionsRequiringRecalculationOnPageChanges = {};
    
    function updateQuestionsForPageChange(domain) {
        for (var questionID in questionsRequiringRecalculationOnPageChanges) {
            console.log("recalculating question: ", questionID);
            var data = questionsRequiringRecalculationOnPageChanges[questionID];
            // console.log("textNode", data.textNode);
            data.textNode.nodeValue = data.baseText + " " + calculateTextForQuestion(data.question);
        }
    }
    
    function calculateTextForQuestion(question) {
        if (question.type === "questionAnswer") {
            var widget = registry.byId(question.options);
            // console.log("options & widget", question.options, widget);
            if (widget) {
                var value = widget.get("value");
                // TODO: Change or Translate
                if (value === null) value = "<Not Yet Entered>";
                return value;
            } else {
                console.log("ERROR: missing widget: ", question.options, question);
                return "ERROR: missing widget: " + question.options;
            }
        } else if (question.type === "questionAnswerCountOfTotalOnPage") {
            var page = domain.pageDefinitions[question.options];
            if (!page) {
                console.log("ERROR: page not found for: ", question.options, question);
                return "ERROR: page not found for: " + question.options + " at: " + Date();
            }
            console.log("found page", page);
            var questionAskedCount = 0;
            var questionAnsweredCount = 0;
            for (var pageQuestionIndex in page.questions) {
                var pageQuestion = page.questions[pageQuestionIndex];
                console.log("pageQuestion", pageQuestion);
                if (array.indexOf(entryTypes, pageQuestion.type) !== -1) {
                    questionAskedCount++;
                }
                var pageQuestionWidget = registry.byId(pageQuestion.id);
                if (!pageQuestionWidget) {
                    console.log("ERROR: could not find widget for page question", pageQuestion);
                } else {
                    var pageQuestionValue = pageQuestionWidget.get("value");
                    if (pageQuestionValue !== "" && pageQuestionValue !== null) questionAnsweredCount++;
                }
            }
            var percentComplete = Math.round(100 * questionAnsweredCount / questionAskedCount);
            if (questionAskedCount === 0) percentComplete = 0;
            // TODO: Translate
            return "Answered " + questionAnsweredCount + " of " + questionAskedCount + " questions (" + percentComplete + "%)";
        }
        return "UNFINISHED type: " + question.type + " calculated " + Date();
    }
        
    function insertQuestionIntoDiv(question, questionsDiv) {
        // console.log("question", question);
        
       if (supportedTypes.indexOf(question.type) === -1) {
           console.log("insertQuestionIntoDiv unsupportedType", question.type);
           if (!unsupportedTypes[question.type]) unsupportedTypes[question.type] = [];
           unsupportedTypes[question.type].push({"id": question.id, "options": question.options});
           var newQuestion = {};
           // Not supported yet
           newQuestion.text = "TODO: UNSUPPORTED TYPE OF: " + question.type + " FOR ID: " + question.id + " TEXT: " + question.text;
           newQuestion.text += " OPTIONS: " + question.options;
           newQuestion.type = "header";
           question = newQuestion;
         }
        
        var widgetToPlace = null;
        var calculatedText = null;
        
        if (question.type === "boolean") {
           widgetToPlace = widgets.newBoolean(question.id);
        } else if (question.type === "label" || question.type === "header") {
            // Not adding input node for these
           //  widget = widgets.newLabel(question.id, question.text);
        } else if (question.type === "questionAnswer" || question.type === "questionAnswerCountOfTotalOnPage") {
            // TODO; How does this get updated???
           console.log("dynamic", question.type, question, question.options);
           calculatedText = calculateTextForQuestion(question);
           //widgetToPlace = widgets.newLabel(question.id + "_value", question.options);
           // console.log("widget", widget);
        } else if (question.type === "checkbox") {
            widgetToPlace = widgets.newCheckbox(question.id);
        } else if (question.type === "checkboxes") {
            widgetToPlace = widgets.newCheckBoxes(question.id, question.choices, question.options);
        } else if (question.type === "text") {
            widgetToPlace = widgets.newTextBox(question.id);
            widgetToPlace.set("style", "width: 40em");
        } else if (question.type === "textarea") {
            widgetToPlace = widgets.newSimpleTextArea(question.id);
        } else if (question.type === "select") {
            widgetToPlace = widgets.newSelect(question.id, question.choices, question.options);
        } else if (question.type === "radio") {
            widgetToPlace = widgets.newRadioButtons(question.id, question.choices, question.options);
        } else if (question.type === "slider") {
            widgetToPlace = widgets.newSlider(question.id, question.options);
        } else {
            console.log("Unsupported question type: " + question.type);
            console.log("question id & type", question.id, question.type);
            return;
        }
        
        var widget = widgetToPlace;
        // TODO: Slider is special case for now
        if (question.type === "slider") widget = registry.byId(question.id);

        if (question.value && widget) widget.set("value", question.value);

        var questionText;
        if (!question.text) {
            // Try to retrieve question help if not defined and present in translations.js
            questionText = translate(question.id);
        } else {
            // Otherwise, see if can translate the text if it is a tag
            questionText = translate(question.text, question.text);
        }
        
        if (question.type === "header") questionText = "<b>" + questionText + "<b>";
        
        var baseText = questionText;
        
        if (calculatedText !== null) questionText += " " + calculatedText;

        var helpText = "";
        if (!question.help) {
            // Try to retrieve question help if not defined and present in helptexts.html
            helpText = translate(question.id + "_help", "");
        } else {
            // Otherwise, see if can translate the text if it is a tag
            helpText = translate(question.help, question.help);
        }
        // console.log("question help", question.id, question.help, helpText);
        
        var helpWidget = null;
        if (helpText) {
            // var helpText = question.help.replace(/\"/g, '\\x22').replace(/\'/g, '\\x27');
            helpWidget = widgets.newButton(question.id + "_help", "?", null, function() {
                alert(helpText);
            });
            // help = ' <button onclick="alert(\'' + helpText + '\')">?</button>';
        }

        var questionDiv = document.createElement("div");
        questionDiv.id = question.id + "_div";
        questionDiv.className = "question";
        questionDiv.setAttribute("data-js-question-id", question.id);
        questionDiv.setAttribute("data-js-question-type", question.type);
        
        // Save this div for updating later
        var questionTextNode = domConstruct.toDom(questionText);
        if (calculatedText !== null) questionsRequiringRecalculationOnPageChanges[question.id] = {"textNode": questionTextNode, "question": question, "baseText": baseText};
        questionDiv.appendChild(questionTextNode);
        
        questionDiv.appendChild(document.createTextNode(" "));
        if (question.type === "textarea" || question.type === "text") questionDiv.appendChild(document.createElement("br"));
        if (widgetToPlace) questionDiv.appendChild(widgetToPlace.domNode);
        if (helpWidget) questionDiv.appendChild(helpWidget.domNode);
        questionDiv.appendChild(document.createElement("br"));
        // TODO: Probably remove the trailer as no longer being used? Could it be useful? Need to adjust CSS margins if remove
        questionDiv.appendChild(domConstruct.toDom('<div id="' + question.id + '_trailer"/>'));
        questionDiv.appendChild(document.createElement("br"));
        questionsDiv.appendChild(questionDiv);

        if (question.changed && widget) {
            widget.on("change", question.changed);
            //question.changed(widget.get("value"));
        }

        if (question.visible !== undefined && !question.visible) domStyle.set(questionDiv, "display", "none");
        
        return widget;
    }
    
    function insertQuestionsIntoDiv(questions, questionsDiv) {
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            // console.log("insert", questionIndex, question);
            if (!question) console.log("ERROR in uestion definitions for ", questionsDiv, questionIndex, questions);
            question.index = questionIndex;
            insertQuestionIntoDiv(question, questionsDiv);
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
            var widgets = registry.findWidgets(questionEditorDiv);
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
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        // Fill in defaults
        createSurveyQuestions[0].value = question.id;
        createSurveyQuestions[1].value = question.use;
        createSurveyQuestions[2].value = question.type;
        createSurveyQuestions[3].value = question.text;
        createSurveyQuestions[4].value = question.help;
        
        insertQuestionsIntoDiv(createSurveyQuestions, form.domNode);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("questionEdit_ok", "OK", form, function() {
            console.log("OK");
            questionEditDialog.hide();
            questionEditDialogOK(question, questionEditorDiv, form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("questionEdit_cancel", "Cancel", form, function() {
            console.log("Cancel");
            questionEditDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        questionEditDialog = new Dialog({
            title: "Edit question " + question.index,
            content: form,
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
        var editButton = widgets.newButton(question.id + "_edit", "Edit", questionEditorDiv, function() {
            showQuestionEditDialog(question, questionEditorDiv);
        });
        var deleteButton = widgets.newButton(question.id + "_delete", "Delete", questionEditorDiv, function() {
            if (confirm("Proceed to delete question " + question.id + "?")) {
                questionEditorDiv.parentNode.removeChild(questionEditorDiv);
                }
        });
        questionEditorDiv.appendChild(document.createElement("br"));
        insertQuestionIntoDiv(question, questionEditorDiv);
        questionEditorDiv.appendChild(document.createElement("br"));
        questionEditorDiv.setAttribute("data-js-question", JSON.stringify(question));
    }
        
    function insertQuestionEditorDivIntoDiv(question, questionsDiv) {
        var questionEditorDiv = document.createElement("div");
        questionEditorDiv.className = "questionEditor";
        insertQuestionEditorIntoDiv(question, questionEditorDiv);
        questionsDiv.appendChild(questionEditorDiv);
    }
    
    //insertQuestionsIntoDiv(testPuppyQuestions, questionsDiv);
    // insertQuestionsIntoDiv(createSurveyQuestions, questionsDiv);
    
    return {
        "supportedTypes": supportedTypes,
        "unsupportedTypes": unsupportedTypes,
        "insertQuestionIntoDiv": insertQuestionIntoDiv,
        "insertQuestionsIntoDiv": insertQuestionsIntoDiv,
        "insertQuestionEditorDivIntoDiv": insertQuestionEditorDivIntoDiv,
        "questionsRequiringRecalculationOnPageChanges": questionsRequiringRecalculationOnPageChanges,
        "updateQuestionsForPageChange": updateQuestionsForPageChange
    };

});