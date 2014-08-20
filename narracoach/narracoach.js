"use strict";

require([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "narracoach/narracoach_questions",
    "dojo/on",
    "dojo/query",
    "dijit/registry",
    "narracoach/translate",
    "dojo/_base/xhr",
    "dojox/charting/plot2d/Bars",
    "dijit/form/Button",
    "dojox/charting/Chart",
    "dijit/form/CheckBox",
    "dojox/charting/plot2d/Columns",
    "dijit/layout/ContentPane",
    "dojox/charting/axis2d/Default",
    "dijit/Dialog",
    "dijit/form/Form",
    "dgrid/Grid",
    "dijit/form/RadioButton",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dijit/form/HorizontalSlider",
    "dojox/charting/plot2d/Lines",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid",
    "dijit/form/Select",
    "dijit/form/SimpleTextarea",
    "dijit/layout/TabContainer",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
    "dojo/domReady!"
    ], function(
        array,
        declare,
        dom,
        domConstruct,
        domStyle,
        narracoach_questions,
        on,
        query,
        registry,
        translate,
        xhr,
        Bars,
        Button,
        Chart,
        CheckBox,
        Columns,
        ContentPane,
        Default,
        Dialog,
        Form,
        Grid,
        RadioButton,
        HorizontalRule,
        HorizontalRuleLabels,
        HorizontalSlider,
        Lines,
        Memory,
        OnDemandGrid,
        Select,
        SimpleTextarea,
        TabContainer,
        TextBox,
        _WidgetBase
    ){

	/*
    var helpTexts = {};
    var helpTextsURL = "narracoach/nls/en/strings_long.html";

    function loadHTMLDivTexts(callback) {
        // Load the help texts; this is needed to know whether to put up help icons, and so must be done before creating pages
	    xhr.get({
	        url: helpTextsURL,
	        load: function(data) {
	            if (data && !data.error) {
	                //console.log("Got helptexts: ", data);
	                //var fragment = document.createDocumentFragment();
	                var div = document.createElement("div");
	                div.innerHTML = data;
	                console.log("div", div);
	                //console.log("fragment", fragment);
	                var children = div.childNodes;
	                for (var i = 0; i < children.length; i++) {
	                    var node = children[i];
	                    // console.log("node", node, node.tagName);
	                    if (node.tagName === "DIV") {
	                        helpTexts[node.id] = node.innerHTML;
	                        translations[node.id] = node.innerHTML;
	                        // console.log("helptext", node.id, node.innerHTML);
	                    }
	                }
	                // console.log("done with query", helpTexts);
	            } else {
	                console.log("Problem loading " + helpTextsURL);
	            }
	            createLayout();
	        },
	        error: function(error) {
	            alert("An unexpected error occurred loading: " + helpTextsURL + " error: " + error);
	            createLayout();
	        },
	     });
    }
    
    loadHTMLDivTexts(createLayout);
    */
    
    var storyList = [
	    { title: "The night the bed fell", body: "Story 1..." },
	    { title: "The golden faucets", body: "Story 2..."},
	    { title: "More pickles!", body: "Story 3...",}
	];
    
    var projectStoriesStore = new Memory({
    	data: storyList,
		// TODO: title may not be unique
        idProperty: "title",
    });
    
    createLayout();

    var storyListGrid;
    
    function createLayout() {
        // Store reference so can be used from inside narracoach_questions.js
        window.narracoach_translate = translate;
        window.narracoach_registry_byId = registry.byId;
        window.narracoach_domStyle = domStyle;
        
        var tabContainer = new TabContainer({
            tabPosition: "left-h",
            //tabPosition: "top",
            style: "width: 100%",
            // have the tab container height change to match internal panel
            doLayout: false,
        }, "tabContainerDiv");

        // Add pages defined in narracoach_questions.js
        
        array.forEach(narracoach_questions.pageList, function(page) {
        	// This page is handled in a popup dialog for story entry
        	if (page.id !== "page_projectStoryEntry") addPage(tabContainer, page);
        });
    
        // Project story list pane
        
        var projectStoryListPane = new ContentPane({
            title: "Project story list"
        });
        
        var pane = projectStoryListPane.containerNode;
             
        var grid = new OnDemandGrid({
        	store: projectStoriesStore,
            columns: {
                title: "Story title",
                body: "Story text",
            }
        });
        
        // grid.renderArray(storyList);
        storyListGrid = grid;
        
        pane.appendChild(grid.domNode);
        grid.startup();
        
        // console.log("grid startup with", storyList, projectStoriesStore);
        
        var addStoryButton = newButton("Add story", pane, addProjectStory);
                
        tabContainer.addChild(projectStoryListPane);
        projectStoryListPane.startup();
        
        // Design questions pane
        
        var designQuestionsPane = new ContentPane({
             title: "Design questions"
        });
        
        pane = designQuestionsPane.containerNode;
        pane.appendChild(domConstruct.toDom("<b>NarraCoach</b>"));
        pane.appendChild(domConstruct.toDom("<br>"));
        pane.appendChild(domConstruct.toDom("Survey Design"));
        pane.appendChild(domConstruct.toDom("<br>"));
        pane.appendChild(domConstruct.toDom('<div id="questionsDiv"/>'));
        var addQuestionButton = newButton("Add question", pane, addQuestion);
        pane.appendChild(document.createElement("br"));
    
        tabContainer.addChild(designQuestionsPane);
        designQuestionsPane.startup();
        
        // Export survey pane
        
        var exportSurveyPane = new ContentPane({
            title: "Export survey"
        });
        
        pane = exportSurveyPane.containerNode;
        var exportSurveyQuestionsButton = newButton("Export survey questions", pane, exportSurveyQuestions);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Definition<br><div id="surveyDiv"></div>'));
        
        tabContainer.addChild(exportSurveyPane);
        exportSurveyPane.startup();
        
        // Take survey pane
        
        var takeSurveyPane = new ContentPane({
            title: "Take survey"
        });
        
        pane = takeSurveyPane.containerNode;
        var takeSurveyButton = newButton("Take survey", pane, takeSurvey);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Results<br><div id="surveyResultsDiv"></div>'));
        
        tabContainer.addChild(takeSurveyPane);
        takeSurveyPane.startup();
        
        // Graph results pane
        
        var graphResultsPane = new ContentPane({
            title: "Graph results"
        });
        
        pane = graphResultsPane.containerNode;
        var takeSurveyButton = newButton("Update Graph", pane, updateGraph);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Graph<br><div id="surveyGraphDiv"></div><div id="chartDiv" style="width: 250px; height: 150px; margin: 5px auto 0px auto;"></div>'));

        tabContainer.addChild(graphResultsPane);
        graphResultsPane.startup();
        
        // Main startup
        
        tabContainer.startup();
    }
    
    function addPage(tabContainer, page) {
        var pageTitle = translate(page.id + "_title");
        if (!pageTitle) {
            var errorMessage = "ERROR: No page title for " + page.id;
            console.log(errorMessage);
            pageTitle = errorMessage;
        }
        
        var pagePane = new ContentPane({
            title: pageTitle,
            style: "width: 100%"
       });

       var pageText = translate(page.id + "_text");
                                
       if (pageText) {
           pagePane.containerNode.appendChild(domConstruct.toDom(pageText));
           pagePane.containerNode.appendChild(domConstruct.toDom("<br><br>"));
       }

       if (page.questions) {
           console.log("questions for page", page.id);
           insertQuestionsIntoDiv(page.questions, pagePane.containerNode);
       }
   
       tabContainer.addChild(pagePane); 
       pagePane.startup();
    }
    
    var testCount = 0;
    
    function addProjectStory() {
    	console.log("addProjectStory pressed");
        var addStoryDialog;
        
        var form = new Form();
        
        var page = narracoach_questions.pageList[2];
        
        var pageText = translate(page.id + "_text");
        
        if (pageText) {
            form.domNode.appendChild(domConstruct.toDom(pageText));
            form.domNode.appendChild(domConstruct.toDom("<br><br>"));
        }

        if (page.questions) {
            console.log("questions for page", page.id);
            insertQuestionsIntoDiv(page.questions, form.domNode);
        }

        // TODO: Does the dialog itself have to be "destroyed"???
        
        newButton("OK", form, function() {
            console.log("OK");
            addStoryDialog.hide();
            // addStoryDialogOK(question, questionEditorDiv, form);

            var count = ++testCount;
            var newStory = { title: "More pickles " + count + "!", body: "Story " + count + "...",};
            projectStoriesStore.put(newStory);
            storyListGrid.refresh();
            
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        newButton("Cancel", form, function() {
            console.log("Cancel");
            addStoryDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        addStoryDialog = new Dialog({
            title: "Add project story",
            content: form,
            style: "width: 600px; height 800px; overflow: auto;",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        addStoryDialog.startup();
        addStoryDialog.show();
    }
    
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
    
    function isString(something) {
        return (typeof something == 'string' || something instanceof String);
    }
        
    function newButton(label, addToDiv, callback) {
        var button = new Button({
            label: label,
            type: "button",
            onClick: callback
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            button.placeAt(addToDiv);
        }
        // TODO: Is startup call really needed here?
        button.startup();
        return button.domNode;
    }
    
    function newTextBox(id, addToDiv) {
        var textBox = new TextBox({
            id: id,
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            textBox.placeAt(addToDiv);
        }
        // TODO: Is startup call really needed here?
        textBox.startup();
        return textBox.domNode;
    }
    
    function newSimpleTextArea(id, addToDiv) {
        var textarea = new SimpleTextarea({
            id: id,
            rows: "4",
            cols: "50",
            style: "width:auto;"
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            textarea.placeAt(addToDiv);
        }
        textarea.startup();
        return textarea.domNode;
    }
    
    function newSelect(id, choices, optionsString, addToDiv) {
        var options = [];
        if (choices) {
            array.forEach(choices, function(each) {
                var label = translate(id + "_choice_" + each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                options.push({label: each, value: each});
            });
        }
        var select = new Select({
                id: id,
                options: options
        });
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            select.placeAt(addToDiv);
        }
        select.startup();
        return select.domNode;
    }

    function buildOptions(id, choices, optionsString){
        var options = [];
        
        if (choices) {
            array.forEach(choices, function(each) {
                var label = translate(id + "_choice_" + each);
                options.push({label: label, value: each});
            });           
        } else if (optionsString) {
            array.forEach(optionsString.split("\n"), function(each) {
                var translateID = id + "_choice_" + each;
                if (optionsString === "yes\nno") translateID = "boolean_choice_" + each;
                var label = translate(translateID, each);
                options.push({label: label, value: each});
            });
        }
        
        return options;
    }
    
    declare("RadioButtonsWidget", [_WidgetBase], {
        value: null,
        choices: null,
        optionsString: null,
    
        buildRendering: function() {
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
            var options = buildOptions(id, this.choices, this.optionsString);
    
            array.forEach(options, function (option) {
                var choiceID = id + "_choice_" + option.value;
                var radioButton = new RadioButton({
                    checked: false,
                    value: option.value,
                    name: id,
                    "id": choiceID,
                });
                radioButton.placeAt(div);
                on(radioButton, "click", function(evt) {
                    // console.log("radio clicked", evt.target);
                    self.set("value", evt.target.value);
                });
                radioButton.startup();
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },

        _setValueAttr: function(value) {
            // TODO: Need to select radio button when this is called, but not if call it from inside widget on change
            this.value = value;
        },
    });

    function newRadioButtons(id, choices, optionsString, addToDiv) {
        var radioButtons = RadioButtonsWidget({
            id: id,
            choices: choices,
            optionsString: optionsString
        });
         
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(radioButtons.domNode);
        }
        radioButtons.startup();
        return radioButtons.domNode;
    }
    
    // TODO: Very similar to RadioButtonsWidget
    // TODO: Set an optional minimum and maximum number that may be checked and validate for that
    declare("CheckBoxesWidget", [_WidgetBase], {
        value: {},
        choices: null,
        optionsString: null,
    
        buildRendering: function() {
            // create the DOM for this widget
            // declare id var as "this" will not be defined inside array loop functions
            var id = this.id;
            var self = this;
            var div = domConstruct.create("div");
            var options = buildOptions(id, this.choices, this.optionsString);
    
            array.forEach(options, function (option) {
                var choiceID = id + "_choice_" + option.value;
                var checkBox = new CheckBox({
                    value: option.value,
                    "id": choiceID,
                });
                checkBox.placeAt(div);
                self.value[option.value] = false;
                on(checkBox, "click", function(evt) {
                    var localChoiceID = evt.target.defaultValue;
                    var checked = evt.target.checked;
                    self.value[localChoiceID] = checked;
                    // console.log("clicked checkbox", evt, localChoiceID, checked, self.value);
                    // TODO: send changed message?
                });
                checkBox.startup();
                div.appendChild(domConstruct.toDom('<label for="' + choiceID + '">' + option.label + '</label><br>'));
            });
            
            this.domNode = div;
        },
        
        _setValueAttr: function(value) {
            // TODO: Need to select checkboxes when this is called, but not if call it from inside widget on change
            this.value = value;
        },
    });

    function newCheckBoxes(id, choices, optionsString, addToDiv) {
        var checkBoxes = CheckBoxesWidget({
            id: id,
            choices: choices,
            optionsString: optionsString
        });
         
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(checkBoxes.domNode);
        }
        checkBoxes.startup();
        return checkBoxes.domNode;
    }
    
    function newSlider(id, options, addToDiv) {                     
        // A div that contains rules, labels, and slider
        var panelDiv = domConstruct.create("div");
        
        // TODO: Maybe these rules and labels need to go into a containing div?
        // TODO: But then what to return for this function if want to return actual slider to get value?
        
        var hasTextLabels = false;
        var labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        if (options) {
            var labels = options.split("\n");
            if (labels.length != 2) {
                console.log("Need to specify low and high labels for quesiton: ", id);
            } else {
                hasTextLabels = true;
                var labelLow = labels[0].trim();
                var labelHigh = labels[1].trim();
                labels = [labelLow, labelHigh];
            }
        }
        
        console.log("labels", labels, labels.length);
        
        var slider = new HorizontalSlider({
            id: id,
            minimum: 0,
            maximum: 100,
            discreteValues: 101,
            showButtons: true,
            // Doesn;t work: style: "align: center; width: 80%;"
            style: "width: 80%;"

        });
        
        slider.placeAt(panelDiv);
         
        //if (!hasTextLabels) {}
        // Create the rules
        var rulesNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderRules = new HorizontalRule({
            container: "bottomDecoration",
            count: labels.length,
            style: "height: 5px"
        }, rulesNode);
        //}

        // Create the labels
        var labelsNode = domConstruct.create("div", {}, slider.containerNode);
        var sliderLabels = new HorizontalRuleLabels({
            container: "bottomDecoration",
            style: "height: 1.5em; font-weight: bold",
            minimum: 0,
            maximum: 100,
            count: labels.length,
            numericMargin: 1,
            labels: labels,
        }, labelsNode);

        slider.startup();
        // if (!hasTextLabels)
        sliderRules.startup();
        sliderLabels.startup();
        
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(panelDiv);
        }
        
        return panelDiv;
    }
    
    function newBoolean(id, addToDiv) {
        var radioButtons = RadioButtonsWidget({
            id: id,
            choices: null,
            optionsString: "yes\nno",
        });
         
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(radioButtons.domNode);
        }
        radioButtons.startup();
        return radioButtons.domNode;
    }

    function newCheckbox(id, addToDiv) {
        var checkbox = new CheckBox({
            id: id
        });
        
        if (isString(addToDiv)) {
            addToDiv = document.getElementById(addToDiv);
        }
        if (addToDiv) {
            addToDiv.appendChild(checkbox);
        }
        
        return checkbox.domNode;
    }
    
    function insertQuestionIntoDiv(question, questionsDiv) {
        // console.log("question", question);
        var inputNode;
        if (question.type === "boolean") {
           inputNode = newBoolean(question.id);
        } else if (question.type === "checkbox") {
           inputNode = newCheckbox(question.id);
        } else if (question.type === "checkboxes") {
            inputNode = newCheckBoxes(question.id, question.choices, question.options);
        } else if (question.type === "text") {
            inputNode = newTextBox(question.id);
        } else if (question.type === "textarea") {
            inputNode = newSimpleTextArea(question.id);
        } else if (question.type === "select") {
            inputNode = newSelect(question.id, question.choices, question.options);
        } else if (question.type === "radio") {
            inputNode = newRadioButtons(question.id, question.choices, question.options);
        } else if (question.type === "slider") {
            inputNode = newSlider(question.id, question.options);
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
            helpNode = newButton("?", null, function() {
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
        
        newButton("OK", form, function() {
            console.log("OK");
            questionEditDialog.hide();
            questionEditDialogOK(question, questionEditorDiv, form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        newButton("Cancel", form, function() {
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
        var editButton = newButton("Edit", questionEditorDiv, function() {
            showQuestionEditDialog(question, questionEditorDiv);
        });
        var deleteButton = newButton("Delete", questionEditorDiv, function() {
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
    
    // TODO: Challenge of repeating sections....
            
    function addQuestion() {
        var questionsDiv = document.getElementById("questionsDiv");
        questionsDiv.innerHTML += "<div>Add question button pressed at: " + Date.now() + "</div>";
    }
    
    var questionIndex = 1;
    
    function addQuestion() {
        var questionsDiv = document.getElementById("questionsDiv");
        var question = {index: questionIndex, id: "Q" + questionIndex, type: "text", text: "Question text " + questionIndex, help: 'Question help ' + questionIndex};
        questionIndex += 1;
        insertQuestionEditorDivIntoDiv(question, questionsDiv);
    }
    
    var surveyResults = [];
    var surveyItemPrefix = "survey_";
    
    function submitSurvey(form) {
        var answers = {};
        console.log("submitSurvey pressed");
        var nodes = query(".narracoachQuestion", form.domNode);
        // console.log("nodes", nodes);
        nodes.forEach(function(questionDiv) {
            console.log("submitSurvey question Node", questionDiv);
            var questionID = questionDiv.getAttribute("data-narracoach-question-id");
            var valueNode = registry.byId(questionID);
            var questionValue = undefined;
            if (valueNode) questionValue = valueNode.get("value");
            console.log("answer", questionDiv, questionID, valueNode, questionValue);
            // trim off "survey_" part of id
            // var questionID = questionID.substring(surveyItemPrefix.length);
            answers[questionID] = questionValue;
        });
        
        console.log("answers", JSON.stringify(answers));
        surveyResults.push(answers);
        
        var surveyResultsDiv = document.getElementById("surveyResultsDiv");
        surveyResultsDiv.innerHTML = JSON.stringify(surveyResults);
    }
    
    var exportedSurveyQuestions = [];
    
    function exportSurveyQuestions() {
        var questions = [];
        var nodes = query(".narracoachQuestionEditor", "questionsDiv");
        // console.log("nodes", nodes);
        nodes.forEach(function(node) {
            // console.log("Node", node);
            var questionText = node.getAttribute("data-narracoach-question");
            var question = JSON.parse(questionText);
            question.id = surveyItemPrefix + question.id;
            questions.push(question);
        });
        console.log("questions", JSON.stringify(questions));
        var surveyDiv = document.getElementById("surveyDiv");
        surveyDiv.innerHTML = JSON.stringify(questions);
        exportedSurveyQuestions = questions;
        // insertQuestionsIntoDiv(questions, surveyDiv);
        // var submitSurveyButton = newButton("Submit survey", "surveyDiv", submitSurvey);
    }

    function takeSurvey() {
        var surveyDialog;
        
        var form = new Form();
        
        insertQuestionsIntoDiv(exportedSurveyQuestions, form.domNode);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        newButton("Submit survey", form, function() {
            console.log("Submit survery");
            surveyDialog.hide();
            submitSurvey(form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        newButton("Cancel", form, function() {
            console.log("Cancel");
            surveyDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form,
            style: "width: 600px",
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
        surveyDialog.startup();
        surveyDialog.show();
    }
    
    function updateGraph() {
        console.log("updateGraph");
        
        var widgets = dijit.findWidgets("chartDiv");
        array.forEach(widgets, function(widget) {
            widget.destroyRecursive(true);
        });
        domConstruct.empty("chartDiv");
        
        var chart1Div = domConstruct.create("div", {style: "width: 500px; height: 500px;"}, "chartDiv");
        
        var chart1Data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var chart1Title = "Title goes here";
        
        var theSlider = null;
        array.forEach(exportedSurveyQuestions, function(each) {
            if (each.type == "slider") {
                theSlider = each.id;
                chart1Title = each.text;
            }
        });
        
        if (theSlider != null) {
            array.forEach(surveyResults, function(each) {
                var answer = each[theSlider];
                console.log("answer", answer);
                var slot = Math.round(answer / 10);
                chart1Data[slot] += 1;
            });
        }
        
        // var chart1Data = [1, 2, 2, 3, 4, 5, 5, 2];
        
        var chart1 = new Chart(chart1Div, {title: chart1Title});
        console.log("Made chart");
        chart1.addPlot("default", {
            type: Columns,
            markers: true,
            gap: 5
        });
        
        // labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        // includeZero: true,
        
        chart1.addAxis("x", { labels: [
            {value: 1, text: "0-4"},
            {value: 2, text: "10"},
            {value: 3, text: "20"},
            {value: 4, text: "30"},
            {value: 5, text: "40"},
            {value: 6, text: "50"},
            {value: 7, text: "60"},
            {value: 8, text: "70"},
            {value: 9, text: "80"},
            {value: 10, text: "90"},
            {value: 11, text: "95-100"}
        ]});
        chart1.addAxis("y", {vertical: true, includeZero: true});
        chart1.addSeries("Series 1", chart1Data);
        chart1.render();
        
        /*
        var chart2Div = domConstruct.create("div", {}, "chartDiv");
        
        var chart2 = new Chart(chart2Div);
        console.log("Made chart 2");
        chart2.addPlot("default", {type: Lines});
        chart2.addAxis("x");
        chart2.addAxis("y", {vertical: true});
        chart2.addSeries("Series 1", [10, 12, 2, 3, 4, 5, 5, 7]);
        chart2.render();
        */
        
        // var surveyGraphDiv = document.getElementById("surveyGraphDiv");
        // chart1.placeAt(surveyGraphDiv);     
    }
});