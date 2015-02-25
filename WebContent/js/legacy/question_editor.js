// Currently BROKEN

define([
    "dojo/_base/array",
    "dojo/dom",
    "js/domain",
    "dojo/dom-construct",
    "dojo/dom-style",
    "exports",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "js/translate",
    "js/utility",
    "js/widgets",
    "js/widgets/grid-table",
    "js/widgets/questions-table",
    "js/widgets/story-browser",
    "dijit/Dialog",
    "dijit/form/Form"
], function(
    array,
    dom,
    domain,
    domConstruct,
    domStyle,
    exports,
    lang,
    on,
    registry,
    translate,
    utility,
    widgets,
    widgetGridTable,
    widgetQuestionsTable,
    widgetStoryBrowser,
    Dialog,
    Form
){
    "use strict";
    
    // TODO: KLUDGE: Created insertQuestionIntoDiv stub function to get jslint warnings to go away, but needs to be fixed if this were to be useable
    function insertQuestionIntoDiv() {
        throw new Error("KLUDGE needs to be fixed");
    }

    var testPuppyQuestions = [
        {id: "name", type: "text", text: "Your Name", help: 'Please enter your \'full\' name, like "John Smith".'},
        {id: "wantPuppy", type: "boolean", text: "Do you want a free puppy today?", help: "Enter yes or no"},
        {id: "reason", type: "text", text: "If yes, why do you want a free puppy?"}
    ];
    
    var createSurveyQuestions = [
        {id: "questionID", type: "text", text: "Question ID", help: 'TODO'},
        {id: "questionUse", type: "select", text: "Question Use", help: 'TODO', options: "story title\nstory text\nquestion about story\nquestion about participant"},
        {id: "questionType", type: "select", text: "Question Type", help: 'TODO', options: "text\ntextarea\nboolean\ncheckbox\nselect\nslider"},
        {id: "questionText", type: "textarea", text: "Question Text", help: 'TODO'},
        {id: "questionHelp", type: "textarea", text: "Question Help", help: 'TODO'},
        {id: "questionOptions", type: "textarea", text: "Question Options", help: 'Enter options here, one per line'}
    ];
    
    function insertQuestionsIntoDiv(questions, questionsDiv) {
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            // console.log("insert", questionIndex, question);
            if (!question) console.log("ERROR in question definitions for ", questionsDiv, questionIndex, questions);
            question.index = questionIndex;
            insertQuestionIntoDiv(question, questionsDiv);
        }
    }
    
    function questionEditDialogOK(question, questionEditorDiv, form) {
        var changed = false;
        
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
        var questionEditDialog = null;
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        // Fill in defaults
        createSurveyQuestions[0].value = question.id;
        createSurveyQuestions[1].value = question.use;
        createSurveyQuestions[2].value = question.type;
        createSurveyQuestions[3].value = question.text;
        createSurveyQuestions[4].value = question.help;
        
        insertQuestionsIntoDiv(createSurveyQuestions, form.containerNode);
        
        widgets.newButton("questionEdit_ok", "OK", form, function() {
            console.log("OK");
            questionEditDialogOK(question, questionEditorDiv, form);
            questionEditDialog.hide();
        });
        
        widgets.newButton("questionEdit_cancel", "Cancel", form, function() {
            console.log("Cancel");
            questionEditDialog.hide();
        });

        questionEditDialog = new Dialog({
            title: "Edit question " + question.index,
            content: form
        });
        
        // This will free the dialog when we are done with it whether from OK or Cancel to avoid a memory leak
        questionEditDialog.connect(questionEditDialog, "onHide", function(e) {
            console.log("destroying surveyDialog");
            questionEditDialog.destroyRecursive(); 
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
    
    var addToExports = {
        "insertQuestionsIntoDiv": insertQuestionsIntoDiv,
        "insertQuestionEditorDivIntoDiv": insertQuestionEditorDivIntoDiv,
    };
    
    lang.mixin(exports, addToExports);

});