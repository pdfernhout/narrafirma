define([
    "dojo/_base/array",
    "dojo/_base/connect",
    "js/domain",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/query",
    "js/translate",
    "js/utility",
    "js/widgetBuilder",
    "./grid-table",
    "./widgetSupport",
    "dojo/_base/window",
    "dijit/layout/ContentPane",
    "dstore/Memory",
    "dijit/form/MultiSelect",
    "dijit/form/Select",
    "dojo/Stateful",
    "dojox/layout/TableContainer",
], function(
    array,
    connect,
    domain,
    domConstruct,
    lang,
    query,
    translate,
    utility,
    widgetBuilder,
    widgetGridTable,
    widgetSupport,
    win,
    ContentPane,
    Memory,
    MultiSelect,
    Select,
    Stateful,
    TableContainer
){
    "use strict";
    
    // story browser support
    
    function setOptionsInMultiSelect(widget, options) {
        // console.log("setOptionsInMultiSelect", widget, options);
        query('option', widget.domNode).forEach(function(node, index, arr) {
            // console.log("node", node);
            domConstruct.destroy(node);
        }); 
        
        for (var i in options){
            var c = win.doc.createElement('option');
            c.innerHTML = options[i].label;
            c.value = options[i].value;
            widget.domNode.appendChild(c);
        }
        // console.log("done");
    }
    
    function newMultiSelect(id, options) {
        var widget = new MultiSelect({
            "id": id + "answers1",
            "size": 12,
            "style": "width: 100%;"
            //"options": options
        });
        
        setOptionsInMultiSelect(widget, options);
        
        // selectWidget.on("change", mainSelectChanged);
        
        return widget;
    }
    
    function filterPaneQuestionChoiceChanged(filterPane, newValue) {
        // console.log("event", newValue);
        var question = null;
        for (var index in filterPane.questions) {
            var questionToCheck = filterPane.questions[index];
            if (questionToCheck.id === newValue) {
                question = questionToCheck;
                break;
            }
        }
        if (!question) {
            if (newValue) console.log("could not find question for id", newValue);
            setOptionsInMultiSelect(filterPane.answersMultiSelect, []);
            return;
        }
        //console.log("question", question);
        var options = optionsFromQuestion(question, filterPane.stories);
        setOptionsInMultiSelect(filterPane.answersMultiSelect, options);
    }
    
    // TODO: Translate
    var unansweredIndicator = "{Unanswered}";
        
    function optionsFromQuestion(question, stories) {
        // console.log("*** optionsFromQuestion", question, stories);
        // TODO: Translate text for options, at least booleans?
        var options = [];
        
        if (!question) return options;
        
        // Compute how many of each answer -- assumes typically less than 200-1000 stories
        var totals = {};
        array.forEach(stories, function(item) {
            // console.log("optionsFromQuestion item", item, question.id, item[question.id]);
            var choice = item[question.id];
            if (!choice) {
                // console.log("&&&& Undefined or empty choice", choice);
                choice = unansweredIndicator;
            }
            var oldValue;
            if (question.type === "checkboxes") {
                for (var key in choice) {
                    oldValue = totals[key];
                    if (!oldValue) oldValue = 0;
                    if (choice[key]) totals[key] = oldValue + 1; 
                }
            } else {
                oldValue = totals[choice];
                if (!oldValue) oldValue = 0;
                totals[choice] = oldValue + 1;
            }
        });
        
        var count;
        var each;
        
        // TODO: Maybe should not add the unaswered indicator if zero?
        // Always add the unanswered indicator if not checkboxes or checkbox
        if (question.type !== "checkbox" && question.type !== "checkboxes") {
            count = totals[unansweredIndicator];
            if (!count) count = 0;
            options.push({label: unansweredIndicator + " (" +  count + ")", value: unansweredIndicator});
        }
        
        if (question.type === "select") {
            // console.log("select", question, question.options);
            array.forEach(question.options, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.type === "radiobuttons") {
            // console.log("radiobuttons", question, question.options);
            array.forEach(question.options, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.type === "checkboxes") {
            // console.log("checkboxes", question, question.options);
            array.forEach(question.options, function(each) {
                // console.log("option", question.id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.type === "slider") {
            // console.log("slider", question, question.options);
            for (each = 0; each <= 100; each++) {
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            }
        } else if (question.type === "boolean") {
            // console.log("boolean", question);
            // TODO; Not sure this will really be right with true/false as booleans instead of strings
            array.forEach(["yes", "no"], function(each) {
                // console.log("option", id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.type === "checkbox") {
            // console.log("checkbox", question);
            // TODO; Not sure this will really be right with true/false as checkbox instead of strings
            array.forEach([true, false], function(each) {
                // console.log("option", id, each);
                count = totals[each];
                if (!count) count = 0;
                options.push({label: each + " (" +  count + ")", value: each});
            });
        } else if (question.type === "text") {
            for (var eachTotal in totals){
                if (totals.hasOwnProperty(eachTotal)) {
                    count = totals[eachTotal];
                    if (!count) count = 0;
                    options.push({label: eachTotal + " (" +  count + ")", value: eachTotal});                    
                }
            }
        } else {
            console.log("ERROR: question type not supported: ", question.type, question);
            options.push({label: "*ALL*" + " (" +  stories.length + ")", value: "*ALL*"});
        }
        return options;
    }
    
    function createFilterPane(id, questions, stories, containerPane) {
        var contentPane = new ContentPane({
            id: id + "_content",
            style: "width: 95%;"
            // doLayout: false
        });
        
        containerPane.addChild(contentPane);
         
        var questionSelect = utility.newSelect(id + "_question", widgetSupport.optionsForAllQuestions(questions), null, contentPane);
        questionSelect.set("style", "width: 98%; max-width: 98%");
        
        contentPane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        var answersMultiSelect = newMultiSelect(id + "_answers", []);
        contentPane.addChild(answersMultiSelect);
        
        var filterPane = {"contentPane": contentPane, "questionSelect": questionSelect, "answersMultiSelect": answersMultiSelect, "questions": questions, "stories": stories};

        questionSelect.on("change", lang.partial(filterPaneQuestionChoiceChanged, filterPane)); 

        return filterPane;
    }
    
    function storiesChanged(storyBrowser, stories) {
        // TODO
    }
    
    function questionsChanged(storyBrowser, questions) {
        // TODO
    }
    
    function isMatch(story, questionChoice, selectedAnswerChoices) {
        // console.log("isMatch", questionChoice, selectedAnswerChoices);
        if (!questionChoice) return true;
        var questionAnswer = story[questionChoice];
        if (questionAnswer === undefined || questionAnswer === null || questionAnswer === "") {
            questionAnswer = unansweredIndicator;
        } else if (lang.isObject(questionAnswer)) {
            // checkboxes
            // console.log("checkboxes", questionAnswer);
            for (var key in questionAnswer) {
                if ((selectedAnswerChoices.indexOf(key) !== -1) && questionAnswer[key]) return true;
            }
            return false;
        }
        questionAnswer = "" + questionAnswer;
        // console.log("questionAnswer", questionAnswer);
        return selectedAnswerChoices.indexOf(questionAnswer) !== -1;
    }
    
    // TODO: Fix so the filters get updated as the story questions get changed
    function insertStoryBrowser(pagePane, model, id, pageDefinitions) {
        console.log("insertStoryBrowser start", id);
        
        // TODO: Fix this show also handles participant questions somehow
        var questionnaire = domain.getCurrentQuestionnaire();
        var storyQuestions = questionnaire.storyQuestions;
        
        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: Remove redundancy
        var leadingStoryQuestions = [];
        leadingStoryQuestions.unshift({id: "__survey_" + "storyName", shortName: "storyName", prompt: "Please give your story a name", type: "text", options:[]});
        leadingStoryQuestions.unshift({id: "__survey_" + "storyText", shortName: "storyText", prompt: "Please enter your response to the question above in the space below", type: "textarea", options:[]});
        leadingStoryQuestions.unshift({id: "__survey_" + "elicitingQuestion", shortName: "elicitingQuestion", prompt: "Please choose a question you would like to respond to", type: "select", options: elicitingQuestionPrompts});

        // console.log("DEBUG questions used by story browser", questions);
               
        var questions = [].concat(leadingStoryQuestions, storyQuestions);
        questions.push({id: "__survey_" + "participantData", shortName: "participantData", prompt: "---- participant data below ----", type: "header", options:[]});
        translate.addExtraTranslationsForQuestions(questions);
        
        translate.addExtraTranslationsForQuestions(questionnaire.participantQuestions);
        
        // TODO: add more participant and survey info, like timestamps and participant ID
        
        var popupPageDefinition = {
             "id": "storyBrowserQuestions",
             "questions": questions,
             buildPage: function (builder, contentPane, model) {
                 widgetBuilder.addQuestions(questions, contentPane, model);
                 // TODO: Load correct participant data
                 
                 var participantID = model.get("_participantID");
                 var participantData = domain.getParticipantDataForParticipantID(participantID);
                 var participantDataModel = new Stateful(participantData);
                 widgetBuilder.addQuestions(questionnaire.participantQuestions, contentPane, participantDataModel);
             }
        };

        var stories = domain.projectData.surveyResults.allStories;

        // Store will modify underlying array
        var dataStore = new Memory({
            data: stories,
            idProperty: "_storyID"
        });
        
        // console.log("insertStoryBrowser middle 1", id);
        
        var table = new TableContainer({
            id: id + "_table",
            cols: 2,
            showLabels: false,
            customClass: "storyFilterTable",
            style: "width: 98%;",
            spacing: 10
        });
        
        // console.log("insertStoryBrowser middle 2", id);
        
        var filter1 = createFilterPane(id + "_1", questions, stories, table);
        var filter2 = createFilterPane(id + "_2", questions, stories, table);

        // pagePane.containerNode.appendChild(domConstruct.toDom('<br>'));
        
        // table needs to be added to container after its children are added to it so that the layout will happen correctly, otherwise startup called too soon internally
        if (!pagePane.addChild) {
            alert("TROUBLE -- see log for details");
            console.log("TROUBLE -- does not have addChild method!", pagePane);
            pagePane.containerNode.appendChild(table.domNode);
        } else {
            pagePane.addChild(table);
        }
        
        var storyList;
        
        var filterButton = utility.newButton(id + "_filter", "button_Filter", pagePane, function () {
            // console.log("filter pressed");
            var question1Choice = filter1.questionSelect.get("value");
            var answers1Choices = filter1.answersMultiSelect.get("value");
            // console.log("question1", question1Choice, "answers1", answers1Choices);
            var question2Choice = filter2.questionSelect.get("value");
            var answers2Choices = filter2.answersMultiSelect.get("value");
            // console.log("question2", question2Choice, "answers2", answers2Choices);  
            var filterFunction = function (item) {
                var match1 = isMatch(item, question1Choice, answers1Choices);
                var match2 = isMatch(item, question2Choice, answers2Choices);
                return match1 & match2;
            };
            storyList.grid.set("collection", dataStore.filter(filterFunction));
        });
        
        // console.log("insertStoryBrowser middle 3", id);
        
        // Only allow view button for stories
        var configuration = {viewButton: true, includeAllFields: true};
        storyList = widgetGridTable.insertGridTableBasic(pagePane, id, dataStore, popupPageDefinition, configuration);
        
        console.log("insertStoryBrowser finished");
    }
    
    return {
        "insertStoryBrowser": insertStoryBrowser
    };
    
});